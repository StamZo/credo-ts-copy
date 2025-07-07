import type { AgentContext } from '@credo-ts/core';
import type { AgentMessage } from '../../../AgentMessage';
import type { FeatureRegistry } from '../../../FeatureRegistry';
import type { MessageHandlerRegistry } from '../../../MessageHandlerRegistry';
import type { MessagePickupProtocol } from './MessagePickupProtocol';
import type { DeliverMessagesProtocolOptions, DeliverMessagesProtocolReturnType, PickupMessagesProtocolOptions, PickupMessagesProtocolReturnType, SetLiveDeliveryModeProtocolOptions, SetLiveDeliveryModeProtocolReturnType } from './MessagePickupProtocolOptions';
/**
 * Base implementation of the MessagePickupProtocol that can be used as a foundation for implementing
 * the MessagePickupProtocol interface.
 */
export declare abstract class BaseMessagePickupProtocol implements MessagePickupProtocol {
    abstract readonly version: string;
    abstract createPickupMessage(agentContext: AgentContext, options: PickupMessagesProtocolOptions): Promise<PickupMessagesProtocolReturnType<AgentMessage>>;
    abstract createDeliveryMessage(agentContext: AgentContext, options: DeliverMessagesProtocolOptions): Promise<DeliverMessagesProtocolReturnType<AgentMessage> | undefined>;
    abstract setLiveDeliveryMode(agentContext: AgentContext, options: SetLiveDeliveryModeProtocolOptions): Promise<SetLiveDeliveryModeProtocolReturnType<AgentMessage>>;
    abstract register(messageHandlerRegistry: MessageHandlerRegistry, featureRegistry: FeatureRegistry): void;
}
