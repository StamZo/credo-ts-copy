import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { OutOfBandService } from '../../oob/OutOfBandService';
import type { DidExchangeProtocol } from '../DidExchangeProtocol';
import { DidExchangeCompleteMessage } from '../messages';
export declare class DidExchangeCompleteHandler implements MessageHandler {
    private didExchangeProtocol;
    private outOfBandService;
    supportedMessages: (typeof DidExchangeCompleteMessage)[];
    constructor(didExchangeProtocol: DidExchangeProtocol, outOfBandService: OutOfBandService);
    handle(messageContext: MessageHandlerInboundMessage<DidExchangeCompleteHandler>): Promise<undefined>;
}
