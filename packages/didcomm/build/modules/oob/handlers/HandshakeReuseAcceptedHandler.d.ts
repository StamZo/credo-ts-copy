import type { MessageHandler } from '../../../handlers';
import type { InboundMessageContext } from '../../../models';
import type { OutOfBandService } from '../OutOfBandService';
import { HandshakeReuseAcceptedMessage } from '../messages/HandshakeReuseAcceptedMessage';
export declare class HandshakeReuseAcceptedHandler implements MessageHandler {
    supportedMessages: (typeof HandshakeReuseAcceptedMessage)[];
    private outOfBandService;
    constructor(outOfBandService: OutOfBandService);
    handle(messageContext: InboundMessageContext<HandshakeReuseAcceptedMessage>): Promise<undefined>;
}
