import type { AgentContext } from '@credo-ts/core';
import type { AgentMessage } from '../../../../AgentMessage';
import type { FeatureRegistry } from '../../../../FeatureRegistry';
import type { MessageHandlerRegistry } from '../../../../MessageHandlerRegistry';
import type { InboundMessageContext } from '../../../../models';
import type { DeliverMessagesProtocolOptions, DeliverMessagesProtocolReturnType, PickupMessagesProtocolOptions, PickupMessagesProtocolReturnType, SetLiveDeliveryModeProtocolReturnType } from '../MessagePickupProtocolOptions';
import { OutboundMessageContext } from '../../../../models';
import { BaseMessagePickupProtocol } from '../BaseMessagePickupProtocol';
import { V1BatchMessage, V1BatchPickupMessage } from './messages';
export declare class V1MessagePickupProtocol extends BaseMessagePickupProtocol {
    /**
     * The version of the message pickup protocol this class supports
     */
    readonly version: "v1";
    /**
     * Registers the protocol implementation (handlers, feature registry) on the agent.
     */
    register(messageHandlerRegistry: MessageHandlerRegistry, featureRegistry: FeatureRegistry): void;
    createPickupMessage(agentContext: AgentContext, options: PickupMessagesProtocolOptions): Promise<PickupMessagesProtocolReturnType<AgentMessage>>;
    createDeliveryMessage(agentContext: AgentContext, options: DeliverMessagesProtocolOptions): Promise<DeliverMessagesProtocolReturnType<AgentMessage> | undefined>;
    setLiveDeliveryMode(): Promise<SetLiveDeliveryModeProtocolReturnType<AgentMessage>>;
    processBatchPickup(messageContext: InboundMessageContext<V1BatchPickupMessage>): Promise<OutboundMessageContext<V1BatchMessage>>;
    processBatch(messageContext: InboundMessageContext<V1BatchMessage>): Promise<AgentMessage | null>;
}
