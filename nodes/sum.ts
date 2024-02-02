import { sum } from "lodash"


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
    constructor() {
        console.log("Sum");
        this.name = "Sum";
        this.label = "Sum";
        this.description = "Sum of two input varibale",
     
        this.version = 1;
 
        this.type = "Variable";
        this.inputs=[];
        this.icon="";
        this.category="";
        this.baseClasses=[]
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
    }
    async init(): Promise<any> {
        // Not used
        return undefined
    }
    run(nodeData: any, input: string, options: any) {
        
        const firstNumber = nodeData.inputData?.firstNumber as string
        const secNumber = nodeData.inputData?.secNumber as string
        return sum([Number(firstNumber), Number(secNumber)])
    }
}

module.exports = { nodeClass: addnumbers }