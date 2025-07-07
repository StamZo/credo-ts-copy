import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { BasicMessagesApi } from './BasicMessagesApi';
export declare class BasicMessagesModule implements Module {
    readonly api: typeof BasicMessagesApi;
    /**
     * Registers the dependencies of the basic message module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
