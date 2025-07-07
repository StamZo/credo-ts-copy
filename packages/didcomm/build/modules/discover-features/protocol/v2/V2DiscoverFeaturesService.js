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
exports.V2DiscoverFeaturesService = void 0;
const core_1 = require("@credo-ts/core");
const FeatureRegistry_1 = require("../../../../FeatureRegistry");
const MessageHandlerRegistry_1 = require("../../../../MessageHandlerRegistry");
const DiscoverFeaturesEvents_1 = require("../../DiscoverFeaturesEvents");
const DiscoverFeaturesModuleConfig_1 = require("../../DiscoverFeaturesModuleConfig");
const services_1 = require("../../services");
const handlers_1 = require("./handlers");
const messages_1 = require("./messages");
let V2DiscoverFeaturesService = class V2DiscoverFeaturesService extends services_1.DiscoverFeaturesService {
    constructor(featureRegistry, eventEmitter, messageHandlerRegistry, logger, discoverFeaturesModuleConfig) {
        super(featureRegistry, eventEmitter, logger, discoverFeaturesModuleConfig);
        /**
         * The version of the discover features protocol this service supports
         */
        this.version = 'v2';
        this.registerMessageHandlers(messageHandlerRegistry);
    }
    registerMessageHandlers(messageHandlerRegistry) {
        messageHandlerRegistry.registerMessageHandler(new handlers_1.V2DisclosuresMessageHandler(this));
        messageHandlerRegistry.registerMessageHandler(new handlers_1.V2QueriesMessageHandler(this));
    }
    async createQuery(options) {
        const queryMessage = new messages_1.V2QueriesMessage({ queries: options.queries });
        return { message: queryMessage };
    }
    async processQuery(messageContext) {
        const { queries, threadId } = messageContext.message;
        const connection = messageContext.assertReadyConnection();
        this.eventEmitter.emit(messageContext.agentContext, {
            type: DiscoverFeaturesEvents_1.DiscoverFeaturesEventTypes.QueryReceived,
            payload: {
                message: messageContext.message,
                connection,
                queries,
                protocolVersion: this.version,
                threadId,
            },
        });
        // Process query and send responde automatically if configured to do so, otherwise
        // just send the event and let controller decide
        if (this.discoverFeaturesModuleConfig.autoAcceptQueries) {
            return await this.createDisclosure({
                threadId,
                disclosureQueries: queries,
            });
        }
    }
    async createDisclosure(options) {
        const matches = this.featureRegistry.query(...options.disclosureQueries);
        const discloseMessage = new messages_1.V2DisclosuresMessage({
            threadId: options.threadId,
            features: matches,
        });
        return { message: discloseMessage };
    }
    async processDisclosure(messageContext) {
        const { disclosures, threadId } = messageContext.message;
        const connection = messageContext.assertReadyConnection();
        this.eventEmitter.emit(messageContext.agentContext, {
            type: DiscoverFeaturesEvents_1.DiscoverFeaturesEventTypes.DisclosureReceived,
            payload: {
                message: messageContext.message,
                connection,
                disclosures,
                protocolVersion: this.version,
                threadId,
            },
        });
    }
};
exports.V2DiscoverFeaturesService = V2DiscoverFeaturesService;
exports.V2DiscoverFeaturesService = V2DiscoverFeaturesService = __decorate([
    (0, core_1.injectable)(),
    __param(3, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [FeatureRegistry_1.FeatureRegistry,
        core_1.EventEmitter,
        MessageHandlerRegistry_1.MessageHandlerRegistry, Object, DiscoverFeaturesModuleConfig_1.DiscoverFeaturesModuleConfig])
], V2DiscoverFeaturesService);
//# sourceMappingURL=V2DiscoverFeaturesService.js.map