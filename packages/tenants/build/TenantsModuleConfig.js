"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsModuleConfig = void 0;
class TenantsModuleConfig {
    constructor(options) {
        this.options = options ?? {};
    }
    /** See {@link TenantsModuleConfigOptions.sessionLimit} */
    get sessionLimit() {
        return this.options.sessionLimit ?? 100;
    }
    /** See {@link TenantsModuleConfigOptions.sessionAcquireTimeout} */
    get sessionAcquireTimeout() {
        return this.options.sessionAcquireTimeout ?? 1000;
    }
}
exports.TenantsModuleConfig = TenantsModuleConfig;
//# sourceMappingURL=TenantsModuleConfig.js.map