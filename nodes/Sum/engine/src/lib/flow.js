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
exports.Flow = exports.Function = exports.Activity = void 0;
// import { FlowState } from '@src/engine/flowexecutorstore';
const lodash_1 = require("lodash");
class Activity {
    constructor(activity) {
        let functionsNames = Object.keys(activity.functions);
        this.functions = functionsNames.map((functionName) => {
            let funct = new Function(activity.functions[functionName]);
            funct.name = functionName;
            return funct;
        });
        this.id = activity.id;
        this.name = activity.name;
        this.classType = activity.classType;
        this.label = activity.label;
        this.imported_classes = activity.imported_classes;
    }
}
exports.Activity = Activity;
class Function {
    constructor(functions) {
        this.name = functions.name;
        this.flow = new Flow(functions.flow);
    }
}
exports.Function = Function;
class Flow {
    constructor(flow) {
        //Flowise functions
        this.constructGraphs = (reactFlowNodes, reactFlowEdges, options) => {
            const nodeDependencies = {};
            const graph = {};
            for (let i = 0; i < reactFlowNodes.length; i += 1) {
                const nodeId = reactFlowNodes[i].id;
                nodeDependencies[nodeId] = 0;
                graph[nodeId] = [];
            }
            if (options && options.isReversed) {
                for (let i = 0; i < reactFlowEdges.length; i += 1) {
                    const source = reactFlowEdges[i].source;
                    const target = reactFlowEdges[i].target;
                    if (Object.prototype.hasOwnProperty.call(graph, target)) {
                        graph[target].push(source);
                    }
                    else {
                        graph[target] = [source];
                    }
                    nodeDependencies[target] += 1;
                }
                return { graph, nodeDependencies };
            }
            for (let i = 0; i < reactFlowEdges.length; i += 1) {
                const source = reactFlowEdges[i].source;
                const target = reactFlowEdges[i].target;
                if (Object.prototype.hasOwnProperty.call(graph, source)) {
                    graph[source].push(target);
                }
                else {
                    graph[source] = [target];
                }
                if (options && options.isNonDirected) {
                    if (Object.prototype.hasOwnProperty.call(graph, target)) {
                        graph[target].push(source);
                    }
                    else {
                        graph[target] = [source];
                    }
                }
                nodeDependencies[target] += 1;
            }
            return { graph, nodeDependencies };
        };
        this.getEndingNodes = (nodeDependencies, graph) => {
            const endingNodeIds = [];
            Object.keys(graph).forEach((nodeId) => {
                if (Object.keys(nodeDependencies).length === 1) {
                    endingNodeIds.push(nodeId);
                }
                else if (!graph[nodeId].length && nodeDependencies[nodeId] > 0) {
                    endingNodeIds.push(nodeId);
                }
            });
            return endingNodeIds;
        };
        this.getStartingNodes = (graph, endNodeId) => {
            const visited = new Set();
            const queue = [[endNodeId, 0]];
            const depthQueue = {
                [endNodeId]: 0
            };
            let maxDepth = 0;
            let startingNodeIds = [];
            while (queue.length > 0) {
                const [currentNode, depth] = queue.shift();
                if (visited.has(currentNode)) {
                    continue;
                }
                visited.add(currentNode);
                if (depth > maxDepth) {
                    maxDepth = depth;
                    startingNodeIds = [currentNode];
                }
                else if (depth === maxDepth) {
                    startingNodeIds.push(currentNode);
                }
                for (const neighbor of graph[currentNode]) {
                    if (!visited.has(neighbor)) {
                        queue.push([neighbor, depth + 1]);
                        depthQueue[neighbor] = depth + 1;
                    }
                }
            }
            const depthQueueReversed = {};
            for (const nodeId in depthQueue) {
                if (Object.prototype.hasOwnProperty.call(depthQueue, nodeId)) {
                    depthQueueReversed[nodeId] = Math.abs(depthQueue[nodeId] - maxDepth);
                }
            }
            return { startingNodeIds, depthQueue: depthQueueReversed };
        };
        this.getAllConnectedDataNodes = (graph, startNodeId) => {
            const visited = new Set();
            const queue = [[startNodeId]];
            while (queue.length > 0) {
                const [currentNode] = queue.shift();
                if (visited.has(currentNode)) {
                    continue;
                }
                visited.add(currentNode);
                for (const neighbor of graph[currentNode]) {
                    if (!visited.has(neighbor)) {
                        queue.push([neighbor]);
                    }
                }
            }
            return [...visited];
        };
        /**
         * Get variable value from outputResponses.output
         * @param {string} paramValue
         * @param {IReactFlowNode[]} reactFlowNodes
         * @param {string} question
         * @param {boolean} isAcceptVariable
         * @returns {string}
         */
        this.getVariableValue = (paramValue, reactFlowNodes, question, chatHistory, isAcceptVariable = false) => {
            let returnVal = paramValue;
            const variableStack = [];
            const variableDict = {};
            let startIdx = 0;
            const endIdx = returnVal.length - 1;
            while (startIdx < endIdx) {
                const substr = returnVal.substring(startIdx, startIdx + 2);
                // Store the opening double curly bracket
                if (substr === '{{') {
                    variableStack.push({ substr, startIdx: startIdx + 2 });
                }
                // Found the complete variable
                if (substr === '}}' && variableStack.length > 0 && variableStack[variableStack.length - 1].substr === '{{') {
                    const variableStartIdx = variableStack[variableStack.length - 1].startIdx;
                    const variableEndIdx = startIdx;
                    const variableFullPath = returnVal.substring(variableStartIdx, variableEndIdx);
                    /**
                     * Apply string transformation to convert special chars:
                     * FROM: hello i am ben\n\n\thow are you?
                     * TO: hello i am benFLOWISE_NEWLINEFLOWISE_NEWLINEFLOWISE_TABhow are you?
                     */
                    // if (isAcceptVariable && variableFullPath === QUESTION_VAR_PREFIX) {
                    //     variableDict[`{{${variableFullPath}}}`] = handleEscapeCharacters(question, false)
                    // }
                    // if (isAcceptVariable && variableFullPath === CHAT_HISTORY_VAR_PREFIX) {
                    //     variableDict[`{{${variableFullPath}}}`] = handleEscapeCharacters(convertChatHistoryToText(chatHistory), false)
                    // }
                    // Split by first occurrence of '.' to get just nodeId
                    const [variableNodeId, _] = variableFullPath.split('.');
                    const executedNode = reactFlowNodes.find((nd) => nd.id === variableNodeId);
                    if (executedNode) {
                        const variableValue = (0, lodash_1.get)(executedNode.data, 'instance');
                        if (isAcceptVariable) {
                            variableDict[`{{${variableFullPath}}}`] = variableValue;
                        }
                        else {
                            returnVal = variableValue;
                        }
                    }
                    variableStack.pop();
                }
                startIdx += 1;
            }
            if (isAcceptVariable) {
                const variablePaths = Object.keys(variableDict);
                variablePaths.sort(); // Sort by length of variable path because longer path could possibly contains nested variable
                variablePaths.forEach((path) => {
                    const variableValue = variableDict[path];
                    // Replace all occurrence
                    if (typeof variableValue === 'object') {
                        returnVal = returnVal.split(path).join(JSON.stringify(variableValue).replace(/"/g, '\\"'));
                    }
                    else {
                        returnVal = returnVal.split(path).join(variableValue);
                    }
                });
                return returnVal;
            }
            return returnVal;
        };
        /**
     * Loop through each inputs and resolve variable if neccessary
     * @param {INodeData} reactFlowNodeData
     * @param {IReactFlowNode[]} reactFlowNodes
     * @param {string} question
     * @returns {INodeData}
     */
        this.resolveVariables = (reactFlowNodeData, reactFlowNodes, question, chatHistory) => {
            var _a;
            let flowNodeData = (0, lodash_1.cloneDeep)(reactFlowNodeData);
            const types = 'inputData';
            const getParamValues = (paramsObj) => {
                var _a, _b;
                for (const key in paramsObj) {
                    const paramValue = paramsObj[key];
                    if (Array.isArray(paramValue)) {
                        const resolvedInstances = [];
                        for (const param of paramValue) {
                            const resolvedInstance = this.getVariableValue(param, reactFlowNodes, question, chatHistory);
                            resolvedInstances.push(resolvedInstance);
                        }
                        paramsObj[key] = resolvedInstances;
                    }
                    else {
                        // console.log(paramValue)
                        const isAcceptVariable = (_b = (_a = reactFlowNodeData.inputs.find((param) => param.name === key)) === null || _a === void 0 ? void 0 : _a.acceptVariable) !== null && _b !== void 0 ? _b : false;
                        // console.log(isAcceptVariable)
                        const resolvedInstance = this.getVariableValue(paramValue, reactFlowNodes, question, chatHistory, isAcceptVariable);
                        // console.log("resolvedInstance", resolvedInstance)
                        paramsObj[key] = resolvedInstance;
                    }
                }
            };
            const paramsObj = (_a = flowNodeData[types]) !== null && _a !== void 0 ? _a : {};
            getParamValues(paramsObj);
            return flowNodeData;
        };
        /**
     * Loop through each inputs and replace their value with override config values
     * @param {INodeData} flowNodeData
     * @param {ICommonObject} overrideConfig
     * @returns {INodeData}
     */
        this.replaceInputsWithConfig = (flowNodeData, overrideConfig) => {
            var _a;
            const types = 'inputData';
            const getParamValues = (inputsObj) => {
                var _a;
                for (const config in overrideConfig) {
                    // If overrideConfig[key] is object
                    if (overrideConfig[config] && typeof overrideConfig[config] === 'object') {
                        const nodeIds = Object.keys(overrideConfig[config]);
                        if (nodeIds.includes(flowNodeData.id)) {
                            inputsObj[config] = overrideConfig[config][flowNodeData.id];
                            continue;
                        }
                        else if (nodeIds.some((nodeId) => nodeId.includes(flowNodeData.name))) {
                            /*
                             * "systemMessagePrompt": {
                             *   "chatPromptTemplate_0": "You are an assistant" <---- continue for loop if current node is chatPromptTemplate_1
                             * }
                             */
                            continue;
                        }
                    }
                    let paramValue = (_a = overrideConfig[config]) !== null && _a !== void 0 ? _a : inputsObj[config];
                    // Check if boolean
                    if (paramValue === 'true')
                        paramValue = true;
                    else if (paramValue === 'false')
                        paramValue = false;
                    inputsObj[config] = paramValue;
                }
            };
            const inputsObj = (_a = flowNodeData[types]) !== null && _a !== void 0 ? _a : {};
            getParamValues(inputsObj);
            return flowNodeData;
        };
        // * Build langchain from start to end
        this.processConnectedDataNodes = async (startingNodeIds, reactFlowNodes, reactFlowEdges, graph, depthQueue, componentNodes, question, chatHistory, chatId, sessionId, chatflowid, appDataSource, executionState, overrideConfig, cachePool, isUpsert, stopNodeId) => {
            const flowNodes = (0, lodash_1.cloneDeep)(reactFlowNodes);
            // console.log('processConnectedDataNodes', flowNodes);
            // Create a Queue and add our initial node in it
            const nodeQueue = [];
            const exploredNode = {};
            const dynamicVariables = {};
            let ignoreNodeIds = [];
            // In the case of infinite loop, only max 3 loops will be executed
            const maxLoop = 3;
            for (let i = 0; i < startingNodeIds.length; i += 1) {
                nodeQueue.push({ nodeId: startingNodeIds[i], depth: 0 });
                exploredNode[startingNodeIds[i]] = { remainingLoop: maxLoop, lastSeenDepth: 0 };
            }
            while (nodeQueue.length) {
                const { nodeId, depth } = nodeQueue.shift();
                const reactFlowNode = flowNodes.find((nd) => nd.id === nodeId);
                const nodeIndex = flowNodes.findIndex((nd) => nd.id === nodeId);
                if (!reactFlowNode || reactFlowNode === undefined || nodeIndex < 0)
                    continue;
                try {
                    //TODO: Check How to handle node path 
                    const nodeInstanceFilePath = componentNodes[reactFlowNode.data.name].filePath;
                    // console.log("nodeInstanceFilePath",nodeInstanceFilePath)
                    const nodeModule = await Promise.resolve(`${nodeInstanceFilePath}`).then(s => __importStar(require(s)));
                    // console.log(nodeModule)
                    const newNodeInstance = new nodeModule.nodeClass();
                    let flowNodeData = (0, lodash_1.cloneDeep)(reactFlowNode.data);
                    // if (overrideConfig) flowNodeData = this.replaceInputsWithConfig(flowNodeData, overrideConfig)
                    const reactFlowNodeData = this.resolveVariables(flowNodeData, flowNodes, question, chatHistory);
                    // console.log("reactFlowNodeData", JSON.stringify(reactFlowNodeData))
                    let outputResult = await newNodeInstance.init(reactFlowNodeData, question, {
                        chatId,
                        sessionId,
                        chatflowid,
                        chatHistory,
                        // logger,
                        appDataSource,
                        // databaseEntities,
                        cachePool,
                        dynamicVariables
                    });
                    // Save dynamic variables
                    // if (reactFlowNode.data.name === 'setVariable') {
                    //     const dynamicVars = outputResult?.dynamicVariables ?? {}
                    //     for (const variableKey in dynamicVars) {
                    //         dynamicVariables[variableKey] = dynamicVars[variableKey]
                    //     }
                    //     outputResult = outputResult?.output
                    // }
                    // Determine which nodes to route next when it comes to ifElse
                    if (reactFlowNode.data.name === 'ifElseFunction' && typeof outputResult === 'object') {
                    }
                    if (executionState && executionState.context) {
                        executionState.context[reactFlowNode.data.name] = outputResult;
                    }
                    flowNodes[nodeIndex].data.instance = outputResult;
                    // console.log(`[server]: Finished initializing ${reactFlowNode.data.label} (${reactFlowNode.data.id})`)
                }
                catch (e) {
                    throw new Error(e);
                }
                let neighbourNodeIds = graph[nodeId];
                const nextDepth = depth + 1;
                // Find other nodes that are on the same depth level
                const sameDepthNodeIds = Object.keys(depthQueue).filter((key) => depthQueue[key] === nextDepth);
                for (const id of sameDepthNodeIds) {
                    if (neighbourNodeIds.includes(id))
                        continue;
                    neighbourNodeIds.push(id);
                }
                neighbourNodeIds = neighbourNodeIds.filter((neigh) => !ignoreNodeIds.includes(neigh));
                for (let i = 0; i < neighbourNodeIds.length; i += 1) {
                    const neighNodeId = neighbourNodeIds[i];
                    if (ignoreNodeIds.includes(neighNodeId))
                        continue;
                    // If nodeId has been seen, cycle detected
                    if (Object.prototype.hasOwnProperty.call(exploredNode, neighNodeId)) {
                        const { remainingLoop, lastSeenDepth } = exploredNode[neighNodeId];
                        if (lastSeenDepth === nextDepth)
                            continue;
                        if (remainingLoop === 0) {
                            break;
                        }
                        const remainingLoopMinusOne = remainingLoop - 1;
                        exploredNode[neighNodeId] = { remainingLoop: remainingLoopMinusOne, lastSeenDepth: nextDepth };
                        nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth });
                    }
                    else {
                        exploredNode[neighNodeId] = { remainingLoop: maxLoop, lastSeenDepth: nextDepth };
                        nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth });
                    }
                }
                // Move end node to last
                if (!neighbourNodeIds.length) {
                    const index = flowNodes.findIndex((nd) => nd.data.id === nodeId);
                    flowNodes.push(flowNodes.splice(index, 1)[0]);
                }
            }
            return flowNodes;
        };
        this.nodes = flow.nodes;
        this.edges = flow.edges;
        this.id = flow.id;
    }
    // getConnectedDataNodeIds(nodeId: string): string[] {
    //     let currentNode = this.nodes.find((node: any) => node.id === nodeId);
    //     let inputDataIds = currentNode.data.inputs.map((input: any) => input.id);
    //     console.log(inputDataIds);
    //     let connectedNodeIds: string[] = [];
    //     inputDataIds.forEach((inputDataId: string) => {
    //         let connectedEdge = this.edges.filter((edge: any) => edge.targetHandle === inputDataId);
    //         connectedEdge.forEach((edge: any) => {
    //             connectedNodeIds.push(edge.source);
    //         })
    //     })
    //     return connectedNodeIds;
    // }
    getConnectedDataNodeIds(nodeId, visitedNodes = new Set()) {
        // If the node has already been visited, return an empty array
        if (visitedNodes.has(nodeId)) {
            return [];
        }
        // Mark the current node as visited
        visitedNodes.add(nodeId);
        // Find the current node
        let currentNode = this.nodes.find((node) => node.id === nodeId);
        if (!currentNode) {
            throw new Error(`Node with ID ${nodeId} not found.`);
        }
        // Get the IDs of the input data nodes connected to the current node
        let inputDataIds = currentNode.data.inputs.map((input) => input.id);
        // console.log("conneted datanodes ids")
        console.log(inputDataIds);
        // Initialize an array to store the IDs of the connected nodes
        let connectedNodeIds = [];
        // Find the edges connected to the input data nodes
        inputDataIds.forEach((inputDataId) => {
            let connectedEdge = this.edges.filter((edge) => edge.targetHandle === inputDataId);
            connectedEdge.forEach((edge) => {
                // If the connected node is not visited yet, add it to the list and recurse
                if (!visitedNodes.has(edge.source)) {
                    connectedNodeIds.push(edge.source);
                    connectedNodeIds = connectedNodeIds.concat(this.getConnectedDataNodeIds(edge.source, visitedNodes));
                }
            });
        });
        return connectedNodeIds;
    }
    getNextControlNode(nodeId, outputcontrolName = "default") {
        // Find the current node
        let currentNode = this.nodes.find((node) => node.id === nodeId);
        if (!currentNode) {
            console.log(`Node with ID ${nodeId} not found.`);
            return null;
        }
        // Ensure the current node has outputControls property
        if (!currentNode.data || !currentNode.data.outputControls) {
            console.log(`Node with ID ${nodeId} does not have outputControls.`);
            return null;
        }
        // Find the output control by name
        // console.log(currentNode.data);
        let outputcontrol = currentNode.data.outputControls.find((outputcontrol) => outputcontrol.name === outputcontrolName);
        if (!outputcontrol) {
            console.log(`Output control with name ${outputcontrolName} not found.`);
            return null;
        }
        // Find the edge that connects to the output control
        let nextControlNodeEdge = this.edges.find((edge) => edge.sourceHandle === outputcontrol.id);
        if (!nextControlNodeEdge) {
            console.log(`Edge connecting to output control with ID ${outputcontrol.id} not found.`);
            return null;
        }
        // Find the next control node
        let nextControlNode = this.nodes.find((node) => node.id === nextControlNodeEdge.target);
        if (!nextControlNode) {
            console.log(`Next control node with ID ${nextControlNodeEdge.target} not found.`);
            return null;
        }
        return nextControlNode;
    }
    // getSubGraphOfAllConnectedDataNodes(nodeId: string): Flow {
    // }
    getSubGraphOfAllConnectedDataNodes(nodeId) {
        // Find the node with the given ID
        const node = this.nodes.find((n) => n.id === nodeId);
        if (!node) {
            throw new Error(`Node with ID ${nodeId} not found.`);
        }
        let subGraphNodeIds = new Set([nodeId]);
        // Create a helper function to perform DFS
        let allDataNodeIds = this.getConnectedDataNodeIds(nodeId);
        // console.log("allDataNodeIds", allDataNodeIds);
        let nodes = allDataNodeIds.map((id) => this.nodes.find((n) => n.id === id));
        var self = this;
        // Add Current Node to Node list as nodes are all datanodes direactly connected to the current node or its child
        nodes.push(node);
        function dfs(nodeId) {
            // Find the node with the given ID
            const node = nodes.find((n) => n.id === nodeId);
            if (!node) {
                return;
            }
            // Iterate over the edges in the flow
            for (const edge of self.edges) {
                // If the edge is connected to the node, add the other node's ID to the subgraph
                if (edge.target === nodeId || edge.source === nodeId) {
                    const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
                    if (!subGraphNodeIds.has(otherNodeId)) {
                        subGraphNodeIds.add(otherNodeId);
                        dfs(otherNodeId); // Recursively call DFS on the other node
                    }
                }
            }
        }
        // Call DFS on the initial node
        dfs(nodeId);
        // Construct the subgraph arrays
        let subGraphNodes = [];
        let subGraphEdges = [];
        for (const nodeId of subGraphNodeIds) {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
                subGraphNodes.push(node);
            }
        }
        // Use the subGraphNodes array to filter edges
        subGraphEdges = this.edges.filter((edge) => {
            const sourceNode = subGraphNodes.find((n) => n.id === edge.source);
            const targetNode = subGraphNodes.find((n) => n.id === edge.target);
            return sourceNode && targetNode;
        });
        // Return the subgraph
        return new Flow({
            nodes: subGraphNodes,
            edges: subGraphEdges
        });
    }
    removeConnectedNodesWithInputControls(graphJson, currentNodeId) {
        // Find the current node
        const currentNode = graphJson.nodes.find((node) => node.id === currentNodeId);
        if (!currentNode) {
            throw new Error(`Node with id "${currentNodeId}" not found.`);
        }
        // Collect the ids of nodes to remove
        const nodesToRemove = [];
        const edgesToRemove = [];
        // Check if the current node has input controls
        graphJson.nodes.forEach((node) => {
            if (node.data && node.data.inputControls && node.data.inputControls.length > 0) {
                if (node != currentNode)
                    nodesToRemove.push(node.id);
            }
        });
        console.log("nodes to remove", nodesToRemove);
        graphJson.edges.forEach((edge) => {
            nodesToRemove.forEach((nodeId) => {
                if (nodeId === edge.target || nodeId === edge.source) {
                    edgesToRemove.push(edge);
                    nodesToRemove.push(edge.source);
                }
            });
        });
        // console.log("edges to remove", edgesToRemove)
        // Filter out the nodes to remove
        const filteredNodes = graphJson.nodes.filter((node) => !nodesToRemove.includes(node.id));
        // Filter out the edges to remove
        const filteredEdges = graphJson.edges.filter((edge) => !edgesToRemove.some((e) => e.id === edge.id));
        // Return the updated graph JSON
        return Object.assign(Object.assign({}, graphJson), { nodes: filteredNodes, edges: filteredEdges });
    }
    removeControlNode(nodeId, flow) {
    }
}
exports.Flow = Flow;
