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
exports.OpenId4VcVerifierApi = void 0;
const core_1 = require("@credo-ts/core");
const OpenId4VcVerifierModuleConfig_1 = require("./OpenId4VcVerifierModuleConfig");
const OpenId4VpVerifierService_1 = require("./OpenId4VpVerifierService");
/**
 * @public
 */
let OpenId4VcVerifierApi = class OpenId4VcVerifierApi {
    constructor(config, agentContext, openId4VpVerifierService) {
        this.config = config;
        this.agentContext = agentContext;
        this.openId4VpVerifierService = openId4VpVerifierService;
    }
    /**
     * Retrieve all verifier records from storage
     */
    async getAllVerifiers() {
        return this.openId4VpVerifierService.getAllVerifiers(this.agentContext);
    }
    /**
     * Retrieve a verifier record from storage by its verified id
     */
    async getVerifierByVerifierId(verifierId) {
        return this.openId4VpVerifierService.getVerifierByVerifierId(this.agentContext, verifierId);
    }
    /**
     * Create a new verifier and store the new verifier record.
     */
    async createVerifier(options) {
        return this.openId4VpVerifierService.createVerifier(this.agentContext, options);
    }
    async updateVerifierMetadata(options) {
        const { verifierId, clientMetadata } = options;
        const verifier = await this.openId4VpVerifierService.getVerifierByVerifierId(this.agentContext, verifierId);
        verifier.clientMetadata = clientMetadata;
        return this.openId4VpVerifierService.updateVerifier(this.agentContext, verifier);
    }
    async findVerificationSessionsByQuery(query, queryOptions) {
        return this.openId4VpVerifierService.findVerificationSessionsByQuery(this.agentContext, query, queryOptions);
    }
    async getVerificationSessionById(verificationSessionId) {
        return this.openId4VpVerifierService.getVerificationSessionById(this.agentContext, verificationSessionId);
    }
    /**
     * Create an OpenID4VP authorization request, acting as a Relying Party (RP).
     *
     * See {@link OpenId4VpCreateAuthorizationRequestOptions} for detailed documentation on the options.
     */
    async createAuthorizationRequest({ verifierId, ...otherOptions }) {
        const verifier = await this.getVerifierByVerifierId(verifierId);
        return await this.openId4VpVerifierService.createAuthorizationRequest(this.agentContext, {
            ...otherOptions,
            verifier,
        });
    }
    /**
     * Verifies an authorization response, acting as a Relying Party (RP).
     *
     * It validates the ID Token, VP Token and the signature(s) of the received Verifiable Presentation(s)
     * as well as that the structure of the Verifiable Presentation matches the provided presentation definition.
     */
    async verifyAuthorizationResponse({ verificationSessionId, ...otherOptions }) {
        const verificationSession = await this.getVerificationSessionById(verificationSessionId);
        return await this.openId4VpVerifierService.verifyAuthorizationResponse(this.agentContext, {
            ...otherOptions,
            verificationSession,
        });
    }
    async getVerifiedAuthorizationResponse(verificationSessionId) {
        const verificationSession = await this.getVerificationSessionById(verificationSessionId);
        return this.openId4VpVerifierService.getVerifiedAuthorizationResponse(this.agentContext, verificationSession);
    }
};
exports.OpenId4VcVerifierApi = OpenId4VcVerifierApi;
exports.OpenId4VcVerifierApi = OpenId4VcVerifierApi = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [OpenId4VcVerifierModuleConfig_1.OpenId4VcVerifierModuleConfig,
        core_1.AgentContext,
        OpenId4VpVerifierService_1.OpenId4VpVerifierService])
], OpenId4VcVerifierApi);
//# sourceMappingURL=OpenId4VcVerifierApi.js.map