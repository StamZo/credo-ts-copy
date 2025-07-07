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
exports.DidCommApi = void 0;
const core_1 = require("@credo-ts/core");
const DidCommModuleConfig_1 = require("./DidCommModuleConfig");
const FeatureRegistry_1 = require("./FeatureRegistry");
const MessageHandlerRegistry_1 = require("./MessageHandlerRegistry");
const MessageReceiver_1 = require("./MessageReceiver");
const MessageSender_1 = require("./MessageSender");
let DidCommApi = class DidCommApi {
    constructor(messageHandlerRegistry, messageSender, messageReceiver, featureRegistry, config) {
        this.messageReceiver = messageReceiver;
        this.messageSender = messageSender;
        this.featureRegistry = featureRegistry;
        this.config = config;
        this.messageHandlerRegistry = messageHandlerRegistry;
    }
    registerInboundTransport(inboundTransport) {
        this.messageReceiver.registerInboundTransport(inboundTransport);
    }
    async unregisterInboundTransport(inboundTransport) {
        await this.messageReceiver.unregisterInboundTransport(inboundTransport);
    }
    get inboundTransports() {
        return this.messageReceiver.inboundTransports;
    }
    registerOutboundTransport(outboundTransport) {
        this.messageSender.registerOutboundTransport(outboundTransport);
    }
    async unregisterOutboundTransport(outboundTransport) {
        await this.messageSender.unregisterOutboundTransport(outboundTransport);
    }
    get outboundTransports() {
        return this.messageSender.outboundTransports;
    }
    /**
     * Agent's feature registry
     */
    registerMessageHandlers(messageHandlers) {
        for (const messageHandler of messageHandlers) {
            this.messageHandlerRegistry.registerMessageHandler(messageHandler);
        }
    }
    registerMessageHandlerMiddleware(messageHandlerMiddleware) {
        this.messageHandlerRegistry.registerMessageHandlerMiddleware(messageHandlerMiddleware);
    }
    get fallbackMessageHandler() {
        return this.messageHandlerRegistry.fallbackMessageHandler;
    }
    get messageHandlerMiddlewares() {
        return this.messageHandlerRegistry.messageHandlerMiddlewares;
    }
    /**
     * Sets the fallback message handler, the message handler that will be called if no handler
     * is registered for an incoming message type.
     */
    setFallbackMessageHandler(fallbackMessageHandler) {
        this.messageHandlerRegistry.setFallbackMessageHandler(fallbackMessageHandler);
    }
    get features() {
        return this.featureRegistry;
    }
};
exports.DidCommApi = DidCommApi;
exports.DidCommApi = DidCommApi = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [MessageHandlerRegistry_1.MessageHandlerRegistry,
        MessageSender_1.MessageSender,
        MessageReceiver_1.MessageReceiver,
        FeatureRegistry_1.FeatureRegistry,
        DidCommModuleConfig_1.DidCommModuleConfig])
], DidCommApi);
//# sourceMappingURL=DidCommApi.js.map