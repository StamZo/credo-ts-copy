import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { DrpcApi } from './DrpcApi';
export declare class DrpcModule implements Module {
    readonly api: typeof DrpcApi;
    /**
     * Registers the dependencies of the drpc message module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
