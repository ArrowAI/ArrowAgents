import { DB } from "../services/db";

export type FlowState = {
    context: object;
    currentNodeId: string;
}

export class flowExecutorStore {

    findFlowExecutor(flowId: string): FlowState {
        let flowState = DB.getFlowExecutorStoreValue(flowId);
        if (DB.getFlowExecutorStoreValue(flowId)) {
            return flowState as FlowState;
        }
        else {
            return {
                context: {},
                currentNodeId: ""
            } as FlowState
        }

    }
}
