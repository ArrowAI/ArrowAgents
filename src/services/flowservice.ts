import { FlowState } from "../engine/flowexecutorstore";
import { ActionExecutor } from "../execution/actionexecute";
import { FlowJson } from "../execution/interfaces";
import { IntegrationInterface } from "../actionmodules/interfaces";
import AppDataSource from "../database/data-source"
import FlowExecutorStoreModel from "../database/models/FlowExecutorStoreModel";
const flowExecutorRepository = AppDataSource.getRepository(FlowExecutorStoreModel)

export const DB = {
    getFlow(id: string): any {
        let flow = {
            name: "tetFlwo",
            type: "BaseAgent",
            nodes: [{
                id: "conversationalChain0",
                name: "Conversational Chain",
                type: "langchain.chain",
                properties: {

                },
                actions: [{
                    actionId: "action0",
                    actionType: "langchain.action",
                    actionProperties: {
                        name: "action0",
                        description: "action0",
                        icon: "githubicon.svg"
                    }
                }]
            },
            {
                id: "switch0",
                name: "Switch",
                type: "switch",
                properties: {

                },
                actions: [{
                    actionId: "action0",
                    actionType: "switch0.action",
                    actionProperties: {
                        name: "action0",
                        description: "action0",
                        icon: "githubicon.svg"
                    }
                }]
            },

            ],
            connections: [

                {
                    source: "conversationalChain0",
                    target: "switch0"
                }

            ]
        }
        return flow;
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