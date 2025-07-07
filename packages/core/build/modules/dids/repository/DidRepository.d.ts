import type { AgentContext } from '../../../agent';
import type { DidDocument } from '../domain';
import type { CustomDidTags } from './DidRecord';
import { EventEmitter } from '../../../agent/EventEmitter';
import { Repository } from '../../../storage/Repository';
import { StorageService } from '../../../storage/StorageService';
import { PublicJwk } from '../../kms';
import { DidDocumentKey } from '../DidsApiOptions';
import { DidRecord } from './DidRecord';
export declare class DidRepository extends Repository<DidRecord> {
    constructor(storageService: StorageService<DidRecord>, eventEmitter: EventEmitter);
    /**
     * Finds a {@link DidRecord}, containing the specified recipientKey that was received by this agent.
     * To find a {@link DidRecord} that was created by this agent, use {@link DidRepository.findCreatedDidByRecipientKey}.
     */
    findReceivedDidByRecipientKey(agentContext: AgentContext, recipientKey: PublicJwk): Promise<DidRecord | null>;
    /**
     * Finds a {@link DidRecord}, containing the specified recipientKey that was created by this agent.
     * To find a {@link DidRecord} that was received by this agent, use {@link DidRepository.findReceivedDidByRecipientKey}.
     */
    findCreatedDidByRecipientKey(agentContext: AgentContext, recipientKey: PublicJwk): Promise<DidRecord | null>;
    findAllByRecipientKey(agentContext: AgentContext, recipientKey: PublicJwk): Promise<DidRecord[]>;
    findAllByDid(agentContext: AgentContext, did: string): Promise<DidRecord[]>;
    findReceivedDid(agentContext: AgentContext, receivedDid: string): Promise<DidRecord | null>;
    findCreatedDid(agentContext: AgentContext, createdDid: string): Promise<DidRecord | null>;
    getCreatedDids(agentContext: AgentContext, { method, did }: {
        method?: string;
        did?: string;
    }): Promise<DidRecord[]>;
    storeCreatedDid(agentContext: AgentContext, { did, didDocument, tags, keys }: StoreDidOptions & {
        keys?: DidDocumentKey[];
    }): Promise<DidRecord>;
    storeReceivedDid(agentContext: AgentContext, { did, didDocument, tags }: StoreDidOptions): Promise<DidRecord>;
}
interface StoreDidOptions {
    did: string;
    didDocument?: DidDocument;
    tags?: CustomDidTags;
    keys?: DidDocumentKey[];
}
export {};
