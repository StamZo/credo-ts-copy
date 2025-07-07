import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { ActionMenuApi } from './ActionMenuApi';
/**
 * @public
 */
export declare class ActionMenuModule implements Module {
    readonly api: typeof ActionMenuApi;
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
