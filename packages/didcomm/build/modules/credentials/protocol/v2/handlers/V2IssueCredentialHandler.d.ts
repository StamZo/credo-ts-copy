import type { MessageHandler } from '../../../../../handlers';
import type { InboundMessageContext } from '../../../../../models';
import type { V2CredentialProtocol } from '../V2CredentialProtocol';
import { V2IssueCredentialMessage } from '../messages/V2IssueCredentialMessage';
export declare class V2IssueCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V2IssueCredentialMessage)[];
    constructor(credentialProtocol: V2CredentialProtocol);
    handle(messageContext: InboundMessageContext<V2IssueCredentialMessage>): Promise<import("../../../../../models").OutboundMessageContext<import("../../../../..").AgentMessage> | undefined>;
    private acceptCredential;
}
