import { sum } from "lodash"

import { getOutputControlObservable } from "./../src/execution/flowexecute"
export class addnumbers {
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
        console.log("Sum");
        this.name = "Sum";
        this.label = "Sum";
        this.description = "Sum of two input varibale",

            this.version = 1;

        this.type = "Variable";
        this.inputs = [];
        this.icon = "";
        this.category = "";

        this.baseClasses = []
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
        }]
        this.outputs = [{
            name: "additionComplete",
            label: "Addition Complete",
            type: "control"
        }]
    }
    async init(): Promise<any> {
        // Not used
        return undefined
    }
    getDataOutput(nodeData: any) {


    }
    run(nodeData: any, input: string, context: any) {
        const firstNumber = nodeData.inputData?.firstNumber as string
        const secNumber = nodeData.inputData?.secNumber as string;

        let result = sum([Number(firstNumber), Number(secNumber)]);
        context[nodeData.name] = {
            "outputData": {

            }
        }
        context[nodeData.name]["outputData"] = { sum: result } as any;
        const outputControlObservable = getOutputControlObservable();
        outputControlObservable.next({
            nodeId: nodeData.id,
            outputcontrolPinId: "additionComplete",
            context: context
        })
        return context//result;
        //TODO: we need to trigger output control node here
        //we will call triggerOutputControlNode("nodeId","outputcontrolPinId",context)
    }
}

module.exports = { nodeClass: addnumbers }