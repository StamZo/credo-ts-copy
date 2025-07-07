import type { MessageHandler } from '../../../handlers';
import type { InboundMessageContext } from '../../../models';
import type { OutOfBandService } from '../OutOfBandService';
import { OutboundMessageContext } from '../../../models';
import { HandshakeReuseMessage } from '../messages/HandshakeReuseMessage';
export declare class HandshakeReuseHandler implements MessageHandler {
    supportedMessages: (typeof HandshakeReuseMessage)[];
    private outOfBandService;
    constructor(outOfBandService: OutOfBandService);
    handle(messageContext: InboundMessageContext<HandshakeReuseMessage>): Promise<OutboundMessageContext<import("..").HandshakeReuseAcceptedMessage>>;
}
