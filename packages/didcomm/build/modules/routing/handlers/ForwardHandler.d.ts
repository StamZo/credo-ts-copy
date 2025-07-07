import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { MediatorService } from '../services';
import { ForwardMessage } from '../messages';
export declare class ForwardHandler implements MessageHandler {
    private mediatorService;
    supportedMessages: (typeof ForwardMessage)[];
    constructor(mediatorService: MediatorService);
    handle(messageContext: MessageHandlerInboundMessage<ForwardHandler>): Promise<undefined>;
}
