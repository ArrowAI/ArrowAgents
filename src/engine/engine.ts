import { FlowState, flowExecutorStore } from "./flowexecutorstore";
import { FlowExecuteHandler } from "../execution/flowexecute"
const flowExecuteHandler = new FlowExecuteHandler();
export class Engine {
    ArrowFlowExecutorStore: flowExecutorStore;
    constructor() {
        this.ArrowFlowExecutorStore = new flowExecutorStore();
    }
    async executeFlow(flowId: string, context?: any) {
        let flowExecutor: FlowState;
        if (!context) {
            flowExecutor = await this.ArrowFlowExecutorStore.findFlowExecutor(flowId);
        }
        else {
            flowExecutor = context
        }
        let engineResponse = await flowExecuteHandler.execute(flowExecutor, flowId);
       
        return engineResponse
    }



    //This is the Function that is called every minute, so that it can check for triggers and any delay functions
    executeStep() {
        // Loop through all the existing contexts in Db and check if there is any trigger waiting to be run.
        //If there is any that needs to be run then it calls the execute function with that flowId
    }
}