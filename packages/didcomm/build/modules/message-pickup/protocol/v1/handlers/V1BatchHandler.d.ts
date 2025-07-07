import type { MessageHandler, MessageHandlerInboundMessage } from '../../../../../handlers';
import type { V1MessagePickupProtocol } from '../V1MessagePickupProtocol';
import { OutboundMessageContext } from '../../../../../models';
import { V1BatchMessage } from '../messages';
export declare class V1BatchHandler implements MessageHandler {
    supportedMessages: (typeof V1BatchMessage)[];
    private messagePickupProtocol;
    constructor(messagePickupProtocol: V1MessagePickupProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1BatchHandler>): Promise<OutboundMessageContext<import("../../../../..").AgentMessage> | undefined>;
}
