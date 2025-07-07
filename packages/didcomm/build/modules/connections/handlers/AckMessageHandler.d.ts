import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { ConnectionService } from '../services';
import { AckMessage } from '../../../messages';
export declare class AckMessageHandler implements MessageHandler {
    private connectionService;
    supportedMessages: (typeof AckMessage)[];
    constructor(connectionService: ConnectionService);
    handle(inboundMessage: MessageHandlerInboundMessage<AckMessageHandler>): Promise<undefined>;
}
