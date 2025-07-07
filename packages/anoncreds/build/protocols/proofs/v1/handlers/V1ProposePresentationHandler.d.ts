import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1ProofProtocol } from '../V1ProofProtocol';
import { OutboundMessageContext } from '@credo-ts/didcomm';
import { V1ProposePresentationMessage } from '../messages';
export declare class V1ProposePresentationHandler implements MessageHandler {
    private proofProtocol;
    supportedMessages: (typeof V1ProposePresentationMessage)[];
    constructor(proofProtocol: V1ProofProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1ProposePresentationHandler>): Promise<OutboundMessageContext<import("../messages").V1RequestPresentationMessage> | undefined>;
    private acceptProposal;
}
