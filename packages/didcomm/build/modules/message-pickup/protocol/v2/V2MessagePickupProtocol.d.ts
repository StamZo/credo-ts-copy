import type { AgentContext } from '@credo-ts/core';
import type { AgentMessage } from '../../../../AgentMessage';
import type { FeatureRegistry } from '../../../../FeatureRegistry';
import type { MessageHandlerRegistry } from '../../../../MessageHandlerRegistry';
import type { InboundMessageContext } from '../../../../models';
import type { DeliverMessagesProtocolOptions, DeliverMessagesProtocolReturnType, PickupMessagesProtocolOptions, PickupMessagesProtocolReturnType, SetLiveDeliveryModeProtocolOptions, SetLiveDeliveryModeProtocolReturnType } from '../MessagePickupProtocolOptions';
import { OutboundMessageContext } from '../../../../models';
import { BaseMessagePickupProtocol } from '../BaseMessagePickupProtocol';
import { V2DeliveryRequestMessage, V2LiveDeliveryChangeMessage, V2MessageDeliveryMessage, V2MessagesReceivedMessage, V2StatusMessage, V2StatusRequestMessage } from './messages';
export declare class V2MessagePickupProtocol extends BaseMessagePickupProtocol {
    /**
     * The version of the message pickup protocol this class supports
     */
    readonly version: "v2";
    /**
     * Registers the protocol implementation (handlers, feature registry) on the agent.
     */
    register(messageHandlerRegistry: MessageHandlerRegistry, featureRegistry: FeatureRegistry): void;
    createPickupMessage(_agentContext: AgentContext, options: PickupMessagesProtocolOptions): Promise<PickupMessagesProtocolReturnType<AgentMessage>>;
    createDeliveryMessage(agentContext: AgentContext, options: DeliverMessagesProtocolOptions): Promise<DeliverMessagesProtocolReturnType<AgentMessage> | undefined>;
    setLiveDeliveryMode(_agentContext: AgentContext, options: SetLiveDeliveryModeProtocolOptions): Promise<SetLiveDeliveryModeProtocolReturnType<AgentMessage>>;
    processStatusRequest(messageContext: InboundMessageContext<V2StatusRequestMessage>): Promise<OutboundMessageContext<V2StatusMessage>>;
    processDeliveryRequest(messageContext: InboundMessageContext<V2DeliveryRequestMessage>): Promise<OutboundMessageContext<V2MessageDeliveryMessage | V2StatusMessage>>;
    processMessagesReceived(messageContext: InboundMessageContext<V2MessagesReceivedMessage>): Promise<OutboundMessageContext<V2StatusMessage>>;
    processStatus(messageContext: InboundMessageContext<V2StatusMessage>): Promise<V2DeliveryRequestMessage | null>;
    processLiveDeliveryChange(messageContext: InboundMessageContext<V2LiveDeliveryChangeMessage>): Promise<OutboundMessageContext<V2StatusMessage>>;
    processDelivery(messageContext: InboundMessageContext<V2MessageDeliveryMessage>): Promise<V2MessagesReceivedMessage>;
}
