import { flowExecutorStore } from "../engine/flowexecutorstore";

export const  DB = {
    getFlow(id:string): FlowJson{
        return {
            nodes: []
        }
    },
    getActionExecutor(actionId:string) {

        return new ActionExecutor(actionId);
        //here it will get the details of the executor for the Action.
    },

    getFlowExecutorStoreValue(flowId: string):flowExecutorStore{
        return {
            
        }
    }

}