# ArrowAgent Executor

This is the Main Repository for Executing the ArrowAI workflows.

## Structure

The Repository consists of 
1. **Engines**

Engines are Executors that take the Workflows and Execute them. 
The Engines can run inside multiple Structures. 

  - **Isolate Engine**

The Isolate Engine is Variant of Engine that runs on ArrowAI CodeSandbox.

2. **Agent Server**

Agent Server is something where you ask for the Execution of the Flow. The Agent Server will be having its own Database where it maintains the flow state and other variables.



## External Application Usage

1. **Sandbox Orchestrator**

The Sandbox Executor is one that manages the Orchestration of Sandboxes on Things like Kubernetes. The Structure of Sandbox Orchestrator is that it has individual Executor and handles the Execution.

2. **Individual sandbox Executor**

The Individual sandbox Executor is the one that is responsible for the Execution of the Flow. This can be directly called by the Agent Server.

3. **Cloud Run Sandbox Executor** 

This is something that handles the Execution of the Flow on Google Cloud Run.


```mermaid
graph TD;
    subgraph agent server
    AgentServer-.-|maintains state|Database;
    end
    subgraph sandbox
    AgentServer<-->|requests execution|SandboxOrchestrator;
    SandboxOrchestrator-->|manages Executors and asks for execution|SandboxExecutor;
    SandboxExecutor-.-|uses|IsolateC++;
    end
    SandboxExecutor-.-|uses|Engine;
    subgraph registry
    SandboxExecutor<-->|connects for caching|ArrowAIRegistry;
    ArrowAIRegistry-->|Pushes Npm Modules|NPM_Registry;
    SandboxExecutor<-->|connects for Npm Install|NPM_Registry;
    ArrowAIRegistry-.-|Has Access|RegistryDatabase;
    end
    User-->|Pushed Modules|ArrowAIRegistry;
    User-.-|Access Interface|ArrowAIRegistry;
    User-.-|Accesses Interface|SandboxOrchestrator;
    User-.-|Main Inteface|MainFlowUI;
    subgraph main app
    MainFlowUI-->|Calls|APIServer;
    end
    MainFlowUI<-->|Calls For Execution|AgentServer;
    MainFlowUI-.-|Calls For Showing of Data|AgentServer;
    User-.-|Calls Agent Server For Direct Running using Python or Nodejs SDK|AgentServer;
    subgraph cloudrun
    AgentServer<-->|requests execution|CloudRunSandboxExecutor;
    CloudRunSandboxExecutor-.-|uses|CloudRunEngine;
    end
```