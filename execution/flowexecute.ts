import { FlowJson } from "./interfaces";
import {FlowExecutorObject}
export class FlowExecuteHandler {
    db: DB;
    constructor(){
        this.db = new DB();
    }
   
    getCurrentNode(nodes: IntegrationInterface[]) {
        const currentNode = nodes[0]; // filter current node from nodes
        return currentNode;
    } 
    execute(FlowExecutorObject: FlowExecutorObject) {
        const flow: FlowJson = this.db.getFlow(flowId);
        var mainjson = flow.flowgraph.main;   
        const nodes: IntegrationInterface[] = flow.nodes;
        const currentNode = this.getCurrentNode(nodes); //instead of getCurrentNode use iterate graph
        const actionExecutor = this.db.getActionExecutor(currentNode);
        // get executon Type from environment variable
        return actionExecutor.execute(currentNode.actionId,ExecutionType.local);
        
    }

    iterategraph(){
        //This will be called to iterate and process the graph. This will have logic to handle control node, data Node, Parallelization, Multi Server etc.
        // This will also call Subgraph for other functions or even call secondary nodes like orchestrators etc.
    }
}