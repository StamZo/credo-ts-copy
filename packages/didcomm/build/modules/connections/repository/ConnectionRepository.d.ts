import type { AgentContext } from '@credo-ts/core';
import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { DidExchangeRole } from '../models';
import { ConnectionRecord } from './ConnectionRecord';
export declare class ConnectionRepository extends Repository<ConnectionRecord> {
    constructor(storageService: StorageService<ConnectionRecord>, eventEmitter: EventEmitter);
    findByDids(agentContext: AgentContext, { ourDid, theirDid }: {
        ourDid: string;
        theirDid: string;
    }): Promise<ConnectionRecord | null>;
    getByThreadId(agentContext: AgentContext, threadId: string): Promise<ConnectionRecord>;
    getByRoleAndThreadId(agentContext: AgentContext, role: DidExchangeRole, threadId: string): Promise<ConnectionRecord>;
}
