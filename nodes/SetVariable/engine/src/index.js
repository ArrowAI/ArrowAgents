"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.getOutputControlObservable = void 0;
const rxjs_1 = require("rxjs");
const flow_1 = require("./lib/flow");
let subject = new rxjs_1.Subject();
// Assuming you have a way to get the output control node observable based on nodeId and outputcontrolPinId
function getOutputControlObservable() {
    return subject;
}
exports.getOutputControlObservable = getOutputControlObservable;
const execute = async (json) => {
    await startActivity(json, {
        context: {}, currentNodeId: '',
        flowId: "",
        flow: undefined
    });
};
exports.execute = execute;
const startActivity = async (activity, executionState) => {
    let activityObject = new flow_1.Activity(activity);
    let mainFunction = activityObject.functions.find((func) => func.name === 'main');
    if (!mainFunction) {
        throw new Error('No main function found');
    }
    else {
        let currentNode = mainFunction.flow.nodes.find((node) => node.data.name === 'Start');
        return await iterateGraph(mainFunction.flow, currentNode, executionState, 'default');
    }
};
const iterateGraph = async (flow, currentNode, executionState, outputcontrolName = "default") => {
    try {
        let nodeToExecute = flow.getNextControlNode(currentNode.id, outputcontrolName);
        // console.log(nodeToExecute)
        if (nodeToExecute != null) {
            let result = await executeControlNode(flow, nodeToExecute, executionState);
            return result;
        }
        else {
            console.log("no control node found after current node after", outputcontrolName);
        }
    }
    catch (error) {
        console.log(error);
    }
};
const executeControlNode = async (flow, nodeToExecute, executionState) => {
    executionState.flow = flow;
    executionState.currentNodeId = nodeToExecute.id;
    console.log(executionState.currentNodeId);
    let subgraph = flow.getSubGraphOfAllConnectedDataNodes(nodeToExecute.id);
    subgraph = flow.removeConnectedNodesWithInputControls(subgraph, nodeToExecute.id);
    console.log("subgraph of current control node", subgraph);
    // return
    // Logic From Flowise as now subgraph is same sa Flowise flow  
    const { graph, nodeDependencies } = flow.constructGraphs(subgraph.nodes, subgraph.edges);
    const directedGraph = graph;
    const endingNodeIds = flow.getEndingNodes(nodeDependencies, directedGraph);
    //console.log("ending node id", endingNodeIds)
    if (!endingNodeIds.length)
        return (`Ending nodes not found`);
    const endingNodes = subgraph.nodes.filter((nd) => endingNodeIds.includes(nd.id));
    /*** Get Starting Nodes with Reversed Graph ***/
    const constructedObj = flow.constructGraphs(subgraph.nodes, subgraph.edges, { isReversed: true });
    const nonDirectedGraph = constructedObj.graph;
    let startingNodeIds = [];
    let depthQueue = {};
    for (const endingNodeId of endingNodeIds) {
        const res = flow.getStartingNodes(nonDirectedGraph, endingNodeId);
        startingNodeIds.push(...res.startingNodeIds);
        depthQueue = Object.assign(depthQueue, res.depthQueue);
    }
    startingNodeIds = [...new Set(startingNodeIds)];
    // console.log(endingNodeIds)
    const startingNodes = subgraph.nodes.filter((nd) => startingNodeIds.includes(nd.id));
    // console.log(startingNodes);
    let componentNodes = {
        variable: { filePath: "/Users/ravirawat/Documents/ArrowAgents/nodes/NumberVariable/index.ts" },
        addnumbers: { filePath: "/Users/ravirawat/Documents/ArrowAgents/nodes/Sum/index.ts" },
        setVariable: { filePath: "/Users/ravirawat/Documents/ArrowAgents/nodes/SetVariable/index.ts" }
    };
    /*** BFS to traverse from Starting Nodes to Ending Node ***/
    const flowNodes = await flow.processConnectedDataNodes(startingNodeIds, subgraph.nodes, subgraph.edges, graph, depthQueue, componentNodes, "", [], "chatId", "sessionId" !== null && "sessionId" !== void 0 ? "sessionId" : '', subgraph.id, {}, executionState);
    //TODO:Store Previous Node Data To Context
    nodeToExecute = endingNodeIds.length === 1 ? flowNodes.find((node) => endingNodeIds[0] === node.id) : flowNodes[flowNodes.length - 1];
    if (!nodeToExecute)
        return new Error("Node not found");
    const reactFlowNodeData = flow.resolveVariables(nodeToExecute.data, flowNodes, "", []);
    let nodeToExecuteData = reactFlowNodeData;
    // console.log(`[server]: Running ${nodeToExecuteData.label} (${nodeToExecuteData.id})`)
    // console.log("node is ",nodeToExecuteData.name)
    const nodeInstanceFilePath = componentNodes[nodeToExecuteData.name].filePath;
    const nodeModule = await Promise.resolve(`${nodeInstanceFilePath}`).then(s => __importStar(require(s)));
    const nodeInstance = new nodeModule.nodeClass();
    subscribeOutputControlNode();
    // console.log(reactFlowNodeData)
    // console.log(nodeToExecuteData);
    if (nodeToExecute.id == 'addnumbers1')
        return;
    let result = await nodeInstance.run(nodeToExecuteData, "", executionState);
    // console.log("final result", result);
    return result;
};
const subscribeOutputControlNode = () => {
    const outputControlObservable = getOutputControlObservable();
    const subscription = outputControlObservable.subscribe({
        next: async (output) => {
            let flow = output.flowState.flow;
            // Handle the emitted value from the output control node
            console.log('Received value from output control node:', output.outputcontrolPinId);
            // return;
            let currentNode = flow.nodes.find((node) => node.id === output.flowState.currentNodeId);
            console.log("current Node Id", currentNode.id);
            // return
            await iterateGraph(flow, currentNode, output.flowState, output.outputcontrolPinId);
        },
        error: (err) => {
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
};
var workflow = require('./../../agentserver/datajson/controlflowTest.json');
(0, exports.execute)(workflow).then((result) => {
    console.log(result);
});
