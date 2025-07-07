import type { MessageHandler, MessageHandlerInboundMessage } from '../../../../../handlers';
import type { RevocationNotificationService } from '../services';
import { V2RevocationNotificationMessage } from '../messages/V2RevocationNotificationMessage';
export declare class V2RevocationNotificationHandler implements MessageHandler {
    private revocationService;
    supportedMessages: (typeof V2RevocationNotificationMessage)[];
    constructor(revocationService: RevocationNotificationService);
    handle(messageContext: MessageHandlerInboundMessage<V2RevocationNotificationHandler>): Promise<undefined>;
}
