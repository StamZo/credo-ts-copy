import type { AgentContext, Kms } from '@credo-ts/core';
import type { AgentMessage } from '../AgentMessage';
import type { MessageHandler } from '../handlers';
import type { ConnectionRecord } from '../modules/connections/repository';
import type { EncryptedMessage } from '../types';
import type { OutboundMessageContext } from './OutboundMessageContext';
export interface MessageContextParams {
    connection?: ConnectionRecord;
    sessionId?: string;
    senderKey?: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    recipientKey?: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    agentContext: AgentContext;
    receivedAt?: Date;
    encryptedMessage?: EncryptedMessage;
}
export declare class InboundMessageContext<T extends AgentMessage = AgentMessage> {
    connection?: ConnectionRecord;
    sessionId?: string;
    senderKey?: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    recipientKey?: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    receivedAt: Date;
    readonly agentContext: AgentContext;
    message: T;
    messageHandler?: MessageHandler;
    responseMessage?: OutboundMessageContext;
    encryptedMessage?: EncryptedMessage;
    constructor(message: T, context: MessageContextParams);
    setMessageHandler(messageHandler: MessageHandler): void;
    setResponseMessage(outboundMessageContext: OutboundMessageContext): void;
    /**
     * Assert the inbound message has a ready connection associated with it.
     *
     * @throws {CredoError} if there is no connection or the connection is not ready
     */
    assertReadyConnection(): ConnectionRecord;
    toJSON(): {
        message: T;
        recipientKey: string | undefined;
        senderKey: string | undefined;
        sessionId: string | undefined;
        agentContext: {
            contextCorrelationId: string;
        };
    };
}
