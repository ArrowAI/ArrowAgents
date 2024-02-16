"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
class variable {
    constructor() {
    }
    async init(nodeData, _, options) {
        return nodeData.inputData.number;
    }
}
exports.variable = variable;
module.exports = { nodeClass: variable };
