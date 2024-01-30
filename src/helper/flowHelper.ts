import { executeDataNodes, executeNode, getAllConnectedNodes, getNextNodeToExecute } from "./nodeHelper";



const getFirstNode = (connections: any) => {
    return connections[0].source;

}
// make this function recursive to execute all node in connection 
export const executeFlow = async (flow: any, context: any) => {
    let { nodes, connections } = flow.nodes;
    let currentNodeId = getFirstNode(connections);
    let currentNodeToExecute = nodes.find((node: any) => node.id === currentNodeId);
    return executeNode(currentNodeToExecute!, connections, nodes, context);

}

