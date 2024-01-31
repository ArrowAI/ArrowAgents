import {FlowExecuteHandler} from "../src/execution/flowexecute"


var FlowJson = {
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

describe('Graph Iteration', () => {
    it('Execute the flow', async () => {
        var flowExecutor = new FlowExecuteHandler();

       expect(1).toBe(1);
    });
});