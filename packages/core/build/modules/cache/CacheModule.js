"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const CachedStorageService_1 = require("./CachedStorageService");
const CacheModuleConfig_1 = require("./CacheModuleConfig");
const SingleContextLruCacheRepository_1 = require("./singleContextLruCache/SingleContextLruCacheRepository");
const SingleContextStorageLruCache_1 = require("./singleContextLruCache/SingleContextStorageLruCache");
class CacheModule {
    constructor(config) {
        this.config = new CacheModuleConfig_1.CacheModuleConfig(config);
    }
    register(dependencyManager) {
        dependencyManager.registerInstance(CacheModuleConfig_1.CacheModuleConfig, this.config);
        // Allows us to use the `CachedStorageService` instead of the `StorageService`
        // This first checks the local cache to return a record
        if (this.config.useCachedStorageService) {
            dependencyManager.registerSingleton(CachedStorageService_1.CachedStorageService);
        }
        // Custom handling for when we're using the SingleContextStorageLruCache
        if (this.config.cache instanceof SingleContextStorageLruCache_1.SingleContextStorageLruCache) {
            dependencyManager.registerSingleton(SingleContextLruCacheRepository_1.SingleContextLruCacheRepository);
        }
    }
}
exports.CacheModule = CacheModule;
//# sourceMappingURL=CacheModule.js.map