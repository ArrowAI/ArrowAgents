import {IntegrationInterface} from "../actionmodules/interfaces";

export interface IContext {
    pastValues: [];
}

export type FlowJson= {
    nodes: IntegrationInterface[]
}
export enum ExecutionType{
    local='local',
    remoteExecutor='remoteExecutor'
}
export type ActionExecutorType = {
    executionType: ExecutionType;
    executionUrl? : string;

}