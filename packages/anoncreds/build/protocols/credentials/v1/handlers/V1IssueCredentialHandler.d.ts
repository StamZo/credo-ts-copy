import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1CredentialProtocol } from '../V1CredentialProtocol';
import { V1IssueCredentialMessage } from '../messages';
export declare class V1IssueCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V1IssueCredentialMessage)[];
    constructor(credentialProtocol: V1CredentialProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1IssueCredentialHandler>): Promise<import("@credo-ts/didcomm").OutboundMessageContext<import("@credo-ts/didcomm").AgentMessage> | undefined>;
    private acceptCredential;
}
