import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1CredentialProtocol } from '../V1CredentialProtocol';
import { V1OfferCredentialMessage } from '../messages';
export declare class V1OfferCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V1OfferCredentialMessage)[];
    constructor(credentialProtocol: V1CredentialProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1OfferCredentialHandler>): Promise<import("@credo-ts/didcomm").OutboundMessageContext<import("@credo-ts/didcomm").AgentMessage> | undefined>;
    private acceptOffer;
}
