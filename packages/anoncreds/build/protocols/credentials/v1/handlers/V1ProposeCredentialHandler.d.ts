import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1CredentialProtocol } from '../V1CredentialProtocol';
import { V1ProposeCredentialMessage } from '../messages';
export declare class V1ProposeCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V1ProposeCredentialMessage)[];
    constructor(credentialProtocol: V1CredentialProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1ProposeCredentialHandler>): Promise<import("@credo-ts/didcomm").OutboundMessageContext<import("@credo-ts/didcomm").AgentMessage> | undefined>;
    private acceptProposal;
}
