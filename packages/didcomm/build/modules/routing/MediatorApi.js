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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorApi = void 0;
const core_1 = require("@credo-ts/core");
const MessageHandlerRegistry_1 = require("../../MessageHandlerRegistry");
const MessageSender_1 = require("../../MessageSender");
const models_1 = require("../../models");
const connections_1 = require("../connections");
const MediatorModuleConfig_1 = require("./MediatorModuleConfig");
const handlers_1 = require("./handlers");
const MediationRequestHandler_1 = require("./handlers/MediationRequestHandler");
const MediatorService_1 = require("./services/MediatorService");
let MediatorApi = class MediatorApi {
    constructor(messageHandlerRegistry, mediationService, messageSender, agentContext, connectionService, config) {
        this.mediatorService = mediationService;
        this.messageSender = messageSender;
        this.connectionService = connectionService;
        this.agentContext = agentContext;
        this.config = config;
        this.registerMessageHandlers(messageHandlerRegistry);
    }
    async grantRequestedMediation(mediationRecordId) {
        const record = await this.mediatorService.getById(this.agentContext, mediationRecordId);
        const connectionRecord = await this.connectionService.getById(this.agentContext, record.connectionId);
        const { message, mediationRecord } = await this.mediatorService.createGrantMediationMessage(this.agentContext, record);
        const outboundMessageContext = new models_1.OutboundMessageContext(message, {
            agentContext: this.agentContext,
            connection: connectionRecord,
            associatedRecord: mediationRecord,
        });
        await this.messageSender.sendMessage(outboundMessageContext);
        return mediationRecord;
    }
    registerMessageHandlers(messageHandlerRegistry) {
        messageHandlerRegistry.registerMessageHandler(new handlers_1.KeylistUpdateHandler(this.mediatorService));
        messageHandlerRegistry.registerMessageHandler(new handlers_1.ForwardHandler(this.mediatorService));
        messageHandlerRegistry.registerMessageHandler(new MediationRequestHandler_1.MediationRequestHandler(this.mediatorService, this.config));
    }
};
exports.MediatorApi = MediatorApi;
exports.MediatorApi = MediatorApi = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [MessageHandlerRegistry_1.MessageHandlerRegistry,
        MediatorService_1.MediatorService,
        MessageSender_1.MessageSender,
        core_1.AgentContext,
        connections_1.ConnectionService,
        MediatorModuleConfig_1.MediatorModuleConfig])
], MediatorApi);
//# sourceMappingURL=MediatorApi.js.map