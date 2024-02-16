

export class variable { 
    constructor() {
    }
    async init(nodeData: any, _: string, options: any) {
        return nodeData.inputData.number
    }
}

module.exports = { nodeClass: variable }