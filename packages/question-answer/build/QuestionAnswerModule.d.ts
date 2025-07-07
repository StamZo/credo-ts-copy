import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import { QuestionAnswerApi } from './QuestionAnswerApi';
export declare class QuestionAnswerModule implements Module {
    readonly api: typeof QuestionAnswerApi;
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
