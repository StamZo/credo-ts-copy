"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenId4VcHolderModule = void 0;
const core_1 = require("@credo-ts/core");
const oauth2_1 = require("@openid4vc/oauth2");
const OpenId4VcHolderApi_1 = require("./OpenId4VcHolderApi");
const OpenId4VciHolderService_1 = require("./OpenId4VciHolderService");
const OpenId4vpHolderService_1 = require("./OpenId4vpHolderService");
/**
 * @public @module OpenId4VcHolderModule
 * This module provides the functionality to assume the role of owner in relation to the OpenId4VC specification suite.
 */
class OpenId4VcHolderModule {
    constructor() {
        this.api = OpenId4VcHolderApi_1.OpenId4VcHolderApi;
    }
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager) {
        const agentConfig = dependencyManager.resolve(core_1.AgentConfig);
        // Warn about experimental module
        agentConfig.logger.warn("The '@credo-ts/openid4vc' Holder module is experimental and could have unexpected breaking changes. When using this module, make sure to use strict versions for all @credo-ts packages.");
        if (agentConfig.allowInsecureHttpUrls) {
            (0, oauth2_1.setGlobalConfig)({
                allowInsecureUrls: true,
            });
        }
        // Services
        dependencyManager.registerSingleton(OpenId4VciHolderService_1.OpenId4VciHolderService);
        dependencyManager.registerSingleton(OpenId4vpHolderService_1.OpenId4VpHolderService);
    }
}
exports.OpenId4VcHolderModule = OpenId4VcHolderModule;
//# sourceMappingURL=OpenId4VcHolderModule.js.map