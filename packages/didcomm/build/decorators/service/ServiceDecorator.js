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
exports.ServiceDecorator = void 0;
const core_1 = require("@credo-ts/core");
const class_validator_1 = require("class-validator");
/**
 * Represents `~service` decorator
 *
 * Based on specification Aries RFC 0056: Service Decorator
 * @see https://github.com/hyperledger/aries-rfcs/tree/master/features/0056-service-decorator
 */
class ServiceDecorator {
    constructor(options) {
        if (options) {
            this.recipientKeys = options.recipientKeys;
            this.routingKeys = options.routingKeys;
            this.serviceEndpoint = options.serviceEndpoint;
        }
    }
    get resolvedDidCommService() {
        return {
            id: core_1.utils.uuid(),
            recipientKeys: this.recipientKeys.map(core_1.verkeyToPublicJwk),
            routingKeys: this.routingKeys?.map(core_1.verkeyToPublicJwk) ?? [],
            serviceEndpoint: this.serviceEndpoint,
        };
    }
    static fromResolvedDidCommService(service) {
        return new ServiceDecorator({
            recipientKeys: service.recipientKeys.map((k) => core_1.TypedArrayEncoder.toBase58(k.publicKey.publicKey)),
            routingKeys: service.routingKeys.map((k) => core_1.TypedArrayEncoder.toBase58(k.publicKey.publicKey)),
            serviceEndpoint: service.serviceEndpoint,
        });
    }
}
exports.ServiceDecorator = ServiceDecorator;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ServiceDecorator.prototype, "recipientKeys", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ServiceDecorator.prototype, "routingKeys", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ServiceDecorator.prototype, "serviceEndpoint", void 0);
//# sourceMappingURL=ServiceDecorator.js.map