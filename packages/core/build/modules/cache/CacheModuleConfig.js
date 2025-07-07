"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModuleConfig = void 0;
class CacheModuleConfig {
    constructor(options) {
        this.options = options;
    }
    /** See {@link CacheModuleConfigOptions.cache} */
    get cache() {
        return this.options.cache;
    }
    /** See {@link CacheModuleConfigOptions.defaultExpiryInSeconds} */
    get defaultExpiryInSeconds() {
        return this.options.defaultExpiryInSeconds ?? 60;
    }
    /** See {@link CacheModuleConfigOptions.useCachedStorageService} */
    get useCachedStorageService() {
        return this.options.useCachedStorageService ?? false;
    }
}
exports.CacheModuleConfig = CacheModuleConfig;
//# sourceMappingURL=CacheModuleConfig.js.map