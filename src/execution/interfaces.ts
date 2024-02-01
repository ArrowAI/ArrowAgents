import {IntegrationInterface} from "../actionmodules/interfaces";

export interface IContext {
    pastValues: [];
}


export type FlowJson= {
    flowData: {
        nodes: INode[],
        edges: IEdege[]
    };
    // nodes: IntegrationInterface[]
}

export type INode={
    id(id: any): unknown;

}
export type IEdege={

}
export enum ExecutionType{
    local='local',
    remoteExecutor='remoteExecutor'
}
export type ActionExecutorType = {
    executionType: ExecutionType;
    executionUrl? : string;

}