export interface IBlueprintVariableDef{
    name: string;
    typeName: string;  //If we are passing string then typeName will be "String" or if number then "Int" or if vectorgraph object then "VectorGraphObject"
}


//TODO: resolve the typename to actual type. try using Templates
export class BlueprintNode {
    constructor() {
        console.log("BlueprintNode");
    }
    execute(context: object) {

    }
    baseClassName: string;
    graph: object;
    inputs: IBlueprintVariableDef[] = [{"name": "a", "typeName": "String"}];
    outputs = [];
}

//TODO: The typename written is something that is for checking type. During execution it will just get the object. 
//TODO: Check the mapping input and change the name of VariableDef with actual object during execution.