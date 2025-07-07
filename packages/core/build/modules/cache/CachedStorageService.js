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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedStorageService = void 0;
const constants_1 = require("../../constants");
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const CacheModuleConfig_1 = require("./CacheModuleConfig");
let CachedStorageService = class CachedStorageService {
    constructor(storageService) {
        this.storageService = storageService;
    }
    cache(agentContext) {
        return agentContext.resolve(CacheModuleConfig_1.CacheModuleConfig).cache;
    }
    getCacheKey(options) {
        return `${options.type}:${options.id}`;
    }
    async save(agentContext, record) {
        if (record.allowCache) {
            await this.cache(agentContext).set(agentContext, this.getCacheKey(record), record.toJSON());
        }
        return await this.storageService.save(agentContext, record);
    }
    async update(agentContext, record) {
        if (record.allowCache) {
            await this.cache(agentContext).set(agentContext, this.getCacheKey(record), record.toJSON());
        }
        return await this.storageService.update(agentContext, record);
    }
    async delete(agentContext, record) {
        if (record.allowCache) {
            await this.cache(agentContext).remove(agentContext, this.getCacheKey(record));
        }
        return await this.storageService.delete(agentContext, record);
    }
    async deleteById(agentContext, recordClass, id) {
        if (recordClass.allowCache) {
            await this.cache(agentContext).remove(agentContext, this.getCacheKey({ ...recordClass, id }));
        }
        return await this.storageService.deleteById(agentContext, recordClass, id);
    }
    async getById(agentContext, recordClass, id) {
        if (recordClass.allowCache) {
            const cachedValue = await this.cache(agentContext).get(agentContext, this.getCacheKey({ type: recordClass.type, id }));
            if (cachedValue)
                return utils_1.JsonTransformer.fromJSON(cachedValue, recordClass);
        }
        const record = await this.storageService.getById(agentContext, recordClass, id);
        if (recordClass.allowCache) {
            await this.cache(agentContext).set(agentContext, this.getCacheKey({ type: recordClass.type, id }), record.toJSON());
        }
        return record;
    }
    // TODO: not in caching interface, yet
    async getAll(agentContext, recordClass) {
        return await this.storageService.getAll(agentContext, recordClass);
    }
    // TODO: not in caching interface, yet
    async findByQuery(agentContext, recordClass, query, queryOptions) {
        return await this.storageService.findByQuery(agentContext, recordClass, query, queryOptions);
    }
};
exports.CachedStorageService = CachedStorageService;
exports.CachedStorageService = CachedStorageService = __decorate([
    (0, plugins_1.injectable)()
    // biome-ignore lint/suspicious/noExplicitAny:
    ,
    __param(0, (0, plugins_1.inject)(constants_1.InjectionSymbols.StorageService)),
    __metadata("design:paramtypes", [Object])
], CachedStorageService);
//# sourceMappingURL=CachedStorageService.js.map