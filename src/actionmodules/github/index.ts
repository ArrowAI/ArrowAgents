import { ActionInterface, IntegrationInterface } from "../interfaces";
import { GithubCloseCommit } from "./actions/closecommit";
export class GithubIntegration implements IntegrationInterface {
    nodeProperties = {
        name: "Github",
        description: "Github",
        icon: "githubicon.svg"
    }

    constructor(){
    }


    actions: ActionInterface[] = [new GithubCloseCommit()];



}