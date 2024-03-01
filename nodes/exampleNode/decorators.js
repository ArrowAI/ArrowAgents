"use strict";
// Decorator for Action
// export function Action(actionConfig: any) {
//     return function (target: any, propertyKey: string) {
//         // Initialize the metadata property if it doesn't exist
//         if (!target.constructor.metadata) {
//             target.constructor.metadata = {};
//         }
//         target.constructor.metadata.actions = actionConfig;
//     };
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = exports.Prop = exports.Trigger = exports.Action = exports.Node = void 0;
function Node(nodeConfig) {
    return function (constructor) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = nodeConfig;
    };
}
exports.Node = Node;
function Action(actionConfig) {
    return function (constructor) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = actionConfig;
    };
}
exports.Action = Action;
// Decorator for Trigger
// export function Trigger(triggerConfig: any) {
//     return function (target: any, propertyKey: string) {
//         // Initialize the metadata property if it doesn't exist
//         if (!target.constructor.metadata) {
//             target.constructor.metadata = {};
//         }
//         // Add the triggerConfig to the metadata of the target class
//         target.constructor.metadata.triggers = triggerConfig;
//     };
// }
function Trigger(triggerConfig) {
    return function (constructor) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = triggerConfig;
    };
}
exports.Trigger = Trigger;
// Decorator for Prop
function Prop(propConfig) {
    return function (target, propertyKey) {
        // Initialize the metadata property if it doesn't exist
        if (!target.constructor.metadata) {
            target.constructor.metadata = {};
        }
        // Add the propConfig to the metadata of the target class
        target.constructor.metadata.props = propConfig;
    };
}
exports.Prop = Prop;
// Decorator for Executor
function Executor() {
    return function (target, propertyKey) {
        // Initialize the metadata property if it doesn't exist
        if (!target.constructor.metadata) {
            target.constructor.metadata = {};
        }
        // Add the executorConfig to the metadata of the target class
        target.constructor.metadata.executor = true;
    };
}
exports.Executor = Executor;
