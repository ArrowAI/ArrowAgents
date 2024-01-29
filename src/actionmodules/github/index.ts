import { IntegrationInterface } from "../interfaces";
export class GithubIntegration implements IntegrationInterface {
    nodeProperties = {
        name: "Github",
        description: "Github",
        icon: "githubicon.svg"
    }

    constructor(){
    }
    actions = [GithubCloseCommit];

}