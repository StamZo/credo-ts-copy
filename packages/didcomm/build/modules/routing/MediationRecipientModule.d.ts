import type { AgentContext, DependencyManager, Module } from '@credo-ts/core';
import type { MediationRecipientModuleConfigOptions } from './MediationRecipientModuleConfig';
import { MediationRecipientApi } from './MediationRecipientApi';
import { MediationRecipientModuleConfig } from './MediationRecipientModuleConfig';
export declare class MediationRecipientModule implements Module {
    readonly config: MediationRecipientModuleConfig;
    readonly api: typeof MediationRecipientApi;
    constructor(config?: MediationRecipientModuleConfigOptions);
    /**
     * Registers the dependencies of the mediator recipient module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    onCloseContext(agentContext: AgentContext): Promise<void>;
    onInitializeContext(agentContext: AgentContext): Promise<void>;
    protected getMediationConnection(agentContext: AgentContext, mediatorInvitationUrl: string): Promise<import("../connections").ConnectionRecord>;
}
