export interface INode {
    id: string,
    data: {
        name: string,
        label: string,
        type: string,
        inputs: any[],
    }

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
    nodes: any;
    edges: any;
    constructor(flow: any) {
        this.nodes = flow.nodes;
        this.edges = flow.edges;
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

    getNextControlNode(nodeId: string, outputcontrolName: string = "default"): INode {
        let currentNode = this.nodes.find((node: any) => node.id === nodeId);
        // console.log(currentNode)
        let outputcontrol= currentNode.data.outputControls.find((outputcontrol: any) => outputcontrol.name === outputcontrolName);
        if (outputcontrol == null) throw new Error("Control node not found");
        let nextControlNodeEdge = this.edges.find((edge: any) => edge.sourceHandle === outputcontrol.id);
        if (nextControlNodeEdge == null) throw new Error("Next control node not found");
        let nextControlNode: INode = this.nodes.find((node: any) => node.id === nextControlNodeEdge.target);
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

    constructGraphs = (
        reactFlowNodes: any[],
        reactFlowEdges: any[],
        options?: { isNonDirected?: boolean; isReversed?: boolean }
    ) => {
        const nodeDependencies:any = {}
        const graph:any= {} ;
    
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
}