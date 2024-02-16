"use strict";
class GetVariable {
    constructor() {
        this.label = 'Get Variable';
        this.name = 'getVariable';
        this.version = 1.0;
        this.type = 'GetVariable';
        this.icon = 'getvar.svg';
        this.category = 'Utilities';
        this.description = `Get variable that was saved using Set Variable node`;
        this.baseClasses = [this.type, 'Utilities'];
        this.inputs = [
            {
                label: 'Variable Name',
                name: 'variableName',
                type: 'string',
                placeholder: 'var1'
            }
        ];
        this.outputs = [
            {
                label: 'Output',
                name: 'output',
                baseClasses: ['string', 'number', 'boolean', 'json', 'array']
            }
        ];
    }
    async init(nodeData, _, options) {
        var _a;
        const variableName = (_a = nodeData.inputs) === null || _a === void 0 ? void 0 : _a.variableName;
        const dynamicVars = options.dynamicVariables;
        if (Object.prototype.hasOwnProperty.call(dynamicVars, variableName)) {
            return dynamicVars[variableName];
        }
        return undefined;
    }
}
module.exports = { nodeClass: GetVariable };
