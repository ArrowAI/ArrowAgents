

export class variable {
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
    constructor() {
        this.label = "Variable";
        this.name = "Variable";
        this.version = 1;
        this.description = "Variable";
        this.type = "Variable";
        this.inputs=[];
        this.icon="";
        this.category="";
        this.baseClasses=[]

        this.outputs = [{
            name: "number",
            label: "number",
            type: "number",
            additionalParams: true
        }]
    }
    async init(nodeData: any, _: string, options: any) {
        return nodeData.inputData.number
    }
}

module.exports = { nodeClass: variable }