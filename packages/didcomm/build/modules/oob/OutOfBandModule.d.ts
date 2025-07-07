import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { OutOfBandApi } from './OutOfBandApi';
export declare class OutOfBandModule implements Module {
    readonly api: typeof OutOfBandApi;
    /**
     * Registers the dependencies of the ot of band module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
