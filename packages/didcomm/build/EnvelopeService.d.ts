import { AgentContext, Kms } from '@credo-ts/core';
import type { AgentMessage } from './AgentMessage';
import type { EncryptedMessage, PlaintextMessage } from './types';
import { Logger } from '@credo-ts/core';
import { DidCommDocumentService } from './services/DidCommDocumentService';
export interface EnvelopeKeys {
    recipientKeys: Kms.PublicJwk<Kms.Ed25519PublicJwk>[];
    routingKeys: Kms.PublicJwk<Kms.Ed25519PublicJwk>[];
    senderKey: Kms.PublicJwk<Kms.Ed25519PublicJwk> | null;
}
export declare class EnvelopeService {
    private logger;
    private didcommDocumentService;
    constructor(logger: Logger, didcommDocumentService: DidCommDocumentService);
    private encryptDidcommV1Message;
    private decryptDidcommV1Message;
    packMessage(agentContext: AgentContext, payload: AgentMessage, keys: EnvelopeKeys): Promise<EncryptedMessage>;
    unpackMessage(agentContext: AgentContext, encryptedMessage: EncryptedMessage): Promise<DecryptedMessageContext>;
    private extractOurRecipientKeyWithKeyId;
}
export interface DecryptedMessageContext {
    plaintextMessage: PlaintextMessage;
    senderKey?: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    recipientKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
}
