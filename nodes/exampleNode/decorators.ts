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

export function Node (nodeConfig:any){
    return function (constructor: any) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = nodeConfig;
    };
}

export function Action(actionConfig: any) {
    return function (constructor: any) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = actionConfig;
    };
}
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
export function Trigger(triggerConfig: any) {
    return function (constructor: any) {
        // Initialize the metadata property if it doesn't exist
        if (!constructor.prototype.metadata) {
            constructor.prototype.metadata = {};
        }
        constructor.prototype.metadata.actions = triggerConfig;
    };
}

// Decorator for Prop
export function Prop(propConfig: any) {
    return function (target: any, propertyKey: string) {
        // Initialize the metadata property if it doesn't exist
        if (!target.constructor.metadata) {
            target.constructor.metadata = {};
        }
        // Add the propConfig to the metadata of the target class
        target.constructor.metadata.props = propConfig;
    };
}



// Decorator for Executor
export function Executor() {
    return function (target: any, propertyKey: string) {
        // Initialize the metadata property if it doesn't exist
        if (!target.constructor.metadata) {
            target.constructor.metadata = {};
        }
        // Add the executorConfig to the metadata of the target class
        target.constructor.metadata.executor = true;
    };
}