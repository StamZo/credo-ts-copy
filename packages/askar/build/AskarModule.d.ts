import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { AskarModuleConfigOptions } from './AskarModuleConfig';
import { AskarApi } from './AskarApi';
import { AskarModuleConfig } from './AskarModuleConfig';
export declare class AskarModule implements Module {
    readonly config: AskarModuleConfig;
    constructor(config: AskarModuleConfigOptions);
    api: typeof AskarApi;
    register(dependencyManager: DependencyManager): void;
    onInitializeContext(agentContext: AgentContext): Promise<void>;
    onProvisionContext(agentContext: AgentContext): Promise<void>;
    onDeleteContext(agentContext: AgentContext): Promise<void>;
    onCloseContext(agentContext: AgentContext): Promise<void>;
}
