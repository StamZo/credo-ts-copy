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
exports.RoutingService = void 0;
const core_1 = require("@credo-ts/core");
const DidCommModuleConfig_1 = require("../../../DidCommModuleConfig");
const RoutingEvents_1 = require("../RoutingEvents");
const MediationRecipientService_1 = require("./MediationRecipientService");
let RoutingService = class RoutingService {
    constructor(mediationRecipientService, eventEmitter) {
        this.mediationRecipientService = mediationRecipientService;
        this.eventEmitter = eventEmitter;
    }
    async getRouting(agentContext, { mediatorId, useDefaultMediator = true } = {}) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const didcommConfig = agentContext.resolve(DidCommModuleConfig_1.DidCommModuleConfig);
        // Create and store new key
        const recipientKey = await kms.createKey({ type: { kty: 'OKP', crv: 'Ed25519' } });
        let routing = {
            endpoints: didcommConfig.endpoints,
            routingKeys: [],
            recipientKey: core_1.Kms.PublicJwk.fromPublicJwk(recipientKey.publicJwk),
        };
        // Extend routing with mediator keys (if applicable)
        routing = await this.mediationRecipientService.addMediationRouting(agentContext, routing, {
            mediatorId,
            useDefaultMediator,
        });
        // Emit event so other parts of the framework can react on keys created
        this.eventEmitter.emit(agentContext, {
            type: RoutingEvents_1.RoutingEventTypes.RoutingCreatedEvent,
            payload: {
                routing,
            },
        });
        return routing;
    }
    async removeRouting(agentContext, options) {
        await this.mediationRecipientService.removeMediationRouting(agentContext, options);
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [MediationRecipientService_1.MediationRecipientService, core_1.EventEmitter])
], RoutingService);
//# sourceMappingURL=RoutingService.js.map