import { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { IndyBesuModuleConfig, IndyBesuModuleConfigOptions } from './IndyBesuModuleConfig';
export declare class IndyBesuModule implements Module {
    readonly config: IndyBesuModuleConfig;
    constructor(options: IndyBesuModuleConfigOptions);
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    private createMockClient;
}
