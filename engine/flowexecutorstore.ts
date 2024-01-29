import { DB } from "../services/db";

export type FlowExecutorObject= {
    context : object;
    currentNodeId :string;
}

export class flowExecutorStore {
  
    findFlowExecutor(flowId: string): FlowExecutorObject {
        if(DB.getFlowExecutorStoreValue(flowId)) {
            return new FlowExecutorObject;
        }
        else
            return new FlowExecutorObject;
    }
}
