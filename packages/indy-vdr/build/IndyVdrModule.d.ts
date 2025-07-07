import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { IndyVdrModuleConfigOptions } from './IndyVdrModuleConfig';
import { IndyVdrApi } from './IndyVdrApi';
import { IndyVdrModuleConfig } from './IndyVdrModuleConfig';
/**
 * @public
 * */
export declare class IndyVdrModule implements Module {
    readonly config: IndyVdrModuleConfig;
    readonly api: typeof IndyVdrApi;
    constructor(config: IndyVdrModuleConfigOptions);
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    shutdown(agentContext: AgentContext): Promise<void>;
}
