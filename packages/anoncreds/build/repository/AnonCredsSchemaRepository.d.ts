import type { AgentContext } from '@credo-ts/core';
import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { AnonCredsSchemaRecord } from './AnonCredsSchemaRecord';
export declare class AnonCredsSchemaRepository extends Repository<AnonCredsSchemaRecord> {
    constructor(storageService: StorageService<AnonCredsSchemaRecord>, eventEmitter: EventEmitter);
    getBySchemaId(agentContext: AgentContext, schemaId: string): Promise<AnonCredsSchemaRecord>;
    findBySchemaId(agentContext: AgentContext, schemaId: string): Promise<AnonCredsSchemaRecord | null>;
}
