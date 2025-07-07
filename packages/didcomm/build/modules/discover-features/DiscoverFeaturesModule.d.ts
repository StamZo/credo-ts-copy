import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { DiscoverFeaturesModuleConfigOptions } from './DiscoverFeaturesModuleConfig';
import { DiscoverFeaturesApi } from './DiscoverFeaturesApi';
import { DiscoverFeaturesModuleConfig } from './DiscoverFeaturesModuleConfig';
export declare class DiscoverFeaturesModule implements Module {
    readonly api: typeof DiscoverFeaturesApi;
    readonly config: DiscoverFeaturesModuleConfig;
    constructor(config?: DiscoverFeaturesModuleConfigOptions);
    /**
     * Registers the dependencies of the discover features module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
