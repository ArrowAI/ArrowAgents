


export class setVariable {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: any[]
    outputs: any[]
    contrlOutputs: any[]
    controlInputs: any[]
    constructor() {
        this.label = "SetVariable";
        this.name = "SetVariable";
        this.version = 1;
        this.description = "Set Global Variable";
        this.type = "Variable";
        this.inputs = [];
        this.icon = "";
        this.category = "";
        this.baseClasses = []
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
            }]
    }
    async init(): Promise<any> {
        // Not used
        return undefined
    }
    run(nodeData: any, input: string, flowState: any) {
        const inputRaw = nodeData.inputData?.input
        const variableName = nodeData.inputData?.variableName as string
        flowState.context = { ...flowState.context, ... { [variableName]: inputRaw } }
        const outputControlObservable =  flowState.context.OutputControlObservable;
        outputControlObservable.next({
            nodeId: nodeData.id,
            outputcontrolPinId: "default",
            flowState: flowState
        })
        return flowState

    }
}

module.exports = { nodeClass: setVariable }