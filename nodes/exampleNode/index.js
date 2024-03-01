"use strict";
// ExampleNode class
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleAction = exports.ExampleNode = void 0;
const decorators_1 = require("./decorators");
let ExampleNode = class ExampleNode {
    constructor() {
        this.actions = {
            example_issue: new ExampleAction(),
        };
        this.triggers = {
            exampleTrigger: new ExampleTrigger(),
        };
        this.auth = {
            type: 'OAUTH2',
            required: true,
            authUrl: 'https://example.com/login/oauth/authorize',
            tokenUrl: 'https://example.com/login/oauth/access_token',
            scope: ['admin:repo_hook', 'admin:org', 'repo'],
        };
    }
};
exports.ExampleNode = ExampleNode;
exports.ExampleNode = ExampleNode = __decorate([
    (0, decorators_1.Node)({
        "name": 'example',
        "description": 'node Description'
    }),
    __metadata("design:paramtypes", [])
], ExampleNode);
// ExampleAction class
let ExampleAction = class ExampleAction {
    async reponame(auth, contextData) {
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
    async owner({ auth }) {
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
    run(context, inputData) {
        let outputval = {
            "sum": inputData.input[1] + inputData.input[2]
        };
        context.triggerControlOutput("default", outputval);
        // If no Control Output then simple Return outputval
    }
};
exports.ExampleAction = ExampleAction;
__decorate([
    (0, decorators_1.Prop)({
        "name": "RepoName",
        "label": "Repo Name",
        "type": "options"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExampleAction.prototype, "reponame", null);
__decorate([
    (0, decorators_1.Prop)({
        "name": "owner",
        "label": "Owner",
        "required": true,
        "type": "options"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExampleAction.prototype, "owner", null);
__decorate([
    (0, decorators_1.Executor)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ExampleAction.prototype, "run", null);
exports.ExampleAction = ExampleAction = __decorate([
    (0, decorators_1.Action)({
        "name": "Add Node",
        "inputs": [],
        "outputs": [],
        "inputControl": ["default"],
        "outputControl": ["default"],
        "props": []
    })
], ExampleAction);
// ExampleTrigger class
let ExampleTrigger = class ExampleTrigger {
};
__decorate([
    (0, decorators_1.Prop)({
        label: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        description: 'The URL for the Example webhook',
    }),
    __metadata("design:type", Object)
], ExampleTrigger.prototype, "webhookUrl", void 0);
ExampleTrigger = __decorate([
    (0, decorators_1.Trigger)({
        "name": "Example Trigger",
        "inputs": [],
        "outputs": [],
        "inputControl": ["default"],
        "outputControl": ["default"],
        "props": []
    })
], ExampleTrigger);
// Example function to simulate fetching repositories
async function getUserRepo(authProp) {
    // Simulate fetching repositories
    return [
        { owner: { login: 'user1' }, name: 'repo1' },
        { owner: { login: 'user2' }, name: 'repo2' },
    ];
}
module.exports = {
    nodeClass: ExampleNode
};
