import { AgentContext } from '../../agent';
import { BaseRecord } from '../../storage/BaseRecord';
import { BaseRecordConstructor, Query, QueryOptions, StorageService } from '../../storage/StorageService';
export declare class CachedStorageService<T extends BaseRecord<any, any, any>> implements StorageService<T> {
    private storageService;
    constructor(storageService: StorageService<T>);
    private cache;
    private getCacheKey;
    save(agentContext: AgentContext, record: T): Promise<void>;
    update(agentContext: AgentContext, record: T): Promise<void>;
    delete(agentContext: AgentContext, record: T): Promise<void>;
    deleteById(agentContext: AgentContext, recordClass: BaseRecordConstructor<T>, id: string): Promise<void>;
    getById(agentContext: AgentContext, recordClass: BaseRecordConstructor<T>, id: string): Promise<T>;
    getAll(agentContext: AgentContext, recordClass: BaseRecordConstructor<T>): Promise<T[]>;
    findByQuery(agentContext: AgentContext, recordClass: BaseRecordConstructor<T>, query: Query<T>, queryOptions?: QueryOptions): Promise<T[]>;
}
