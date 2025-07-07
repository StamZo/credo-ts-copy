import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { ConnectionService, DidRotateService } from '../services';
import { DidRotateMessage } from '../messages';
export declare class DidRotateHandler implements MessageHandler {
    private didRotateService;
    private connectionService;
    supportedMessages: (typeof DidRotateMessage)[];
    constructor(didRotateService: DidRotateService, connectionService: ConnectionService);
    handle(messageContext: MessageHandlerInboundMessage<DidRotateHandler>): Promise<import("../../..").OutboundMessageContext<import("../messages").DidRotateProblemReportMessage> | import("../../..").OutboundMessageContext<import("../messages").DidRotateAckMessage>>;
}
