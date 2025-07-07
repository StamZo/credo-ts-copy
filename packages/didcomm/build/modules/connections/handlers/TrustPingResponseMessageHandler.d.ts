import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { TrustPingService } from '../services';
import { TrustPingResponseMessage } from '../messages';
export declare class TrustPingResponseMessageHandler implements MessageHandler {
    private trustPingService;
    supportedMessages: (typeof TrustPingResponseMessage)[];
    constructor(trustPingService: TrustPingService);
    handle(inboundMessage: MessageHandlerInboundMessage<TrustPingResponseMessageHandler>): Promise<undefined>;
}
