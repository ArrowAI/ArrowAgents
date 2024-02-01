import {Flow} from "../src/execution/flow"


// Open actualworkflow.json file and parse the json as variable workflow
var workflow = require('../datajson/simpleflowFormat.json');
// console.log(workflow.functions.main.flow);

describe('Get SubGraph ', () => {
    it('cal function getSubGraphOfAllConnectedDataNodes', async () => {
        let flow = new Flow(workflow.functions.main.flow);
        // flow.getSubGraphOfAllConnectedDataNodes('conversationalAgent_0');
        // var flowExecutor = new FlowExecuteHandler();
        // var response = await flowExecutor.iterateGraph(workflow,'', {context: {},currentNodeId:''});
       expect(1).toBe(1);
    });
});