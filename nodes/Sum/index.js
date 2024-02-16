"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addnumbers = void 0;
const lodash_1 = require("lodash");
// import { FlowState } from "../../engine/src/lib/flow"
// import { getOutputControlObservable } from "../../engine/src"
class addnumbers {
    constructor() {
        // console.log("Sum");
        this.name = "Sum";
        this.label = "Sum";
        this.description = "Sum of two input varibale",
            this.version = 1;
        this.type = "Variable";
        this.inputs = [];
        this.icon = "";
        this.category = "";
        this.baseClasses = [];
        this.inputs = [{
                name: "firstNumber",
                label: "firstNumber",
                type: "number",
                additionalParams: true
            }, {
                name: "secNumber",
                label: "secNumber",
                type: "number",
                additionalParams: true
            }];
        this.outputs = [{
                name: "additionComplete",
                label: "Addition Complete",
                type: "control"
            }];
    }
    async init() {
        // Not used
        return undefined;
    }
    getDataOutput(nodeData) {
    }
    run(nodeData, input, flowState) {
        var _a, _b;
        const firstNumber = (_a = nodeData.inputData) === null || _a === void 0 ? void 0 : _a.firstNumber;
        const secNumber = (_b = nodeData.inputData) === null || _b === void 0 ? void 0 : _b.secNumber;
        let result = (0, lodash_1.sum)([Number(firstNumber), Number(secNumber)]);
        // console.log("Sum result: " + result);
        flowState.context[nodeData.name] = {
            "outputData": {
                sum: result
            }
        };
        const outputControlObservable = flowState.context.OutputControlObservable;
        outputControlObservable.next({
            nodeId: nodeData.id,
            outputcontrolPinId: "additionComplete",
            flowState: flowState
        });
        return flowState; //result;
        //TODO: we need to trigger output control node here
        //we will call triggerOutputControlNode("nodeId","outputcontrolPinId",context)
    }
}
exports.addnumbers = addnumbers;
module.exports = { nodeClass: addnumbers };
