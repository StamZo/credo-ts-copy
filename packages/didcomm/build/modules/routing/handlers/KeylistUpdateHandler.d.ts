import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { MediatorService } from '../services/MediatorService';
import { OutboundMessageContext } from '../../../models';
import { KeylistUpdateMessage } from '../messages';
export declare class KeylistUpdateHandler implements MessageHandler {
    private mediatorService;
    supportedMessages: (typeof KeylistUpdateMessage)[];
    constructor(mediatorService: MediatorService);
    handle(messageContext: MessageHandlerInboundMessage<KeylistUpdateHandler>): Promise<OutboundMessageContext<import("../messages").KeylistUpdateResponseMessage>>;
}
