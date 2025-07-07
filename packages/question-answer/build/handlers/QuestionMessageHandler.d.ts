import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { QuestionAnswerService } from '../services';
import { QuestionMessage } from '../messages';
export declare class QuestionMessageHandler implements MessageHandler {
    private questionAnswerService;
    supportedMessages: (typeof QuestionMessage)[];
    constructor(questionAnswerService: QuestionAnswerService);
    handle(messageContext: MessageHandlerInboundMessage<QuestionMessageHandler>): Promise<undefined>;
}
