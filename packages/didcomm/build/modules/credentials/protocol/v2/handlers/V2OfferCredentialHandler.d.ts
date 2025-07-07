import type { MessageHandler } from '../../../../../handlers';
import type { InboundMessageContext } from '../../../../../models';
import type { V2CredentialProtocol } from '../V2CredentialProtocol';
import { V2OfferCredentialMessage } from '../messages/V2OfferCredentialMessage';
export declare class V2OfferCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V2OfferCredentialMessage)[];
    constructor(credentialProtocol: V2CredentialProtocol);
    handle(messageContext: InboundMessageContext<V2OfferCredentialMessage>): Promise<import("../../../../../models").OutboundMessageContext<import("../../../../..").AgentMessage> | undefined>;
    private acceptOffer;
}
