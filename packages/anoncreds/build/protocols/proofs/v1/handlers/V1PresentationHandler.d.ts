import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1ProofProtocol } from '../V1ProofProtocol';
import { V1PresentationMessage } from '../messages';
export declare class V1PresentationHandler implements MessageHandler {
    private proofProtocol;
    supportedMessages: (typeof V1PresentationMessage)[];
    constructor(proofProtocol: V1ProofProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1PresentationHandler>): Promise<import("@credo-ts/didcomm").OutboundMessageContext<import("@credo-ts/didcomm").AgentMessage> | undefined>;
    private acceptPresentation;
}
