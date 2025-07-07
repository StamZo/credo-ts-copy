import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { DidCommModuleConfigOptions } from './DidCommModuleConfig';
import { DidCommApi } from './DidCommApi';
import { DidCommModuleConfig } from './DidCommModuleConfig';
import { updateV0_1ToV0_2 } from './updates/0.1-0.2';
import { updateV0_2ToV0_3 } from './updates/0.2-0.3';
import { updateV0_4ToV0_5 } from './updates/0.4-0.5';
export declare class DidCommModule implements Module {
    readonly config: DidCommModuleConfig;
    readonly api: typeof DidCommApi;
    constructor(config?: DidCommModuleConfigOptions);
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    shutdown(agentContext: AgentContext): Promise<void>;
    updates: ({
        fromVersion: "0.1";
        toVersion: "0.2";
        doUpdate: typeof updateV0_1ToV0_2;
    } | {
        fromVersion: "0.2";
        toVersion: "0.3";
        doUpdate: typeof updateV0_2ToV0_3;
    } | {
        fromVersion: "0.4";
        toVersion: "0.5";
        doUpdate: typeof updateV0_4ToV0_5;
    })[];
}
