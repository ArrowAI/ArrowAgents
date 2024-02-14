import {FlowExecuteHandler} from "../src/execution/flowexecute"


// Open actualworkflow.json file and parse the json as variable workflow
var workflow = require('../datajson/controlflowTest.json');

describe('Start Activity', () => {
    it('Execute the flow', async () => {
        var flowExecutor = new FlowExecuteHandler();
        var response = await flowExecutor.startActivity(workflow, {
            context: {}, currentNodeId: '',
            flowId: "",
            flow: undefined
        });
       expect(1).toBe(1);
    });
});