"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1DiscoverFeaturesService = void 0;
const core_1 = require("@credo-ts/core");
const FeatureRegistry_1 = require("../../../../FeatureRegistry");
const MessageHandlerRegistry_1 = require("../../../../MessageHandlerRegistry");
const models_1 = require("../../../../models");
const DiscoverFeaturesEvents_1 = require("../../DiscoverFeaturesEvents");
const DiscoverFeaturesModuleConfig_1 = require("../../DiscoverFeaturesModuleConfig");
const services_1 = require("../../services");
const handlers_1 = require("./handlers");
const messages_1 = require("./messages");
let V1DiscoverFeaturesService = class V1DiscoverFeaturesService extends services_1.DiscoverFeaturesService {
    constructor(featureRegistry, eventEmitter, messageHandlerRegistry, logger, discoverFeaturesConfig) {
        super(featureRegistry, eventEmitter, logger, discoverFeaturesConfig);
        /**
         * The version of the discover features protocol this service supports
         */
        this.version = 'v1';
        this.registerMessageHandlers(messageHandlerRegistry);
    }
    registerMessageHandlers(messageHandlerRegistry) {
        messageHandlerRegistry.registerMessageHandler(new handlers_1.V1DiscloseMessageHandler(this));
        messageHandlerRegistry.registerMessageHandler(new handlers_1.V1QueryMessageHandler(this));
    }
    async createQuery(options) {
        if (options.queries.length > 1) {
            throw new core_1.CredoError('Discover Features V1 only supports a single query');
        }
        if (options.queries[0].featureType !== 'protocol') {
            throw new core_1.CredoError('Discover Features V1 only supports querying for protocol support');
        }
        const queryMessage = new messages_1.V1QueryMessage({
            query: options.queries[0].match,
            comment: options.comment,
        });
        return { message: queryMessage };
    }
    async processQuery(messageContext) {
        const { query, threadId } = messageContext.message;
        const connection = messageContext.assertReadyConnection();
        this.eventEmitter.emit(messageContext.agentContext, {
            type: DiscoverFeaturesEvents_1.DiscoverFeaturesEventTypes.QueryReceived,
            payload: {
                message: messageContext.message,
                connection,
                queries: [{ featureType: 'protocol', match: query }],
                protocolVersion: this.version,
                threadId,
            },
        });
        // Process query and send responde automatically if configured to do so, otherwise
        // just send the event and let controller decide
        if (this.discoverFeaturesModuleConfig.autoAcceptQueries) {
            return await this.createDisclosure({
                threadId,
                disclosureQueries: [{ featureType: 'protocol', match: query }],
            });
        }
    }
    async createDisclosure(options) {
        if (options.disclosureQueries.some((item) => item.featureType !== 'protocol')) {
            throw new core_1.CredoError('Discover Features V1 only supports protocols');
        }
        if (!options.threadId) {
            throw new core_1.CredoError('Thread Id is required for Discover Features V1 disclosure');
        }
        const matches = this.featureRegistry.query(...options.disclosureQueries);
        const discloseMessage = new messages_1.V1DiscloseMessage({
            threadId: options.threadId,
            protocols: matches.map((item) => new messages_1.DiscloseProtocol({
                protocolId: item.id,
                roles: item.roles,
            })),
        });
        return { message: discloseMessage };
    }
    async processDisclosure(messageContext) {
        const { protocols, threadId } = messageContext.message;
        const connection = messageContext.assertReadyConnection();
        this.eventEmitter.emit(messageContext.agentContext, {
            type: DiscoverFeaturesEvents_1.DiscoverFeaturesEventTypes.DisclosureReceived,
            payload: {
                message: messageContext.message,
                connection,
                disclosures: protocols.map((item) => new models_1.Protocol({ id: item.protocolId, roles: item.roles })),
                protocolVersion: this.version,
                threadId,
            },
        });
    }
};
exports.V1DiscoverFeaturesService = V1DiscoverFeaturesService;
exports.V1DiscoverFeaturesService = V1DiscoverFeaturesService = __decorate([
    (0, core_1.injectable)(),
    __param(3, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [FeatureRegistry_1.FeatureRegistry,
        core_1.EventEmitter,
        MessageHandlerRegistry_1.MessageHandlerRegistry, Object, DiscoverFeaturesModuleConfig_1.DiscoverFeaturesModuleConfig])
], V1DiscoverFeaturesService);
//# sourceMappingURL=V1DiscoverFeaturesService.js.map