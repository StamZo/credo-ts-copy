"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const error_1 = require("../error");
const CacheModuleConfig_1 = require("../modules/cache/CacheModuleConfig");
const CachedStorageService_1 = require("../modules/cache/CachedStorageService");
const utils_1 = require("../utils");
const RepositoryEvents_1 = require("./RepositoryEvents");
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
class Repository {
    constructor(recordClass, storageService, eventEmitter) {
        this.recordClass = recordClass;
        this.storageService = storageService;
        this.eventEmitter = eventEmitter;
    }
    getStorageService(agentContext) {
        try {
            if (agentContext.dependencyManager.isRegistered(CachedStorageService_1.CachedStorageService, true)) {
                return agentContext.resolve((CachedStorageService_1.CachedStorageService));
            }
            return this.storageService;
        }
        catch {
            return this.storageService;
        }
    }
    /** @inheritDoc {StorageService#save} */
    async save(agentContext, record) {
        await this.getStorageService(agentContext).save(agentContext, record);
        this.eventEmitter.emit(agentContext, {
            type: RepositoryEvents_1.RepositoryEventTypes.RecordSaved,
            payload: {
                // Record in event should be static
                record: record.clone(),
            },
        });
    }
    /** @inheritDoc {StorageService#update} */
    async update(agentContext, record) {
        await this.getStorageService(agentContext).update(agentContext, record);
        this.eventEmitter.emit(agentContext, {
            type: RepositoryEvents_1.RepositoryEventTypes.RecordUpdated,
            payload: {
                // Record in event should be static
                record: record.clone(),
            },
        });
    }
    /** @inheritDoc {StorageService#delete} */
    async delete(agentContext, record) {
        await this.getStorageService(agentContext).delete(agentContext, record);
        this.eventEmitter.emit(agentContext, {
            type: RepositoryEvents_1.RepositoryEventTypes.RecordDeleted,
            payload: {
                // Record in event should be static
                record: record.clone(),
            },
        });
    }
    /**
     * Delete record by id. Throws {RecordNotFoundError} if no record is found
     * @param id the id of the record to delete
     * @returns
     */
    async deleteById(agentContext, id) {
        await this.getStorageService(agentContext).deleteById(agentContext, this.recordClass, id);
        this.eventEmitter.emit(agentContext, {
            type: RepositoryEvents_1.RepositoryEventTypes.RecordDeleted,
            payload: {
                record: { id, type: this.recordClass.type },
            },
        });
    }
    /** @inheritDoc {StorageService#getById} */
    async getById(agentContext, id) {
        return this.getStorageService(agentContext).getById(agentContext, this.recordClass, id);
    }
    /**
     * Find record by id. Returns null if no record is found
     * @param id the id of the record to retrieve
     * @returns
     */
    async findById(agentContext, id) {
        try {
            return await this.getStorageService(agentContext).getById(agentContext, this.recordClass, id);
        }
        catch (error) {
            if (error instanceof error_1.RecordNotFoundError)
                return null;
            throw error;
        }
    }
    /** @inheritDoc {StorageService#getAll} */
    async getAll(agentContext) {
        return this.getStorageService(agentContext).getAll(agentContext, this.recordClass);
    }
    /** @inheritDoc {StorageService#findByQuery} */
    async findByQuery(agentContext, query, queryOptions) {
        return this.getStorageService(agentContext).findByQuery(agentContext, this.recordClass, query, queryOptions);
    }
    /**
     * Find a single record by query. Returns null if not found.
     * @param query the query
     * @param cacheKey optional cache key to use for caching. By default query results are not cached, but if a cache key is provided
     *                  as well as the record allows caching and the agent has a cached storage service enabled it will use the cache.
     * @returns the record, or null if not found
     * @throws {RecordDuplicateError} if multiple records are found for the given query
     */
    async findSingleByQuery(agentContext, query, { cacheKey } = {}) {
        const cache = agentContext.resolve(CacheModuleConfig_1.CacheModuleConfig);
        const useCacheStorage = cache.useCachedStorageService ?? false;
        if (useCacheStorage && cacheKey) {
            const recordId = (await cache?.cache.get(agentContext, cacheKey)) ?? null;
            if (recordId !== null) {
                const recordJson = await cache?.cache.get(agentContext, recordId);
                if (recordJson)
                    return utils_1.JsonTransformer.fromJSON(recordJson, this.recordClass);
            }
        }
        const records = await this.findByQuery(agentContext, query);
        if (records.length > 1) {
            throw new error_1.RecordDuplicateError(`Multiple records found for given query '${JSON.stringify(query)}'`, {
                recordType: this.recordClass.type,
            });
        }
        if (records.length < 1) {
            return null;
        }
        if (useCacheStorage && cacheKey) {
            await cache?.cache.set(agentContext, cacheKey, records[0].id);
            await cache?.cache.set(agentContext, records[0].id, records[0].toJSON());
        }
        return records[0];
    }
    /**
     * Find a single record by query. Throws if not found
     * @param query the query
     * @returns the record
     * @throws {RecordDuplicateError} if multiple records are found for the given query
     * @throws {RecordNotFoundError} if no record is found for the given query
     */
    async getSingleByQuery(agentContext, query) {
        const record = await this.findSingleByQuery(agentContext, query);
        if (!record) {
            throw new error_1.RecordNotFoundError(`No record found for given query '${JSON.stringify(query)}'`, {
                recordType: this.recordClass.type,
            });
        }
        return record;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map