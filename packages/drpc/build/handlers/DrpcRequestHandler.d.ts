import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { DrpcService } from '../services/DrpcService';
import { DrpcRequestMessage } from '../messages';
export declare class DrpcRequestHandler implements MessageHandler {
    private drpcMessageService;
    supportedMessages: (typeof DrpcRequestMessage)[];
    constructor(drpcMessageService: DrpcService);
    handle(messageContext: MessageHandlerInboundMessage<DrpcRequestHandler>): Promise<undefined>;
}
