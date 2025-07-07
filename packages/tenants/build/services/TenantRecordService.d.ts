import type { AgentContext, Kms, Query, QueryOptions } from '@credo-ts/core';
import type { TenantConfig } from '../models/TenantConfig';
import { TenantRecord, TenantRepository, TenantRoutingRecord, TenantRoutingRepository } from '../repository';
export declare class TenantRecordService {
    private tenantRepository;
    private tenantRoutingRepository;
    constructor(tenantRepository: TenantRepository, tenantRoutingRepository: TenantRoutingRepository);
    createTenant(agentContext: AgentContext, config: TenantConfig): Promise<TenantRecord>;
    getTenantById(agentContext: AgentContext, tenantId: string): Promise<TenantRecord>;
    findTenantsByLabel(agentContext: AgentContext, label: string): Promise<TenantRecord[]>;
    getAllTenants(agentContext: AgentContext): Promise<TenantRecord[]>;
    deleteTenantById(agentContext: AgentContext, tenantId: string): Promise<void>;
    updateTenant(agentContext: AgentContext, tenantRecord: TenantRecord): Promise<void>;
    findTenantsByQuery(agentContext: AgentContext, query: Query<TenantRecord>, queryOptions?: QueryOptions): Promise<TenantRecord[]>;
    findTenantRoutingRecordByRecipientKey(agentContext: AgentContext, recipientKey: Kms.PublicJwk): Promise<TenantRoutingRecord | null>;
    addTenantRoutingRecord(agentContext: AgentContext, tenantId: string, recipientKey: Kms.PublicJwk): Promise<TenantRoutingRecord>;
}
