import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { ConnectionService, TrustPingService } from '../services';
import { TrustPingMessage } from '../messages';
export declare class TrustPingMessageHandler implements MessageHandler {
    private trustPingService;
    private connectionService;
    supportedMessages: (typeof TrustPingMessage)[];
    constructor(trustPingService: TrustPingService, connectionService: ConnectionService);
    handle(messageContext: MessageHandlerInboundMessage<TrustPingMessageHandler>): Promise<import("../../..").OutboundMessageContext<import("../messages").TrustPingResponseMessage> | undefined>;
}
