"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutOfBandModule = void 0;
const FeatureRegistry_1 = require("../../FeatureRegistry");
const models_1 = require("../../models");
const OutOfBandApi_1 = require("./OutOfBandApi");
const OutOfBandService_1 = require("./OutOfBandService");
const repository_1 = require("./repository");
class OutOfBandModule {
    constructor() {
        this.api = OutOfBandApi_1.OutOfBandApi;
    }
    /**
     * Registers the dependencies of the ot of band module on the dependency manager.
     */
    register(dependencyManager) {
        // Services
        dependencyManager.registerSingleton(OutOfBandService_1.OutOfBandService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.OutOfBandRepository);
    }
    async initialize(agentContext) {
        // Features
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/out-of-band/1.1',
            roles: ['sender', 'receiver'],
        }));
    }
}
exports.OutOfBandModule = OutOfBandModule;
//# sourceMappingURL=OutOfBandModule.js.map