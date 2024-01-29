import { ExecutionType, FlowJson } from "./interfaces";


import {DB} from './../services/db'
import { IntegrationInterface } from "../actionmodules/interfaces";
import { FlowExecutorObject } from "../engine/flowexecutorstore";
export class FlowExecuteHandler {
    constructor(){
    
    }
   
    getCurrentNode(nodes: IntegrationInterface[]) {
        const currentNode = nodes[0]; // filter current node from nodes
        return currentNode;
    } 
    execute(FlowExecutorObject: FlowExecutorObject,flowId: string) {
        const flow: FlowJson = DB.getFlow(flowId);
        // var mainjson = flow.flowgraph.main;   
        const nodes: IntegrationInterface[] = flow.nodes;
        const currentNode = this.getCurrentNode(nodes); //instead of getCurrentNode use iterate graph
        const actionExecutor = DB.getActionExecutor(currentNode);
        // get executon Type from environment variable
        return actionExecutor.execute(currentNode.actions[0].actionId);
        
    }

    iterategraph(){
        //This will be called to iterate and process the graph. This will have logic to handle control node, data Node, Parallelization, Multi Server etc.
        // This will also call Subgraph for other functions or even call secondary nodes like orchestrators etc.
    }
}