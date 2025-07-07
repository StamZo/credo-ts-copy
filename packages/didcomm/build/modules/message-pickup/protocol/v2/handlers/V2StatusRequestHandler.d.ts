import type { MessageHandler } from '../../../../../handlers';
import type { InboundMessageContext } from '../../../../../models';
import type { V2MessagePickupProtocol } from '../V2MessagePickupProtocol';
import { V2StatusRequestMessage } from '../messages';
export declare class V2StatusRequestHandler implements MessageHandler {
    supportedMessages: (typeof V2StatusRequestMessage)[];
    private messagePickupService;
    constructor(messagePickupService: V2MessagePickupProtocol);
    handle(messageContext: InboundMessageContext<V2StatusRequestMessage>): Promise<import("../../../../../models").OutboundMessageContext<import("../messages").V2StatusMessage>>;
}
