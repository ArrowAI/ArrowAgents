import { ExecutionType, FlowJson } from "./interfaces";


import { DB } from './../services/flowservice'
import { IntegrationInterface } from "../actionmodules/interfaces";
import { FlowState } from "../engine/flowexecutorstore";
import { Activity, Flow, Function, INode } from "./flow";
export class FlowExecuteHandler {
    constructor() {

    }

    getCurrentNode(nodes: IntegrationInterface[]) {
        const currentNode = nodes[0]; // filter current node from nodes
        return currentNode;
    }
    execute(executionState: FlowState, flowId: string) {
        const flow: any = DB.getFlow(flowId);
        const nodes: any[] = flow.nodes;
        const connections: any[] = flow.connections;
        // return this.iterateGraph(nodes, connections, executionState);
    }
    async startActivity(activity: any, executionState: FlowState) {
        let activityObject: Activity = new Activity(activity);
        let mainFunction: Function = activityObject.functions.find((func: any) => func.name === 'main')!;
        if (!mainFunction) {
            throw new Error('No main function found');
        }
        else {
            let currentNode: INode = mainFunction.flow.nodes.find((node: any) => node.data.name === 'Start');

            return await this.iterateGraph(mainFunction.flow, currentNode, executionState, 'default');
        }


    }
    async iterateGraph(flow: Flow, currentNode: INode, executionState: FlowState, outputcontrolName: string = "default") {
        try {
            let nodeToExecute: INode = flow.getNextControlNode(currentNode.id, outputcontrolName);
            // console.log(nodeToExecute)
            if (nodeToExecute) {
                let result = await this.executeControlNode(flow, nodeToExecute, executionState);
                return result;

            }
        } catch (error) {
            console.log(error)
        }

    }
    async executeControlNode(flow: Flow, nodeToExecute: INode, executionState: FlowState) {
        let subgraph: Flow = flow.getSubGraphOfAllConnectedDataNodes(nodeToExecute.id);
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
        const startingNodes = subgraph.nodes.filter((nd: any) => startingNodeIds.includes(nd.id));
        // console.log(startingNodes)
        let componentNodes: any = {
            variable: { filePath: "/Users/ravirawat/Documents/ArrowAgents/nodes/numberVariable.ts" },
            addnumbers: { filePath: "/Users/ravirawat/Documents/ArrowAgents/nodes/sum.ts" }
        }
        /*** BFS to traverse from Starting Nodes to Ending Node ***/
        const flowNodes = await flow.processConnectedDataNodes(startingNodeIds, subgraph.nodes, subgraph.edges, graph, depthQueue, componentNodes, "", [], "chatId", "sessionId" ?? '', subgraph.id, {}, {}, {})
        nodeToExecute = endingNodeIds.length === 1 ? flowNodes.find((node: any) => endingNodeIds[0] === node.id) : flowNodes[flowNodes.length - 1]
        if (!nodeToExecute) return new Error("Node not found")
        const reactFlowNodeData: any = flow.resolveVariables(nodeToExecute.data, flowNodes, "", []);
        let nodeToExecuteData: any = reactFlowNodeData;
        console.log(`[server]: Running ${nodeToExecuteData.label} (${nodeToExecuteData.id})`)
        const nodeInstanceFilePath = componentNodes[nodeToExecuteData.name].filePath as string
        const nodeModule = await import(nodeInstanceFilePath)
        const nodeInstance = new nodeModule.nodeClass();
        let result = await nodeInstance.run(nodeToExecuteData, "", {
        });
        console.log("final result", result);
        return result;
    }
    async executeDataGraph() {


    }

    // async iterateGraph(workflow: any, executionState?: FlowState) {
    // console.log(workflow);
    // let { nodes, connections } = workflow.functions.main.flow;
    //This will be called to iterate and process the graph. This will have logic to handle control node, data Node, Parallelization, Multi Server etc.

    //    let currentNode = nodes.find((node: any) => node.name === 'Start');
    //     console.log(currentNode)
    //     let flowExecutionContext = executionState!;
    //     while (currentNode) {
    //         console.log(currentNode);
    // // process all data node connected to the current node before execution of current node
    // const connectedDataNodes = connections
    //     .filter((connection: any) => connection.source === currentNode.id)
    //     .map((connection: any) => nodes.find((node:any) => node.id === connection.target))
    //     .filter((node:any) => node && node.type === 'data');

    // for (const dataNode of connectedDataNodes) {
    //     console.log(`Processing data node: ${dataNode.id}`);
    //     const actionExecutor = DB.getActionExecutor(dataNode);
    //     flowExecutionContext.context = await actionExecutor.execute(dataNode.actions[0].actionId!);
    // }

    // // process the current node
    // console.log(`Processing ${currentNode.type} node: ${currentNode.id}`);
    // const actionExecutor = DB.getActionExecutor(currentNode);
    // flowExecutionContext.context = await actionExecutor.execute(currentNode.actions[0].actionId!);
    // // find the next node in the graph
    // const nextNode = connections.find((connection: any) => connection.source === currentNode.id);
    // if (!nextNode) {
    //     // if there's no next node, we've reached the end of the graph
    //     break;
    // }
    // // update the current node to the next node
    // currentNode = nodes.find((node: any) => node.id === nextNode.target);
    // break
    // }
    // console.log('Workflow execution complete.');

    // return flowExecutionContext;

    // }

    async processControlNode(node: any, edeges: any, executionState: FlowState) {
    }



}