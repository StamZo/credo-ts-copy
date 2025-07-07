import type { AgentContext } from '@credo-ts/core';
import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { AnonCredsKeyCorrectnessProofRecord } from './AnonCredsKeyCorrectnessProofRecord';
export declare class AnonCredsKeyCorrectnessProofRepository extends Repository<AnonCredsKeyCorrectnessProofRecord> {
    constructor(storageService: StorageService<AnonCredsKeyCorrectnessProofRecord>, eventEmitter: EventEmitter);
    getByCredentialDefinitionId(agentContext: AgentContext, credentialDefinitionId: string): Promise<AnonCredsKeyCorrectnessProofRecord>;
    findByCredentialDefinitionId(agentContext: AgentContext, credentialDefinitionId: string): Promise<AnonCredsKeyCorrectnessProofRecord | null>;
}
