import type { AgentContext, ApiModule, Constructor, DependencyManager, Optional } from '@credo-ts/core';
import type { MessagePickupModuleConfigOptions } from './MessagePickupModuleConfig';
import type { MessagePickupProtocol } from './protocol/MessagePickupProtocol';
import { MessagePickupApi } from './MessagePickupApi';
import { MessagePickupModuleConfig } from './MessagePickupModuleConfig';
import { V1MessagePickupProtocol, V2MessagePickupProtocol } from './protocol';
/**
 * Default protocols that will be registered if the `protocols` property is not configured.
 */
export type DefaultMessagePickupProtocols = [V1MessagePickupProtocol, V2MessagePickupProtocol];
export type MessagePickupModuleOptions<MessagePickupProtocols extends MessagePickupProtocol[]> = Optional<MessagePickupModuleConfigOptions<MessagePickupProtocols>, 'protocols'>;
export declare class MessagePickupModule<MessagePickupProtocols extends MessagePickupProtocol[] = DefaultMessagePickupProtocols> implements ApiModule {
    readonly config: MessagePickupModuleConfig<MessagePickupProtocols>;
    readonly api: Constructor<MessagePickupApi<MessagePickupProtocols>>;
    constructor(config?: MessagePickupModuleOptions<MessagePickupProtocols>);
    /**
     * Registers the dependencies of the message pickup answer module on the dependency manager.
     */
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
    onInitializeContext(agentContext: AgentContext): Promise<void>;
}
