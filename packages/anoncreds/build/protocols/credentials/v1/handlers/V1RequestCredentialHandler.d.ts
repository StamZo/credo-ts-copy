import type { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/didcomm';
import type { V1CredentialProtocol } from '../V1CredentialProtocol';
import { V1RequestCredentialMessage } from '../messages';
export declare class V1RequestCredentialHandler implements MessageHandler {
    private credentialProtocol;
    supportedMessages: (typeof V1RequestCredentialMessage)[];
    constructor(credentialProtocol: V1CredentialProtocol);
    handle(messageContext: MessageHandlerInboundMessage<V1RequestCredentialHandler>): Promise<import("@credo-ts/didcomm").OutboundMessageContext<import("@credo-ts/didcomm").AgentMessage> | undefined>;
    private acceptRequest;
}
