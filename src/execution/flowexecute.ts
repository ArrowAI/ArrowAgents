import { ExecutionType, FlowJson } from "./interfaces";


import { DB } from '../services/flowservice'
import { IntegrationInterface } from "../actionmodules/interfaces";
import { FlowState } from "../engine/flowexecutorstore";
import { executeFlow } from "@src/helper/flowHelper";

export class FlowExecuteHandler {
    constructor() {

    }

    getFirstNode(connections: any) {

        return connections[0].source;

    }


    getNextNodeToExecute(connections: any, currentNodeId: string) {
        let nextNodeToExecute = connections.find((connection: any) => connection.source === currentNodeId);
        if (nextNodeToExecute) {
            return nextNodeToExecute.target;
        }
        else {
            return null;
        }
    }


    execute(flowexecuteState: FlowState, flowId: string) {
        const flow: any = DB.getFlow(flowId);
        return executeFlow(flow, flowexecuteState.context);
        // var mainjson = flow.flowgraph.main;   
        //TODO change Nodes to type of IntegrationInterface
        // const connections: any[] = flow.connections;
        // let currentNodeId=this.getFirstNode(connections);
        // const currentNodeToExecute = flow.nodes.find((node:any) => node.id === currentNodeId);  //instead of getCurrentNode use iterate graph
        // const actionExecutor = DB.getActionExecutor(currentNodeToExecute!);
        // // get executon Type from environment variable
        // let actionResponse= actionExecutor.execute(currentNodeToExecute!.actions[0].actionId!);
        // let connectedNode = this.getNextNodeToExecute(connections,currentNodeId);
        // if(connectedNode!=null){

        // }


    }

    iterategraph() {
        //This will be called to iterate and process the graph. This will have logic to handle control node, data Node, Parallelization, Multi Server etc.
        // This will also call Subgraph for other functions or even call secondary nodes like orchestrators etc.
    }
}