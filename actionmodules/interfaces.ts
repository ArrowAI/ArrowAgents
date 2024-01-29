import { IContext } from "../execution/interfaces";

//For the defintion of the actions
export interface IActionProperties{
    name: string;
    description: string;
    icon: string;
}
export interface ActionInterface {
    actionProperties: IActionProperties;
    actionId:string
    execute?(context:IContext): void;
}



//For the Definition of Integration or Modules
export interface INodeProperties{
    name: string;
    description: string;
    icon: string;
}
export interface IntegrationInterface {
    nodeProperties: INodeProperties;
    actions: ActionInterface[];
}