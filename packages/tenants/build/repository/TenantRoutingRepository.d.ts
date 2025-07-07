import type { AgentContext, Kms } from '@credo-ts/core';
import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { TenantRoutingRecord } from './TenantRoutingRecord';
export declare class TenantRoutingRepository extends Repository<TenantRoutingRecord> {
    constructor(storageService: StorageService<TenantRoutingRecord>, eventEmitter: EventEmitter);
    findByRecipientKey(agentContext: AgentContext, publicJwk: Kms.PublicJwk): Promise<TenantRoutingRecord | null>;
}
