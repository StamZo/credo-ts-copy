"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePickupModule = void 0;
const FeatureRegistry_1 = require("../../FeatureRegistry");
const MessageHandlerRegistry_1 = require("../../MessageHandlerRegistry");
const MessagePickupApi_1 = require("./MessagePickupApi");
const MessagePickupModuleConfig_1 = require("./MessagePickupModuleConfig");
const protocol_1 = require("./protocol");
const services_1 = require("./services");
class MessagePickupModule {
    constructor(config) {
        // Infer Api type from the config
        this.api = MessagePickupApi_1.MessagePickupApi;
        this.config = new MessagePickupModuleConfig_1.MessagePickupModuleConfig({
            ...config,
            protocols: config?.protocols ?? [new protocol_1.V1MessagePickupProtocol(), new protocol_1.V2MessagePickupProtocol()],
        });
    }
    /**
     * Registers the dependencies of the message pickup answer module on the dependency manager.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(MessagePickupModuleConfig_1.MessagePickupModuleConfig, this.config);
        // Services
        dependencyManager.registerSingleton(services_1.MessagePickupSessionService);
    }
    async initialize(agentContext) {
        // Protocol needs to register feature registry items and handlers
        const messageHandlerRegistry = agentContext.dependencyManager.resolve(MessageHandlerRegistry_1.MessageHandlerRegistry);
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        for (const protocol of this.config.protocols) {
            protocol.register(messageHandlerRegistry, featureRegistry);
        }
    }
    async onInitializeContext(agentContext) {
        // We only support initialization of message pickup for the root agent
        if (!agentContext.isRootAgentContext)
            return;
        // FIXME: this does not take into account multi-tenant agents, need to think how to separate based on context
        const messagePickupSessionService = agentContext.dependencyManager.resolve(services_1.MessagePickupSessionService);
        messagePickupSessionService.start(agentContext);
    }
}
exports.MessagePickupModule = MessagePickupModule;
//# sourceMappingURL=MessagePickupModule.js.map