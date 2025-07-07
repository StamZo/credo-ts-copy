"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofsModule = void 0;
const FeatureRegistry_1 = require("../../FeatureRegistry");
const MessageHandlerRegistry_1 = require("../../MessageHandlerRegistry");
const ProofsApi_1 = require("./ProofsApi");
const ProofsModuleConfig_1 = require("./ProofsModuleConfig");
const protocol_1 = require("./protocol");
const repository_1 = require("./repository");
class ProofsModule {
    constructor(config) {
        this.api = ProofsApi_1.ProofsApi;
        this.config = new ProofsModuleConfig_1.ProofsModuleConfig({
            ...config,
            // NOTE: the proofProtocols defaults are set in the ProofsModule rather than the ProofsModuleConfig to
            // avoid dependency cycles.
            proofProtocols: config?.proofProtocols ?? [new protocol_1.V2ProofProtocol({ proofFormats: [] })],
        });
    }
    /**
     * Registers the dependencies of the proofs module on the dependency manager.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(ProofsModuleConfig_1.ProofsModuleConfig, this.config);
        // Repositories
        dependencyManager.registerSingleton(repository_1.ProofRepository);
    }
    async initialize(agentContext) {
        const messageHandlerRegistry = agentContext.dependencyManager.resolve(MessageHandlerRegistry_1.MessageHandlerRegistry);
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        for (const proofProtocol of this.config.proofProtocols) {
            proofProtocol.register(messageHandlerRegistry, featureRegistry);
        }
    }
}
exports.ProofsModule = ProofsModule;
//# sourceMappingURL=ProofsModule.js.map