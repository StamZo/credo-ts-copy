"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementModule = void 0;
const KeyManagementApi_1 = require("./KeyManagementApi");
const KeyManagementModuleConfig_1 = require("./KeyManagementModuleConfig");
class KeyManagementModule {
    constructor(config) {
        this.api = KeyManagementApi_1.KeyManagementApi;
        this.config = new KeyManagementModuleConfig_1.KeyManagementModuleConfig(config);
    }
    /**
     * Registers the dependencies of the key management module.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(KeyManagementModuleConfig_1.KeyManagementModuleConfig, this.config);
    }
}
exports.KeyManagementModule = KeyManagementModule;
//# sourceMappingURL=KeyManagementModule.js.map