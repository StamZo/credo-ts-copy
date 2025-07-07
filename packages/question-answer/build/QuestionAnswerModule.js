"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswerModule = void 0;
const didcomm_1 = require("@credo-ts/didcomm");
const QuestionAnswerApi_1 = require("./QuestionAnswerApi");
const QuestionAnswerRole_1 = require("./QuestionAnswerRole");
const repository_1 = require("./repository");
const services_1 = require("./services");
class QuestionAnswerModule {
    constructor() {
        this.api = QuestionAnswerApi_1.QuestionAnswerApi;
    }
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager) {
        // Services
        dependencyManager.registerSingleton(services_1.QuestionAnswerService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.QuestionAnswerRepository);
    }
    async initialize(agentContext) {
        // Feature Registry
        const featureRegistry = agentContext.dependencyManager.resolve(didcomm_1.FeatureRegistry);
        featureRegistry.register(new didcomm_1.Protocol({
            id: 'https://didcomm.org/questionanswer/1.0',
            roles: [QuestionAnswerRole_1.QuestionAnswerRole.Questioner, QuestionAnswerRole_1.QuestionAnswerRole.Responder],
        }));
    }
}
exports.QuestionAnswerModule = QuestionAnswerModule;
//# sourceMappingURL=QuestionAnswerModule.js.map