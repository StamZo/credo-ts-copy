"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediationRecipientModule = void 0;
const core_1 = require("@credo-ts/core");
const FeatureRegistry_1 = require("../../FeatureRegistry");
const models_1 = require("../../models");
const connections_1 = require("../connections");
const oob_1 = require("../oob");
const MediationRecipientApi_1 = require("./MediationRecipientApi");
const MediationRecipientModuleConfig_1 = require("./MediationRecipientModuleConfig");
const models_2 = require("./models");
const repository_1 = require("./repository");
const services_1 = require("./services");
class MediationRecipientModule {
    constructor(config) {
        this.api = MediationRecipientApi_1.MediationRecipientApi;
        this.config = new MediationRecipientModuleConfig_1.MediationRecipientModuleConfig(config);
    }
    /**
     * Registers the dependencies of the mediator recipient module on the dependency manager.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(MediationRecipientModuleConfig_1.MediationRecipientModuleConfig, this.config);
        // Services
        dependencyManager.registerSingleton(services_1.MediationRecipientService);
        dependencyManager.registerSingleton(services_1.RoutingService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.MediationRepository);
    }
    async initialize(agentContext) {
        const featureRegistry = agentContext.dependencyManager.resolve(FeatureRegistry_1.FeatureRegistry);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/coordinate-mediation/1.0',
            roles: [models_2.MediationRole.Recipient],
        }));
    }
    async onCloseContext(agentContext) {
        // Q: Can we also just call stop for non-defult context?
        if (!agentContext.isRootAgentContext)
            return;
        const mediationRecipientApi = agentContext.dependencyManager.resolve(MediationRecipientApi_1.MediationRecipientApi);
        await mediationRecipientApi.stopMessagePickup();
    }
    async onInitializeContext(agentContext) {
        // We only support mediation config for the root agent context
        if (!agentContext.isRootAgentContext)
            return;
        const mediationRecipientApi = agentContext.dependencyManager.resolve(MediationRecipientApi_1.MediationRecipientApi);
        // Connect to mediator through provided invitation if provided in config
        // Also requests mediation ans sets as default mediator
        if (this.config.mediatorInvitationUrl) {
            agentContext.config.logger.debug('Provision mediation with invitation', {
                mediatorInvitationUrl: this.config.mediatorInvitationUrl,
            });
            const mediationConnection = await this.getMediationConnection(agentContext, this.config.mediatorInvitationUrl);
            await mediationRecipientApi.provision(mediationConnection);
        }
        // Poll for messages from mediator
        const defaultMediator = await mediationRecipientApi.findDefaultMediator();
        if (defaultMediator) {
            mediationRecipientApi.initiateMessagePickup(defaultMediator).catch((error) => {
                agentContext.config.logger.warn(`Error initiating message pickup with mediator ${defaultMediator.id}`, {
                    error,
                });
            });
        }
    }
    async getMediationConnection(agentContext, mediatorInvitationUrl) {
        const oobApi = agentContext.dependencyManager.resolve(oob_1.OutOfBandApi);
        const connectionsApi = agentContext.dependencyManager.resolve(connections_1.ConnectionsApi);
        const mediationRecipientApi = agentContext.dependencyManager.resolve(MediationRecipientApi_1.MediationRecipientApi);
        const outOfBandInvitation = await oobApi.parseInvitation(mediatorInvitationUrl);
        const outOfBandRecord = await oobApi.findByReceivedInvitationId(outOfBandInvitation.id);
        const [connection] = outOfBandRecord ? await connectionsApi.findAllByOutOfBandId(outOfBandRecord.id) : [];
        if (!connection) {
            agentContext.config.logger.debug('Mediation connection does not exist, creating connection');
            // We don't want to use the current default mediator when connecting to another mediator
            const routing = await mediationRecipientApi.getRouting({ useDefaultMediator: false });
            agentContext.config.logger.debug('Routing created', routing);
            const { connectionRecord: newConnection } = await oobApi.receiveInvitation(outOfBandInvitation, {
                routing,
            });
            agentContext.config.logger.debug('Mediation invitation processed', { outOfBandInvitation });
            if (!newConnection) {
                throw new core_1.CredoError('No connection record to provision mediation.');
            }
            return connectionsApi.returnWhenIsConnected(newConnection.id);
        }
        if (!connection.isReady) {
            return connectionsApi.returnWhenIsConnected(connection.id);
        }
        return connection;
    }
}
exports.MediationRecipientModule = MediationRecipientModule;
//# sourceMappingURL=MediationRecipientModule.js.map