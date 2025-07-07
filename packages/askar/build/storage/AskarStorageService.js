"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStorageService = void 0;
const core_1 = require("@credo-ts/core");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const AskarStoreManager_1 = require("../AskarStoreManager");
const askarError_1 = require("../utils/askarError");
const error_1 = require("../error");
const utils_1 = require("./utils");
let AskarStorageService = class AskarStorageService {
    constructor(askarStoreManager) {
        this.askarStoreManager = askarStoreManager;
    }
    withSession(agentContext, callback) {
        return this.askarStoreManager.withSession(agentContext, callback);
    }
    /** @inheritDoc */
    async save(agentContext, record) {
        record.updatedAt = new Date();
        const value = core_1.JsonTransformer.serialize(record);
        const tags = (0, utils_1.transformFromRecordTagValues)(record.getTags());
        try {
            await this.withSession(agentContext, (session) => session.insert({ category: record.type, name: record.id, value, tags }));
        }
        catch (error) {
            if ((0, askarError_1.isAskarError)(error, askarError_1.AskarErrorCode.Duplicate)) {
                throw new core_1.RecordDuplicateError(`Record with id ${record.id} already exists`, { recordType: record.type });
            }
            throw new error_1.AskarError('Error saving record', { cause: error });
        }
    }
    /** @inheritDoc */
    async update(agentContext, record) {
        record.updatedAt = new Date();
        const value = core_1.JsonTransformer.serialize(record);
        const tags = (0, utils_1.transformFromRecordTagValues)(record.getTags());
        try {
            await this.withSession(agentContext, (session) => session.replace({ category: record.type, name: record.id, value, tags }));
        }
        catch (error) {
            if ((0, askarError_1.isAskarError)(error, askarError_1.AskarErrorCode.NotFound)) {
                throw new core_1.RecordNotFoundError(`record with id ${record.id} not found.`, {
                    recordType: record.type,
                    cause: error,
                });
            }
            throw new error_1.AskarError('Error updating record', { cause: error });
        }
    }
    /** @inheritDoc */
    async delete(agentContext, record) {
        try {
            await this.withSession(agentContext, (session) => session.remove({ category: record.type, name: record.id }));
        }
        catch (error) {
            if ((0, askarError_1.isAskarError)(error, askarError_1.AskarErrorCode.NotFound)) {
                throw new core_1.RecordNotFoundError(`record with id ${record.id} not found.`, {
                    recordType: record.type,
                    cause: error,
                });
            }
            throw new error_1.AskarError('Error deleting record', { cause: error });
        }
    }
    /** @inheritDoc */
    async deleteById(agentContext, recordClass, id) {
        try {
            await this.withSession(agentContext, (session) => session.remove({ category: recordClass.type, name: id }));
        }
        catch (error) {
            if ((0, askarError_1.isAskarError)(error, askarError_1.AskarErrorCode.NotFound)) {
                throw new core_1.RecordNotFoundError(`record with id ${id} not found.`, {
                    recordType: recordClass.type,
                    cause: error,
                });
            }
            throw new error_1.AskarError('Error deleting record', { cause: error });
        }
    }
    /** @inheritDoc */
    async getById(agentContext, recordClass, id) {
        try {
            const record = await this.withSession(agentContext, (session) => session.fetch({ category: recordClass.type, name: id }));
            if (!record) {
                throw new core_1.RecordNotFoundError(`record with id ${id} not found.`, {
                    recordType: recordClass.type,
                });
            }
            return (0, utils_1.recordToInstance)(record, recordClass);
        }
        catch (error) {
            if (error instanceof core_1.RecordNotFoundError)
                throw error;
            throw new error_1.AskarError(`Error getting record ${recordClass.name}`, { cause: error });
        }
    }
    /** @inheritDoc */
    async getAll(agentContext, recordClass) {
        const records = await this.withSession(agentContext, (session) => session.fetchAll({ category: recordClass.type }));
        const instances = [];
        for (const record of records) {
            instances.push((0, utils_1.recordToInstance)(record, recordClass));
        }
        return instances;
    }
    /** @inheritDoc */
    async findByQuery(agentContext, recordClass, query, queryOptions) {
        const askarQuery = (0, utils_1.askarQueryFromSearchQuery)(query);
        const { store, profile } = await this.askarStoreManager.getInitializedStoreWithProfile(agentContext);
        const scan = new askar_shared_1.Scan({
            category: recordClass.type,
            store,
            tagFilter: askarQuery,
            profile,
            offset: queryOptions?.offset,
            limit: queryOptions?.limit,
        });
        const instances = [];
        try {
            const records = await scan.fetchAll();
            for (const record of records) {
                instances.push((0, utils_1.recordToInstance)(record, recordClass));
            }
            return instances;
        }
        catch (error) {
            throw new error_1.AskarError(`Error executing query. ${error.message}`, { cause: error });
        }
    }
};
exports.AskarStorageService = AskarStorageService;
exports.AskarStorageService = AskarStorageService = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [AskarStoreManager_1.AskarStoreManager])
], AskarStorageService);
//# sourceMappingURL=AskarStorageService.js.map