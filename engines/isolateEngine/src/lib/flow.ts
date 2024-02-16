// import { FlowState } from '@src/engine/flowexecutorstore';
import { cloneDeep, get, isEqual } from 'lodash'

export interface INode {
    id: string,
    data: {
        name: string,
        label: string,
        type: string,
        inputs: any[],
    }

}
export type FlowState = {
    context: ExecutionContext;
    currentNodeId: string;
    flowId: string;
    flow: any
}
export type OutputControlObservableValue = {

    nodeId: string,
    outputcontrolPinId: string,
    flowState: FlowState

}
interface ExecutionContext {
    [key: string]: any; // Or a more specific type if known
}


export class Activity {
    id: string;
    name: string;
    label: string;
    classType: string;
    functions: Function[];
    imported_classes: string[];
    constructor(activity: any) {
        let functionsNames = Object.keys(activity.functions);
        this.functions = functionsNames.map((functionName: string) => {
            let funct = new Function(activity.functions[functionName]);
            funct.name = functionName;
            return funct;
        })

        this.id = activity.id;
        this.name = activity.name;
        this.classType = activity.classType;
        this.label = activity.label;
        this.imported_classes = activity.imported_classes;
    }
}

export class Function {
    name: string;
    flow: Flow;
    constructor(functions: any) {
        this.name = functions.name;
        this.flow = new Flow(functions.flow);
    }
}

export class Flow {
    id: string;
    nodes: any;
    edges: any;
    constructor(flow: any) {
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

    getConnectedDataNodeIds(nodeId: string, visitedNodes: Set<string> = new Set()): string[] {
        // If the node has already been visited, return an empty array
        if (visitedNodes.has(nodeId)) {
            return [];
        }

        // Mark the current node as visited
        visitedNodes.add(nodeId);

        // Find the current node
        let currentNode = this.nodes.find((node: any) => node.id === nodeId);
        if (!currentNode) {
            throw new Error(`Node with ID ${nodeId} not found.`);
        }

        // Get the IDs of the input data nodes connected to the current node
        let inputDataIds = currentNode.data.inputs.map((input: any) => input.id);
        // console.log("conneted datanodes ids")
        console.log(inputDataIds);

        // Initialize an array to store the IDs of the connected nodes
        let connectedNodeIds: string[] = [];

        // Find the edges connected to the input data nodes
        inputDataIds.forEach((inputDataId: string) => {

            let connectedEdge = this.edges.filter((edge: any) => edge.targetHandle === inputDataId);

            connectedEdge.forEach((edge: any) => {
                // If the connected node is not visited yet, add it to the list and recurse
                if (!visitedNodes.has(edge.source)) {
                    connectedNodeIds.push(edge.source);
                    connectedNodeIds = connectedNodeIds.concat(this.getConnectedDataNodeIds(edge.source, visitedNodes));
                }
            });
        });

        return connectedNodeIds;
    }

    getNextControlNode(nodeId: string, outputcontrolName: string = "default"): INode | null {
        // Find the current node
        let currentNode = this.nodes.find((node: any) => node.id === nodeId);
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

        let outputcontrol = currentNode.data.outputControls.find((outputcontrol: any) => outputcontrol.name === outputcontrolName);
        if (!outputcontrol) {
            console.log(`Output control with name ${outputcontrolName} not found.`);
            return null;
        }

        // Find the edge that connects to the output control
        let nextControlNodeEdge = this.edges.find((edge: any) => edge.sourceHandle === outputcontrol.id);
        if (!nextControlNodeEdge) {
            console.log(`Edge connecting to output control with ID ${outputcontrol.id} not found.`);
            return null;
        }

        // Find the next control node
        let nextControlNode: INode = this.nodes.find((node: any) => node.id === nextControlNodeEdge.target);
        if (!nextControlNode) {
            console.log(`Next control node with ID ${nextControlNodeEdge.target} not found.`);
            return null;
        }

        return nextControlNode;
    }
    // getSubGraphOfAllConnectedDataNodes(nodeId: string): Flow {

    // }
    getSubGraphOfAllConnectedDataNodes(nodeId: string): Flow {
        // Find the node with the given ID
        const node = this.nodes.find((n: any) => n.id === nodeId);
        if (!node) {
            throw new Error(`Node with ID ${nodeId} not found.`);
        }
        let subGraphNodeIds = new Set([nodeId]);
        // Create a helper function to perform DFS
        let allDataNodeIds = this.getConnectedDataNodeIds(nodeId);
        // console.log("allDataNodeIds", allDataNodeIds);
        let nodes = allDataNodeIds.map((id: string) => this.nodes.find((n: any) => n.id === id));
        var self = this;
        // Add Current Node to Node list as nodes are all datanodes direactly connected to the current node or its child
        nodes.push(node);
        function dfs(nodeId: string) {
            // Find the node with the given ID
            const node = nodes.find((n: any) => n.id === nodeId);
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
        let subGraphNodes: any = [];
        let subGraphEdges: any = [];
        for (const nodeId of subGraphNodeIds) {
            const node = nodes.find((n: any) => n.id === nodeId);
            if (node) {
                subGraphNodes.push(node);
            }
        }
        // Use the subGraphNodes array to filter edges
        subGraphEdges = this.edges.filter((edge: any) => {
            const sourceNode = subGraphNodes.find((n: any) => n.id === edge.source);
            const targetNode = subGraphNodes.find((n: any) => n.id === edge.target);
            return sourceNode && targetNode;
        });
        // Return the subgraph
        return new Flow({
            nodes: subGraphNodes,
            edges: subGraphEdges
        });

    }
    removeConnectedNodesWithInputControls(graphJson: any, currentNodeId: string): any {
        // Find the current node
        const currentNode = graphJson.nodes.find((node: any) => node.id === currentNodeId);
        if (!currentNode) {
            throw new Error(`Node with id "${currentNodeId}" not found.`);
        }

        // Collect the ids of nodes to remove
        const nodesToRemove: any = [];
        const edgesToRemove: any = [];

        // Check if the current node has input controls


        graphJson.nodes.forEach((node: any) => {
            if (node.data && node.data.inputControls && node.data.inputControls.length > 0) {
                if (node != currentNode)
                    nodesToRemove.push(node.id);
            }
        })
        console.log("nodes to remove", nodesToRemove)
        graphJson.edges.forEach((edge: any) => {
            nodesToRemove.forEach((nodeId: string) => {
                if (nodeId === edge.target  || nodeId === edge.source) {
                    edgesToRemove.push(edge);
                    nodesToRemove.push(edge.source);
                }
                
            })
        })

        // console.log("edges to remove", edgesToRemove)
        // Filter out the nodes to remove
        const filteredNodes = graphJson.nodes.filter((node: any) => !nodesToRemove.includes(node.id));

        // Filter out the edges to remove
        const filteredEdges = graphJson.edges.filter((edge: any) => !edgesToRemove.some((e: any) => e.id === edge.id));

        // Return the updated graph JSON
        return {
            ...graphJson,
            nodes: filteredNodes,
            edges: filteredEdges
        };
    }



    removeControlNode(nodeId: string, flow: Flow) {



    }
    //Flowise functions
    constructGraphs = (
        reactFlowNodes: any[],
        reactFlowEdges: any[],
        options?: { isNonDirected?: boolean; isReversed?: boolean }
    ) => {
        const nodeDependencies: any = {}
        const graph: any = {};

        for (let i = 0; i < reactFlowNodes.length; i += 1) {
            const nodeId = reactFlowNodes[i].id
            nodeDependencies[nodeId] = 0
            graph[nodeId] = []
        }

        if (options && options.isReversed) {
            for (let i = 0; i < reactFlowEdges.length; i += 1) {
                const source = reactFlowEdges[i].source
                const target = reactFlowEdges[i].target

                if (Object.prototype.hasOwnProperty.call(graph, target)) {
                    graph[target].push(source)
                } else {
                    graph[target] = [source]
                }

                nodeDependencies[target] += 1
            }

            return { graph, nodeDependencies }
        }

        for (let i = 0; i < reactFlowEdges.length; i += 1) {
            const source = reactFlowEdges[i].source
            const target = reactFlowEdges[i].target

            if (Object.prototype.hasOwnProperty.call(graph, source)) {
                graph[source].push(target)
            } else {
                graph[source] = [target]
            }

            if (options && options.isNonDirected) {
                if (Object.prototype.hasOwnProperty.call(graph, target)) {
                    graph[target].push(source)
                } else {
                    graph[target] = [source]
                }
            }
            nodeDependencies[target] += 1
        }

        return { graph, nodeDependencies }
    }
    getEndingNodes = (nodeDependencies: any, graph: any) => {
        const endingNodeIds: string[] = []
        Object.keys(graph).forEach((nodeId) => {
            if (Object.keys(nodeDependencies).length === 1) {
                endingNodeIds.push(nodeId)
            } else if (!graph[nodeId].length && nodeDependencies[nodeId] > 0) {
                endingNodeIds.push(nodeId)
            }
        })
        return endingNodeIds
    }
    getStartingNodes = (graph: any, endNodeId: string) => {
        const visited = new Set<string>()
        const queue: Array<[string, number]> = [[endNodeId, 0]]
        const depthQueue: any = {
            [endNodeId]: 0
        }

        let maxDepth = 0
        let startingNodeIds: string[] = []

        while (queue.length > 0) {
            const [currentNode, depth] = queue.shift()!

            if (visited.has(currentNode)) {
                continue
            }

            visited.add(currentNode)

            if (depth > maxDepth) {
                maxDepth = depth
                startingNodeIds = [currentNode]
            } else if (depth === maxDepth) {
                startingNodeIds.push(currentNode)
            }

            for (const neighbor of graph[currentNode]) {
                if (!visited.has(neighbor)) {
                    queue.push([neighbor, depth + 1])
                    depthQueue[neighbor] = depth + 1
                }
            }
        }

        const depthQueueReversed: any = {}
        for (const nodeId in depthQueue) {
            if (Object.prototype.hasOwnProperty.call(depthQueue, nodeId)) {
                depthQueueReversed[nodeId] = Math.abs(depthQueue[nodeId] - maxDepth)
            }
        }

        return { startingNodeIds, depthQueue: depthQueueReversed }
    }

    getAllConnectedDataNodes = (graph: any, startNodeId: string) => {
        const visited = new Set<string>()
        const queue: Array<[string]> = [[startNodeId]]
        while (queue.length > 0) {
            const [currentNode] = queue.shift()!

            if (visited.has(currentNode)) {
                continue
            }
            visited.add(currentNode)
            for (const neighbor of graph[currentNode]) {
                if (!visited.has(neighbor)) {
                    queue.push([neighbor])
                }
            }
        }

        return [...visited]
    }


    /**
     * Get variable value from outputResponses.output
     * @param {string} paramValue
     * @param {IReactFlowNode[]} reactFlowNodes
     * @param {string} question
     * @param {boolean} isAcceptVariable
     * @returns {string}
     */
    getVariableValue = (
        paramValue: string,
        reactFlowNodes: any[],
        question: string,
        chatHistory: any[],
        isAcceptVariable = false
    ) => {
        let returnVal = paramValue
        const variableStack:any = []
        const variableDict = {} as any
        let startIdx = 0
        const endIdx = returnVal.length - 1

        while (startIdx < endIdx) {
            const substr = returnVal.substring(startIdx, startIdx + 2)

            // Store the opening double curly bracket
            if (substr === '{{') {
                variableStack.push({ substr, startIdx: startIdx + 2 })
            }

            // Found the complete variable
            if (substr === '}}' && variableStack.length > 0 && variableStack[variableStack.length - 1].substr === '{{') {
                const variableStartIdx = variableStack[variableStack.length - 1].startIdx
                const variableEndIdx = startIdx
                const variableFullPath = returnVal.substring(variableStartIdx, variableEndIdx)

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
                const [variableNodeId, _] = variableFullPath.split('.')
                const executedNode = reactFlowNodes.find((nd) => nd.id === variableNodeId)
                if (executedNode) {
                    const variableValue = get(executedNode.data, 'instance')
                    if (isAcceptVariable) {
                        variableDict[`{{${variableFullPath}}}`] = variableValue
                    } else {
                        returnVal = variableValue
                    }
                }
                variableStack.pop()
            }
            startIdx += 1
        }

        if (isAcceptVariable) {
            const variablePaths = Object.keys(variableDict)
            variablePaths.sort() // Sort by length of variable path because longer path could possibly contains nested variable
            variablePaths.forEach((path) => {
                const variableValue = variableDict[path]
                // Replace all occurrence
                if (typeof variableValue === 'object') {
                    returnVal = returnVal.split(path).join(JSON.stringify(variableValue).replace(/"/g, '\\"'))
                } else {
                    returnVal = returnVal.split(path).join(variableValue)
                }
            })
            return returnVal
        }
        return returnVal
    }
    /**
 * Loop through each inputs and resolve variable if neccessary
 * @param {INodeData} reactFlowNodeData
 * @param {IReactFlowNode[]} reactFlowNodes
 * @param {string} question
 * @returns {INodeData}
 */
    resolveVariables = (
        reactFlowNodeData: any,
        reactFlowNodes: any[],
        question: string,
        chatHistory: any[]
    ): any => {
        let flowNodeData = cloneDeep(reactFlowNodeData)
        const types = 'inputData'

        const getParamValues = (paramsObj: any) => {
            for (const key in paramsObj) {
                const paramValue: string = paramsObj[key];
                if (Array.isArray(paramValue)) {
                    const resolvedInstances:any = []
                    for (const param of paramValue) {
                        const resolvedInstance = this.getVariableValue(param, reactFlowNodes, question, chatHistory)
                        resolvedInstances.push(resolvedInstance)
                    }
                    paramsObj[key] = resolvedInstances
                } else {
                    // console.log(paramValue)

                    const isAcceptVariable = reactFlowNodeData.inputs.find((param: any) => param.name === key)?.acceptVariable ?? false
                    // console.log(isAcceptVariable)
                    const resolvedInstance = this.getVariableValue(paramValue, reactFlowNodes, question, chatHistory, isAcceptVariable)
                    // console.log("resolvedInstance", resolvedInstance)
                    paramsObj[key] = resolvedInstance
                }
            }
        }

        const paramsObj = flowNodeData[types] ?? {}

        getParamValues(paramsObj)

        return flowNodeData
    }
    /**
 * Loop through each inputs and replace their value with override config values
 * @param {INodeData} flowNodeData
 * @param {ICommonObject} overrideConfig
 * @returns {INodeData}
 */
    replaceInputsWithConfig = (flowNodeData: any, overrideConfig: any) => {
        const types = 'inputData'

        const getParamValues = (inputsObj: any) => {
            for (const config in overrideConfig) {
                // If overrideConfig[key] is object
                if (overrideConfig[config] && typeof overrideConfig[config] === 'object') {
                    const nodeIds = Object.keys(overrideConfig[config])
                    if (nodeIds.includes(flowNodeData.id)) {
                        inputsObj[config] = overrideConfig[config][flowNodeData.id]
                        continue
                    } else if (nodeIds.some((nodeId) => nodeId.includes(flowNodeData.name))) {
                        /*
                         * "systemMessagePrompt": {
                         *   "chatPromptTemplate_0": "You are an assistant" <---- continue for loop if current node is chatPromptTemplate_1
                         * }
                         */
                        continue
                    }
                }

                let paramValue = overrideConfig[config] ?? inputsObj[config]
                // Check if boolean
                if (paramValue === 'true') paramValue = true
                else if (paramValue === 'false') paramValue = false
                inputsObj[config] = paramValue
            }
        }

        const inputsObj = flowNodeData[types] ?? {}

        getParamValues(inputsObj)

        return flowNodeData
    }
    // * Build langchain from start to end
    processConnectedDataNodes = async (
        startingNodeIds: string[],
        reactFlowNodes: any[],
        reactFlowEdges: any[],
        graph: any,
        depthQueue: any,
        componentNodes: any,
        question: string,
        chatHistory: any[],
        chatId: string,
        sessionId: string,
        chatflowid: string,
        appDataSource: any,
        executionState: FlowState,
        overrideConfig?: any,
        cachePool?: any,
        isUpsert?: boolean,
        stopNodeId?: string

    ) => {
        const flowNodes = cloneDeep(reactFlowNodes);
        // console.log('processConnectedDataNodes', flowNodes);


        // Create a Queue and add our initial node in it
        const nodeQueue: any = []
        const exploredNode: any = {}
        const dynamicVariables = {} as Record<string, unknown>
        let ignoreNodeIds: string[] = []

        // In the case of infinite loop, only max 3 loops will be executed
        const maxLoop = 3

        for (let i = 0; i < startingNodeIds.length; i += 1) {
            nodeQueue.push({ nodeId: startingNodeIds[i], depth: 0 })
            exploredNode[startingNodeIds[i]] = { remainingLoop: maxLoop, lastSeenDepth: 0 }
        }

        while (nodeQueue.length) {
            const { nodeId, depth } = nodeQueue.shift()

            const reactFlowNode = flowNodes.find((nd) => nd.id === nodeId)
            const nodeIndex = flowNodes.findIndex((nd) => nd.id === nodeId)
            if (!reactFlowNode || reactFlowNode === undefined || nodeIndex < 0) continue

            try {
                //TODO: Check How to handle node path 
                const nodeInstanceFilePath = componentNodes[reactFlowNode.data.name] as string
                console.log("nodeInstanceFilePath",nodeInstanceFilePath)
                const nodeModule = await import(nodeInstanceFilePath);
                // console.log(nodeModule)
                const newNodeInstance = new nodeModule.nodeClass()

                let flowNodeData = cloneDeep(reactFlowNode.data)
                // if (overrideConfig) flowNodeData = this.replaceInputsWithConfig(flowNodeData, overrideConfig)
                const reactFlowNodeData: any = this.resolveVariables(flowNodeData, flowNodes, question, chatHistory);
                // console.log("reactFlowNodeData", JSON.stringify(reactFlowNodeData))
                let outputResult: any = await newNodeInstance.init(reactFlowNodeData, question, {
                    chatId,
                    sessionId,
                    chatflowid,
                    chatHistory,
                    // logger,
                    appDataSource,
                    // databaseEntities,
                    cachePool,
                    dynamicVariables
                })

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
                flowNodes[nodeIndex].data.instance = outputResult


                // console.log(`[server]: Finished initializing ${reactFlowNode.data.label} (${reactFlowNode.data.id})`)

            } catch (e: any) {

                throw new Error(e)
            }

            let neighbourNodeIds = graph[nodeId]
            const nextDepth = depth + 1

            // Find other nodes that are on the same depth level
            const sameDepthNodeIds = Object.keys(depthQueue).filter((key) => depthQueue[key] === nextDepth)

            for (const id of sameDepthNodeIds) {
                if (neighbourNodeIds.includes(id)) continue
                neighbourNodeIds.push(id)
            }

            neighbourNodeIds = neighbourNodeIds.filter((neigh: any) => !ignoreNodeIds.includes(neigh))

            for (let i = 0; i < neighbourNodeIds.length; i += 1) {
                const neighNodeId = neighbourNodeIds[i]
                if (ignoreNodeIds.includes(neighNodeId)) continue
                // If nodeId has been seen, cycle detected
                if (Object.prototype.hasOwnProperty.call(exploredNode, neighNodeId)) {
                    const { remainingLoop, lastSeenDepth } = exploredNode[neighNodeId]

                    if (lastSeenDepth === nextDepth) continue

                    if (remainingLoop === 0) {
                        break
                    }
                    const remainingLoopMinusOne = remainingLoop - 1
                    exploredNode[neighNodeId] = { remainingLoop: remainingLoopMinusOne, lastSeenDepth: nextDepth }
                    nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth })
                } else {
                    exploredNode[neighNodeId] = { remainingLoop: maxLoop, lastSeenDepth: nextDepth }
                    nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth })
                }
            }

            // Move end node to last
            if (!neighbourNodeIds.length) {
                const index = flowNodes.findIndex((nd) => nd.data.id === nodeId)
                flowNodes.push(flowNodes.splice(index, 1)[0])
            }
        }
        return flowNodes
    }




}