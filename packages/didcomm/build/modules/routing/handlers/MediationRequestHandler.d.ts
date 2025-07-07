import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { MediatorModuleConfig } from '../MediatorModuleConfig';
import type { MediatorService } from '../services/MediatorService';
import { OutboundMessageContext } from '../../../models';
import { MediationRequestMessage } from '../messages/MediationRequestMessage';
export declare class MediationRequestHandler implements MessageHandler {
    private mediatorService;
    private mediatorModuleConfig;
    supportedMessages: (typeof MediationRequestMessage)[];
    constructor(mediatorService: MediatorService, mediatorModuleConfig: MediatorModuleConfig);
    handle(messageContext: MessageHandlerInboundMessage<MediationRequestHandler>): Promise<OutboundMessageContext<import("..").MediationGrantMessage> | undefined>;
}
