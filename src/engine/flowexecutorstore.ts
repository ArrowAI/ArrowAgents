import { DB } from "../services/flowservice";

export type FlowState = {
    context: object;
    currentNodeId: string;
}

export class flowExecutorStore {

    async findFlowExecutor(flowId: string): Promise<FlowState>  {
        try {
            let flowState = await DB.getFlowExecutorStoreValue(flowId);
            if (flowState) {
                return flowState as FlowState;
            }
            else {
                return {
                    context: {},
                    currentNodeId: ""
                } as FlowState
            }  
        } catch (error) {
            return {
                context: {},
                currentNodeId: ""
            } as FlowState 
        }

        

    }
}
