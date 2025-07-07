import type { MessageHandler } from '../../../../../handlers';
import type { InboundMessageContext } from '../../../../../models';
import type { V2CredentialProtocol } from '../V2CredentialProtocol';
import { OutboundMessageContext } from '../../../../../models';
import { V2ProposeCredentialMessage } from '../messages/V2ProposeCredentialMessage';
export declare class V2ProposeCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V2ProposeCredentialMessage)[];
    constructor(credentialProtocol: V2CredentialProtocol);
    handle(messageContext: InboundMessageContext<V2ProposeCredentialMessage>): Promise<OutboundMessageContext<import("..").V2OfferCredentialMessage> | undefined>;
    private acceptProposal;
}
