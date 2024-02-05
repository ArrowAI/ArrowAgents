import { DB } from "../services/flowservice";

export type FlowState = {
    context: ExecutionContext;
    currentNodeId: string;
}
interface ExecutionContext {
    [key: string]: any; // Or a more specific type if known
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
