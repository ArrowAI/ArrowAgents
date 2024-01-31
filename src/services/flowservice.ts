import { FlowState } from "../engine/flowexecutorstore";
import { ActionExecutor } from "../execution/actionexecute";
import { FlowJson } from "../execution/interfaces";
import { IntegrationInterface } from "../actionmodules/interfaces";
import AppDataSource from "../database/data-source"
import FlowExecutorStoreModel from "../database/models/FlowExecutorStoreModel";
const flowExecutorRepository = AppDataSource.getRepository(FlowExecutorStoreModel)

export const DB = {
    getFlow(id: string): any {
      
        return {};
    },
    getActionExecutor(node: IntegrationInterface): ActionExecutor {
        return new ActionExecutor(node);
        //here it will get the details of the executor for the Action.
    },
    async getFlowExecutorStoreValue(flowId: string): Promise<FlowState> {
        let executor = await flowExecutorRepository.findOneBy({ flowId })
        return executor as FlowState
    }

}