import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { ConnectionService } from '../services';
import { ConnectionProblemReportMessage } from '../messages';
export declare class ConnectionProblemReportHandler implements MessageHandler {
    private connectionService;
    supportedMessages: (typeof ConnectionProblemReportMessage)[];
    constructor(connectionService: ConnectionService);
    handle(messageContext: MessageHandlerInboundMessage<ConnectionProblemReportHandler>): Promise<undefined>;
}
