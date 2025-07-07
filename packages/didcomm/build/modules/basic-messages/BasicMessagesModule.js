"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicMessagesModule = void 0;
const FeatureRegistry_1 = require("../../FeatureRegistry");
const models_1 = require("../../models");
const BasicMessageRole_1 = require("./BasicMessageRole");
const BasicMessagesApi_1 = require("./BasicMessagesApi");
const repository_1 = require("./repository");
const services_1 = require("./services");
class BasicMessagesModule {
    constructor() {
        this.api = BasicMessagesApi_1.BasicMessagesApi;
    }
    /**
     * Registers the dependencies of the basic message module on the dependency manager.
     */
    register(dependencyManager) {
        // Services
        dependencyManager.registerSingleton(services_1.BasicMessageService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.BasicMessageRepository);
    }
    async initialize(agentContext) {
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/basicmessage/1.0',
            roles: [BasicMessageRole_1.BasicMessageRole.Sender, BasicMessageRole_1.BasicMessageRole.Receiver],
        }));
    }
}
exports.BasicMessagesModule = BasicMessagesModule;
//# sourceMappingURL=BasicMessagesModule.js.map