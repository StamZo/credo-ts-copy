import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { ConnectionsModuleConfigOptions } from './ConnectionsModuleConfig';
import { ConnectionsApi } from './ConnectionsApi';
import { ConnectionsModuleConfig } from './ConnectionsModuleConfig';
export declare class ConnectionsModule implements Module {
    readonly config: ConnectionsModuleConfig;
    readonly api: typeof ConnectionsApi;
    constructor(config?: ConnectionsModuleConfigOptions);
    /**
     * Registers the dependencies of the connections module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
