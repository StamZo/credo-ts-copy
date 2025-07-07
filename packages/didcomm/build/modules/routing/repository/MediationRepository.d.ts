import type { AgentContext } from '@credo-ts/core';
import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { MediationRecord } from './MediationRecord';
export declare class MediationRepository extends Repository<MediationRecord> {
    constructor(storageService: StorageService<MediationRecord>, eventEmitter: EventEmitter);
    getSingleByRecipientKey(agentContext: AgentContext, recipientKey: string): Promise<MediationRecord>;
    getByConnectionId(agentContext: AgentContext, connectionId: string): Promise<MediationRecord>;
}
