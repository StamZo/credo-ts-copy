import type { MessageHandler } from '../../../../../handlers';
import type { InboundMessageContext } from '../../../../../models';
import type { V2MessagePickupProtocol } from '../V2MessagePickupProtocol';
import { V2MessagesReceivedMessage } from '../messages';
export declare class V2MessagesReceivedHandler implements MessageHandler {
    supportedMessages: (typeof V2MessagesReceivedMessage)[];
    private messagePickupService;
    constructor(messagePickupService: V2MessagePickupProtocol);
    handle(messageContext: InboundMessageContext<V2MessagesReceivedMessage>): Promise<import("../../../../../models").OutboundMessageContext<import("../messages").V2StatusMessage>>;
}
