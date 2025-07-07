"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorModule = void 0;
const FeatureRegistry_1 = require("../../FeatureRegistry");
const models_1 = require("../../models");
const MediatorApi_1 = require("./MediatorApi");
const MediatorModuleConfig_1 = require("./MediatorModuleConfig");
const models_2 = require("./models");
const repository_1 = require("./repository");
const services_1 = require("./services");
class MediatorModule {
    constructor(config) {
        this.api = MediatorApi_1.MediatorApi;
        this.config = new MediatorModuleConfig_1.MediatorModuleConfig(config);
    }
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(MediatorModuleConfig_1.MediatorModuleConfig, this.config);
        // Services
        dependencyManager.registerSingleton(services_1.MediatorService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.MediationRepository);
        dependencyManager.registerSingleton(repository_1.MediatorRoutingRepository);
    }
    async initialize(agentContext) {
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/coordinate-mediation/1.0',
            roles: [models_2.MediationRole.Mediator],
        }));
    }
    async onInitializeContext(agentContext) {
        // Mediator initialization only supported for root agent
        if (!agentContext.isRootAgentContext)
            return;
        const mediatorService = agentContext.dependencyManager.resolve(services_1.MediatorService);
        agentContext.config.logger.debug('Mediator routing record not loaded yet, retrieving from storage');
        const routingRecord = await mediatorService.findMediatorRoutingRecord(agentContext);
        // If we don't have a routing record yet for this tenant, create it
        if (!routingRecord) {
            agentContext.config.logger.debug('Mediator routing record does not exist yet, creating routing keys and record');
            await mediatorService.createMediatorRoutingRecord(agentContext);
        }
    }
}
exports.MediatorModule = MediatorModule;
//# sourceMappingURL=MediatorModule.js.map