"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
// Define the transformer function
function transformExampleNodeToJson(exampleNode) {
    const transformedNode = {};
    // Transform actions
    transformedNode.actions = {};
    for (const actionKey in exampleNode.actions) {
        if (Object.prototype.hasOwnProperty.call(exampleNode.actions, actionKey)) {
            const action = exampleNode.actions[actionKey];
            transformedNode.actions[actionKey] = action.constructor.metadata;
        }
    }
    // Transform triggers
    transformedNode.triggers = {};
    for (const triggerKey in exampleNode.triggers) {
        if (Object.prototype.hasOwnProperty.call(exampleNode.triggers, triggerKey)) {
            const trigger = exampleNode.triggers[triggerKey];
            transformedNode.triggers[triggerKey] = trigger.constructor.metadata;
        }
    }
    // Transform auth
    transformedNode.auth = exampleNode.auth;
    return transformedNode;
}
// Usage example
const exampleNode = new _1.ExampleNode();
const transformedJson = transformExampleNodeToJson(exampleNode);
console.log(JSON.stringify(transformedJson));
