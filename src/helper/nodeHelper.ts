





export const executeNode = async (node: any, connections: any, nodes: any, context: any): Promise<any> => {
    // TODO: execute node and return result
    let connectedNodes = getAllConnectedNodes(connections, node.id);
    let connectedDataNodes = connectedNodes.filter((node: any) => node.type === "data");
    let connectedDataNodesResult = await executeDataNodes(connectedDataNodes, context);
    context = { ...context, ...connectedDataNodesResult };
    let getNextConnectedNodeId = getNextNodeToExecute(connections, node.id);
    if (getNextConnectedNodeId != null) {
        let nextNodeToExecute = nodes.find((node: any) => node.id === getNextConnectedNodeId);
        let flowResponse = await executeNode(nextNodeToExecute, connections, nodes, context);
        return flowResponse;
    }
}


export const executeDataNodes = async (dataNodes: any, context: any) => {
    // TODO: execute data nodes and return result
    let dataNodeResponses = [];
    for (let dataNode of dataNodes) {
        let dataNodeResponse = {
            dataNodeId: dataNode.id,
            dataNodeStatus: "success",
            dataNodeResult: "dataNodeResult"
        }
        dataNodeResponses.push(dataNodeResponse)
    }
    return dataNodeResponses
}

export const getNextNodeToExecute = (connections: any, currentNodeId: string) => {
    let nextNodeToExecute = connections.find((connection: any) => connection.source === currentNodeId);
    if (nextNodeToExecute) {
        return nextNodeToExecute.target;
    }
    else {
        return null;
    }
}
export const getAllConnectedNodes = (connections: any, currentNodeId: string) => {
    let connectedNodeToCurrentNode = connections.filter((connection: any) => connection.target === currentNodeId);
    return connectedNodeToCurrentNode;
}



