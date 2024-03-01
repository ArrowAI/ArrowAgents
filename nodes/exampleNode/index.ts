
// ExampleNode class

import { Action, Executor, Prop, Trigger, Node } from './decorators'

@Node({
    "name": 'example',
    "description": 'node Description'
})
export class ExampleNode {
    constructor() {
        
    }
    
    metadata: any; // Add metadata property
    actions = {
        example_issue: new ExampleAction(),
    };
    triggers = {
        exampleTrigger: new ExampleTrigger(),
    };
    auth = {
        type: 'OAUTH2',
        required: true,
        authUrl: 'https://example.com/login/oauth/authorize',
        tokenUrl: 'https://example.com/login/oauth/access_token',
        scope: ['admin:repo_hook', 'admin:org', 'repo'],
    };
    name: any;
}

// ExampleAction class
@Action({
    "name": "Add Node",
    "inputs": [],
    "outputs": [],
    "inputControl": ["default"],
    "outputControl": ["default"],
    "props": []
})
export class ExampleAction {
    metadata: any;
    @Prop({
        "name": "RepoName",
        "label": "Repo Name",
        "type": "options"
    })
    public async reponame(auth, contextData) {
        if (!auth) {
            return {
                disabled: true,
                options: [],
                placeholder: 'please authenticate first',
            };
        }
        const authProp = auth;
        const repositories = await getUserRepo(authProp);
        return {
            disabled: false,
            options: repositories.map((repo) => {
                return {
                    label: `${repo.owner.login}/${repo.name}`,
                    value: {
                        owner: repo.owner.login,
                        repo: repo.name,
                    },
                };
            }),
        };
    }
    @Prop({
        "name": "owner",
        "label": "Owner",
        "required": true,
        "type": "options"
    })
    public async owner({ auth }) {
        if (!auth) {
            return {
                disabled: true,
                options: [],
                placeholder: 'please authenticate first',
            };
        }
        const authProp = auth;
        const repositories = await getUserRepo(authProp);
        return {
            disabled: false,
            options: repositories.map((repo) => {
                return {
                    label: `${repo.owner.login}/${repo.name}`,
                    value: {
                        owner: repo.owner.login,
                        repo: repo.name,
                    },
                };
            }),
        };
    }
    @Executor()
    public run(context, inputData) {
        let outputval = {
            "sum": inputData.input[1] + inputData.input[2]
        };
        context.triggerControlOutput("default", outputval);
        // If no Control Output then simple Return outputval
    }
}
// ExampleTrigger class
@Trigger({
    "name": "Example Trigger",
    "inputs": [],
    "outputs": [],
    "inputControl": ["default"],
    "outputControl": ["default"],
    "props": []
})
class ExampleTrigger {
    metadata: any;
    @Prop({
        label: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        description: 'The URL for the Example webhook',
    })
    webhookUrl: any;

    // Other properties...
}

// Example function to simulate fetching repositories
async function getUserRepo(authProp: any) {
    // Simulate fetching repositories
    return [
        { owner: { login: 'user1' }, name: 'repo1' },
        { owner: { login: 'user2' }, name: 'repo2' },
    ];
}

module.exports = {
    nodeClass: ExampleNode
}




