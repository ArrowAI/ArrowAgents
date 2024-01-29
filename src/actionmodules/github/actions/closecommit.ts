import { ActionInterface } from "../../interfaces";

export class GithubCloseCommit implements ActionInterface {
    constructor(){
    }
 
    actionProperties = {
        name: "GithubCloseCommit",
        description: "GithubCloseCommit",
        icon: "githubicon.svg"
    }
    execute(context:object){
        console.log("GithubCloseCommit");
    }
    data(){

    }
}