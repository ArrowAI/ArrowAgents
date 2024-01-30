import { ExecutionType, FlowJson } from "./interfaces";


import { DB } from './../services/flowservice'
import { IntegrationInterface } from "../actionmodules/interfaces";
import { FlowState } from "../engine/flowexecutorstore";
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
        return this.iterateGraph(nodes, connections, executionState);
    }


    async iterateGraph(nodes: any[], connections: any[], executionState: FlowState) {
        //This will be called to iterate and process the graph. This will have logic to handle control node, data Node, Parallelization, Multi Server etc.

        let currentNode = nodes[0]; // start with the first node
        console.log(currentNode)
        let flowExecutionContext = executionState;
        while (currentNode) {
            // process all data node connected to the current node before execution of current node
            const connectedDataNodes = connections
                .filter(connection => connection.source === currentNode.id)
                .map(connection => nodes.find(node => node.id === connection.target))
                .filter(node => node && node.type === 'data');

            for (const dataNode of connectedDataNodes) {
                console.log(`Processing data node: ${dataNode.id}`);
                const actionExecutor = DB.getActionExecutor(dataNode);

                flowExecutionContext.context = await actionExecutor.execute(dataNode.actions[0].actionId!);
            }

            // process the current node
            console.log(`Processing ${currentNode.type} node: ${currentNode.id}`);
            const actionExecutor = DB.getActionExecutor(currentNode);

            flowExecutionContext.context = await actionExecutor.execute(currentNode.actions[0].actionId!);

            // find the next node in the graph
            const nextNode = connections.find(connection => connection.source === currentNode.id);
            if (!nextNode) {
                // if there's no next node, we've reached the end of the graph
                break;
            }

            // update the current node to the next node
            currentNode = nodes.find(node => node.id === nextNode.target);
        }
        console.log('Workflow execution complete.');

        return flowExecutionContext;

    }


}