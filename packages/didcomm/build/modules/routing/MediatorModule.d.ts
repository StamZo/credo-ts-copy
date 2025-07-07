import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { MediatorModuleConfigOptions } from './MediatorModuleConfig';
import { MediatorApi } from './MediatorApi';
import { MediatorModuleConfig } from './MediatorModuleConfig';
export declare class MediatorModule implements Module {
    readonly config: MediatorModuleConfig;
    readonly api: typeof MediatorApi;
    constructor(config?: MediatorModuleConfigOptions);
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    onInitializeContext(agentContext: AgentContext): Promise<void>;
}
