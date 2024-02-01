import {FlowExecuteHandler} from "../src/execution/flowexecute"


// Open actualworkflow.json file and parse the json as variable workflow
var workflow = require('../random/subgraph.json');

describe('Graph Iteration', () => {
    it('Execute the flow', async () => {
        var flowExecutor = new FlowExecuteHandler();
        var response = await flowExecutor.startActivity(workflow, {context: {},currentNodeId:''});
       expect(1).toBe(1);
    });
});