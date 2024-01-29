import { DB } from "../services/db";

export type FlowExecutorObject {
    context = {};
    currentNodeId = "";
}

export class flowExecutorStore {
    findFlowExecutor(flowId: string): FlowExecutorObject {
        if(DB.getFlowExecutorStoreValue(flowId)) {
            return new FlowExecutorObjec;
        }
        else
            return new FlowExecutorObject;
    }
}
