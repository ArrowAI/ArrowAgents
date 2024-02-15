"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
class variable {
    constructor() {
        this.label = "Variable";
        this.name = "Variable";
        this.version = 1;
        this.description = "Variable";
        this.type = "Variable";
        this.inputs = [];
        this.icon = "";
        this.category = "";
        this.baseClasses = [];
        this.outputs = [{
                name: "number",
                label: "number",
                type: "number",
                additionalParams: true
            }];
    }
    async init(nodeData, _, options) {
        return nodeData.inputData.number;
    }
}
exports.variable = variable;
module.exports = { nodeClass: variable };
