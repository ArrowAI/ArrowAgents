"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVariable = void 0;
const src_1 = require("../../engine/src");
class setVariable {
    constructor() {
        this.label = "SetVariable";
        this.name = "SetVariable";
        this.version = 1;
        this.description = "Set Global Variable";
        this.type = "Variable";
        this.inputs = [];
        this.icon = "";
        this.category = "";
        this.baseClasses = [];
        this.outputs = [],
            this.controlInputs = [{
                    "name": "default",
                    "id": "setVariable1-input-control-default",
                    "label": " Control Input"
                }],
            this.contrlOutputs = [{
                    "name": "default",
                    "id": "setVariable1-output-control-default",
                    "label": "End Control Output"
                }];
    }
    async init() {
        // Not used
        return undefined;
    }
    run(nodeData, input, flowState) {
        var _a, _b;
        const inputRaw = (_a = nodeData.inputData) === null || _a === void 0 ? void 0 : _a.input;
        const variableName = (_b = nodeData.inputData) === null || _b === void 0 ? void 0 : _b.variableName;
        flowState.context = Object.assign(Object.assign({}, flowState.context), { [variableName]: inputRaw });
        const outputControlObservable = (0, src_1.getOutputControlObservable)();
        outputControlObservable.next({
            nodeId: nodeData.id,
            outputcontrolPinId: "default",
            flowState: flowState
        });
        return flowState;
    }
}
exports.setVariable = setVariable;
module.exports = { nodeClass: setVariable };
