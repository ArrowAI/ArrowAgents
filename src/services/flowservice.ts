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
            "name": "Example Workflow",
            "nodes": [
                {
                    "id": "node0",
                    "type": "control",
                    actions: [{
                        actionId: "action0",
                        actionType: "node0.action",
                        actionProperties: {
                            name: "action0",
                            description: "action0",

                        }
                    }]
                },
                {
                    "id": "node1",
                    "type": "control",
                    actions: [{
                        actionId: "action0",
                        actionType: "node1.action",
                        actionProperties: {
                            name: "action0",
                            description: "action0",

                        }
                    }]
                },
                {
                    "id": "node2",
                    "type": "data",
                    actions: [{
                        actionId: "action0",
                        actionType: "node2.action",
                        actionProperties: {
                            name: "action0",
                            description: "action0",

                        }
                    }]
                },
                {
                    "id": "node3",
                    "type": "data",
                    actions: [{
                        actionId: "action0",
                        actionType: "node3.action",
                        actionProperties: {
                            name: "action0",
                            description: "action0",

                        }
                    }]
                }
            ],
            "connections": [
                {
                    "source": "node2",
                    "target": "node0"
                },
                {
                    "source": "node3",
                    "target": "node1"
                },
                {
                    "source": "node0",
                    "target": "node3"
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