
import { Subject } from 'rxjs';
import { Activity, Flow, FlowState, Function, INode, OutputControlObservableValue } from './lib/flow';
let subject = new Subject<any>();
// Assuming you have a way to get the output control node observable based on nodeId and outputcontrolPinId

const writeToJsonFile = async (filePath: string, obj: unknown) => {
    const serializedObj = JSON.stringify(obj, (_key: string, value: unknown) => {
        if (value instanceof Map) {
            return Object.fromEntries(value)
        }
        else {
            return value
        }
    })

}

export function getOutputControlObservable(): Subject<any> {
    return subject
}
export const execute = async (json: any) => {
    //
    let jsonResponse = await startActivity(json, {
        context: {}, currentNodeId: '',
        flowId: "",
        flow: undefined
    })
    let writeVariable='node:fs/promises'
    let { writeFile } = await import(writeVariable);
    await writeFile('./output.json',JSON.stringify(jsonResponse), 'utf-8')
    // await writeToJsonFile('./output.json', jsonResponse)

}

const startActivity = async (activity: any, executionState: FlowState) => {
    let activityObject: Activity = new Activity(activity);
    let mainFunction: Function = activityObject.functions.find((func: any) => func.name === 'main')!;
    if (!mainFunction) {
        throw new Error('No main function found');
    }
    else {
        let currentNode: INode = mainFunction.flow.nodes.find((node: any) => node.data.name === 'Start');
        return await iterateGraph(mainFunction.flow, currentNode, executionState, 'default');
    }
}
const iterateGraph = async (flow: Flow, currentNode: INode, executionState: FlowState, outputcontrolName: string = "default") => {
    try {
        let nodeToExecute: INode | null = flow.getNextControlNode(currentNode.id, outputcontrolName);
        // console.log(nodeToExecute)
        if (nodeToExecute != null) {
            let result = await executeControlNode(flow, nodeToExecute, executionState);
            return result;

        }
        else {
            console.log("no control node found after current node after", outputcontrolName)

            return nodeToExecute
        }
    } catch (error) {
        console.log(error)
        return error
       
    }

}
const executeControlNode = async (flow: Flow, nodeToExecute: INode, executionState: FlowState) => {
    executionState.flow = flow
    executionState.currentNodeId = nodeToExecute.id;
    console.log(executionState.currentNodeId)
    let subgraph: Flow = flow.getSubGraphOfAllConnectedDataNodes(nodeToExecute.id);

    subgraph = flow.removeConnectedNodesWithInputControls(subgraph, nodeToExecute.id);
    console.log("subgraph of current control node", subgraph)

    // return
    // Logic From Flowise as now subgraph is same sa Flowise flow  
    const { graph, nodeDependencies } = flow.constructGraphs(subgraph.nodes, subgraph.edges);
    const directedGraph = graph
    const endingNodeIds = flow.getEndingNodes(nodeDependencies, directedGraph);

    //console.log("ending node id", endingNodeIds)
    if (!endingNodeIds.length) return (`Ending nodes not found`);
    const endingNodes = subgraph.nodes.filter((nd: any) => endingNodeIds.includes(nd.id));
    /*** Get Starting Nodes with Reversed Graph ***/
    const constructedObj = flow.constructGraphs(subgraph.nodes, subgraph.edges, { isReversed: true })
    const nonDirectedGraph = constructedObj.graph
    let startingNodeIds: string[] = []
    let depthQueue: any = {}
    for (const endingNodeId of endingNodeIds) {
        const res = flow.getStartingNodes(nonDirectedGraph, endingNodeId)
        startingNodeIds.push(...res.startingNodeIds)
        depthQueue = Object.assign(depthQueue, res.depthQueue)
    }
    startingNodeIds = [...new Set(startingNodeIds)]
    // console.log(endingNodeIds)

    const startingNodes = subgraph.nodes.filter((nd: any) => startingNodeIds.includes(nd.id));

    // console.log(startingNodes);
    let componentNodes: any = {
        variable: "@arrowagents/variable",
        addnumbers: "@arrowagents/addnumbers",
        setvariable: "@arrowagents/setvariable"
    }
    /*** BFS to traverse from Starting Nodes to Ending Node ***/
    const flowNodes = await flow.processConnectedDataNodes(startingNodeIds, subgraph.nodes, subgraph.edges, graph, depthQueue, componentNodes, "", [], "chatId", "sessionId" ?? '', subgraph.id, {}, executionState);
    //TODO:Store Previous Node Data To Context
    nodeToExecute = endingNodeIds.length === 1 ? flowNodes.find((node: any) => endingNodeIds[0] === node.id) : flowNodes[flowNodes.length - 1]
    if (!nodeToExecute) return new Error("Node not found")
    const reactFlowNodeData: any = flow.resolveVariables(nodeToExecute.data, flowNodes, "", []);

    let nodeToExecuteData: any = reactFlowNodeData;
    // console.log(`[server]: Running ${nodeToExecuteData.label} (${nodeToExecuteData.id})`)
    // console.log("node is ",nodeToExecuteData.name)
    const nodeNoduleName = componentNodes[nodeToExecuteData.name] as string

    const nodeModule = await import(nodeNoduleName)
    const nodeInstance = new nodeModule.nodeClass();
    subscribeOutputControlNode()
    // console.log(reactFlowNodeData)
    // console.log(nodeToExecuteData);

    executionState.context.OutputControlObservable = getOutputControlObservable()
    if (nodeToExecute.id == 'addnumbers1')
        return nodeToExecuteData
    let result = await nodeInstance.run(nodeToExecuteData, "", executionState);
    // console.log("final result", result);
    return nodeToExecuteData;
}

const subscribeOutputControlNode = () => {
    const outputControlObservable = getOutputControlObservable();
    const subscription = outputControlObservable.subscribe({
        next: async (output: OutputControlObservableValue) => {
            let flow = output.flowState.flow;
            // Handle the emitted value from the output control node
            console.log('Received value from output control node:', output.outputcontrolPinId,);
            // return;
            let currentNode = flow.nodes.find((node: any) => node.id === output.flowState.currentNodeId);
            console.log("current Node Id", currentNode.id)
            // return
            await iterateGraph(flow, currentNode, output.flowState, output.outputcontrolPinId);
        },
        error: (err: any) => {
            // Handle any errors that occur during the subscription
            // console.error('Error occurred:', err);
        },
        complete: () => {
            // Handle completion of the observable stream
            console.log('Output control node completed');
        }
    });

    // Store the subscription somewhere if you need to unsubscribe later
    // context.subscriptions.push(subscription);
}

// execute({})

var workflow = require('./../../../agentserver/datajson/controlflowTest.json');

execute(workflow).then((result) => {
    console.log(result)
})
