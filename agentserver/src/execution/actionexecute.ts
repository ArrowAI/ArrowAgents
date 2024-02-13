import {IntegrationInterface} from "../actionmodules/interfaces";
import { ExecutionType } from "./interfaces";

// This is used to execute a specific action. This is called by the flow Executor.

export class ActionExecutor {
    node: IntegrationInterface;
    constructor(node: IntegrationInterface) {
        this.node = node;
    }
   
    execute(actionId: string) {
       let ActionExecutorType = ExecutionType.local

       return {
          nodeStatus: "success",
       }
       // execute current node action
    }
}