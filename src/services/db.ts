import { FlowState } from "../engine/flowexecutorstore";
import { ActionExecutor } from "../execution/actionexecute";
import { FlowJson } from "../execution/interfaces";
import { IntegrationInterface } from "../actionmodules/interfaces";

export const DB = {
    getFlow(id: string): FlowJson {
        return {
            nodes: []
        }
    },
    getActionExecutor(node: IntegrationInterface): ActionExecutor {
        return new ActionExecutor(node);
        //here it will get the details of the executor for the Action.
    },

    getFlowExecutorStoreValue(flowId: string): FlowState {
        return {
            context:{},
            currentNodeId:""
        } as FlowState
    }

}