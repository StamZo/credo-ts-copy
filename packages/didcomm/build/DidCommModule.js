"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidCommModule = void 0;
const core_1 = require("@credo-ts/core");
const rxjs_1 = require("rxjs");
const DidCommApi_1 = require("./DidCommApi");
const DidCommModuleConfig_1 = require("./DidCommModuleConfig");
const Dispatcher_1 = require("./Dispatcher");
const EnvelopeService_1 = require("./EnvelopeService");
const Events_1 = require("./Events");
const FeatureRegistry_1 = require("./FeatureRegistry");
const MessageHandlerRegistry_1 = require("./MessageHandlerRegistry");
const MessageReceiver_1 = require("./MessageReceiver");
const MessageSender_1 = require("./MessageSender");
const TransportService_1 = require("./TransportService");
const repository_1 = require("./repository");
const _0_1_0_2_1 = require("./updates/0.1-0.2");
const _0_2_0_3_1 = require("./updates/0.2-0.3");
const _0_4_0_5_1 = require("./updates/0.4-0.5");
class DidCommModule {
    constructor(config) {
        this.api = DidCommApi_1.DidCommApi;
        this.updates = [
            {
                fromVersion: '0.1',
                toVersion: '0.2',
                doUpdate: _0_1_0_2_1.updateV0_1ToV0_2,
            },
            {
                fromVersion: '0.2',
                toVersion: '0.3',
                doUpdate: _0_2_0_3_1.updateV0_2ToV0_3,
            },
            {
                fromVersion: '0.4',
                toVersion: '0.5',
                doUpdate: _0_4_0_5_1.updateV0_4ToV0_5,
            },
        ];
        this.config = new DidCommModuleConfig_1.DidCommModuleConfig(config);
    }
    /**
     * Registers the dependencies of the question answer module on the dependency manager.
     */
    register(dependencyManager) {
        // Config
        dependencyManager.registerInstance(DidCommModuleConfig_1.DidCommModuleConfig, this.config);
        // Registries
        dependencyManager.registerSingleton(MessageHandlerRegistry_1.MessageHandlerRegistry);
        dependencyManager.registerSingleton(FeatureRegistry_1.FeatureRegistry);
        // Services
        dependencyManager.registerSingleton(MessageSender_1.MessageSender);
        dependencyManager.registerSingleton(MessageReceiver_1.MessageReceiver);
        dependencyManager.registerSingleton(TransportService_1.TransportService);
        dependencyManager.registerSingleton(Dispatcher_1.Dispatcher);
        dependencyManager.registerSingleton(EnvelopeService_1.EnvelopeService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.DidCommMessageRepository);
        // Features
        // TODO: Constraints?
    }
    async initialize(agentContext) {
        const stop$ = agentContext.dependencyManager.resolve(core_1.InjectionSymbols.Stop$);
        const eventEmitter = agentContext.dependencyManager.resolve(core_1.EventEmitter);
        const messageReceiver = agentContext.dependencyManager.resolve(MessageReceiver_1.MessageReceiver);
        const messageSender = agentContext.dependencyManager.resolve(MessageSender_1.MessageSender);
        // Listen for new messages (either from transports or somewhere else in the framework / extensions)
        // We create this before doing any other initialization, so the initialization could already receive messages
        eventEmitter
            .observable(Events_1.AgentEventTypes.AgentMessageReceived)
            .pipe((0, rxjs_1.takeUntil)(stop$), (0, rxjs_1.mergeMap)((e) => messageReceiver
            .receiveMessage(e.payload.message, {
            connection: e.payload.connection,
            contextCorrelationId: e.payload.contextCorrelationId,
            session: e.payload.session,
        })
            .catch((error) => {
            agentContext.config.logger.error('Failed to process message', { error });
        }), this.config.processDidCommMessagesConcurrently ? undefined : 1))
            .subscribe();
        for (const transport of messageReceiver.inboundTransports) {
            await transport.start(agentContext);
        }
        for (const transport of messageSender.outboundTransports) {
            await transport.start(agentContext);
        }
    }
    async shutdown(agentContext) {
        const messageReceiver = agentContext.dependencyManager.resolve(MessageReceiver_1.MessageReceiver);
        const messageSender = agentContext.dependencyManager.resolve(MessageSender_1.MessageSender);
        // Stop transports
        const allTransports = [...messageReceiver.inboundTransports, ...messageSender.outboundTransports];
        const transportPromises = allTransports.map((transport) => transport.stop());
        await Promise.all(transportPromises);
    }
}
exports.DidCommModule = DidCommModule;
//# sourceMappingURL=DidCommModule.js.map