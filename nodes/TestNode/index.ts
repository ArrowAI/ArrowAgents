const ExampleAction = {
  name: 'ExampleAction',
  displayName: 'Example Action',
  description: 'This is a Example action',
  props: [
    {
      label: 'Repository Name',
      name: 'repoName',
      type: 'options',
      description: 'The name of the GitHub repository',
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            options: [],
            placeholder: 'please authenticate first',
          };
        }
        const authProp = auth
        const repositories = await getUserRepo(authProp);
        return {
          disabled: false,
          options: repositories.map((repo) => {
            return {
              label: "repo.owner.login + '/' + repo.name",
              value: {
                owner: "repo.owner.login",
                repo: "repo.name",
              },
            };
          }),
        };
      },
    },
    {
      label: 'Owner',
      name: 'owner',
      type: 'string',
      description: 'The owner of the GitHub repository',
    },
  ],
  outputs: [],
  controlInputs: [],
  controlOutputs: [],
  run: async () => {
    // Implement the action logic here
    return 'Action Result';
  },
  requireAuth: true,
};

const ExampleTrigger = {
  name: 'exampleTrigger',
  displayName: 'Example Trigger',
  description: 'This is a Example trigger',
  props: [
    {
      label: 'Webhook URL',
      name: 'webhookUrl',
      type: 'string',
      description: 'The URL for the Example webhook',
    },
  ],
  type: 'WEBHOOK',
  handshakeConfiguration: {
    strategy: 'NONE',
  },
  onEnable: async () => {
    // Implement the trigger enable logic here
  },
  onHandshake: async () => {
    // Implement the handshake logic here
    return { status: 200 };
  },
  onDisable: async () => {
    // Implement the trigger disable logic here
  },
  run: async () => {
    // Implement the trigger run logic here
    return 'Trigger Result';
  },
  test: async () => {
    // Implement the trigger test logic here
    return 'Trigger Test Result';
  },
  sampleData: {},
  requireAuth: true,
};

const ExampleNode = {

  actions: {
    example_issue: ExampleAction,
  },
  triggers: {
    exampleTrigger: ExampleTrigger,
  },
  auth: {
    type: 'OAUTH2',
    required: true,
    authUrl: 'https://example.com/login/oauth/authorize',
    tokenUrl: 'https://example.com/login/oauth/access_token',
    scope: ['admin:repo_hook', 'admin:org', 'repo'],
  }
};
const getUserRepo = (authProp) => {
  return []
}

module.exports = {
  nodeClass: ExampleNode
}