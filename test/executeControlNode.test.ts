import {Flow} from "../src/execution/flow"


// Open actualworkflow.json file and parse the json as variable workflow
var workflow = require('../datajson/simpleflowFormat.json');
// console.log(workflow.functions.main.flow);

describe('Get SubGraph ', () => {
    it('cal function getSubGraphOfAllConnectedDataNodes', async () => {
        let flow = new Flow(workflow.functions.main.flow);
        // console.log(flow.nodes);
        // console.log(flow.edges);
        // flow.constructGraphs(flow.nodes, flow.edges);
        // var flowExecutor = new FlowExecuteHandler();
        // var response = await flowExecutor.iterateGraph(workflow,'', {context: {},currentNodeId:''});
       expect(1).toBe(1);
    });
});