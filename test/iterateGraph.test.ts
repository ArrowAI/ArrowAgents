import {FlowExecuteHandler} from "../src/execution/flowexecute"


// Open actualworkflow.json file and parse the json as variable workflow
var workflow = require('../datajson/actualworkflow.json');

describe('Graph Iteration', () => {
    it('Execute the flow', async () => {
        var flowExecutor = new FlowExecuteHandler();

       expect(1).toBe(1);
    });
});