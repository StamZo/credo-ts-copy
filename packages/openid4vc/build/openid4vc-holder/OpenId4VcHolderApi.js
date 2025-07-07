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
exports.OpenId4VcHolderApi = void 0;
const core_1 = require("@credo-ts/core");
const OpenId4VciHolderService_1 = require("./OpenId4VciHolderService");
const OpenId4vpHolderService_1 = require("./OpenId4vpHolderService");
/**
 * @public
 */
let OpenId4VcHolderApi = class OpenId4VcHolderApi {
    constructor(agentContext, openId4VciHolderService, openId4VpHolderService, difPresentationExchangeService, dcqlService) {
        this.agentContext = agentContext;
        this.openId4VciHolderService = openId4VciHolderService;
        this.openId4VpHolderService = openId4VpHolderService;
        this.difPresentationExchangeService = difPresentationExchangeService;
        this.dcqlService = dcqlService;
    }
    /**
     * Resolves the authentication request given as URI or JWT to a unified format, and
     * verifies the validity of the request.
     *
     * The resolved request can be accepted with the @see acceptOpenId4VpAuthorizationRequest.
     *
     * If the authorization request uses OpenID4VP and included presentation definitions,
     * a `presentationExchange` property will be defined with credentials that satisfy the
     * incoming request. When `presentationExchange` is present, you MUST supply `presentationExchange`
     * when calling `acceptOpenId4VpAuthorizationRequest` as well.
     *
     * @param request
     * Can be:
     * - JWT
     * - URI containing request or request_uri param
     * - Request payload
     * @returns the resolved and verified authentication request.
     */
    async resolveOpenId4VpAuthorizationRequest(request, options) {
        return this.openId4VpHolderService.resolveAuthorizationRequest(this.agentContext, request, options);
    }
    /**
     * Accepts the authentication request after it has been resolved and verified with {@link resolveOpenId4VpAuthorizationRequest}.
     *
     * If the resolved authorization request included a `presentationExchange` property, you MUST supply `presentationExchange`
     * in the `options` parameter. The same is true for `dcql`.
     *
     * For response mode of `direct_post` or `direct_post.jwt` the response will be submitted directly
     * to the response url. For `dc_api` and `dc_api.jwt` the response will be returned but without a
     * `serverResponse`, and you have to submit the response yourself.
     */
    async acceptOpenId4VpAuthorizationRequest(options) {
        return await this.openId4VpHolderService.acceptAuthorizationRequest(this.agentContext, options);
    }
    /**
     * Automatically select credentials from available credentials for a presentation exchange request. Can be called after calling
     * @see resolveOpenId4VpAuthorizationRequest.
     */
    selectCredentialsForPresentationExchangeRequest(credentialsForRequest) {
        return this.difPresentationExchangeService.selectCredentialsForRequest(credentialsForRequest);
    }
    /**
     * Automatically select credentials from available credentials for a dcql request. Can be called after calling
     * @see resolveOpenId4VpAuthorizationRequest.
     */
    selectCredentialsForDcqlRequest(dcqlQueryResult) {
        return this.dcqlService.selectCredentialsForRequest(dcqlQueryResult);
    }
    async resolveIssuerMetadata(credentialIssuer) {
        return await this.openId4VciHolderService.resolveIssuerMetadata(this.agentContext, credentialIssuer);
    }
    /**
     * Resolves a credential offer given as credential offer URL, or issuance initiation URL,
     * into a unified format with metadata.
     *
     * @param credentialOffer the credential offer to resolve
     * @returns The uniform credential offer payload, the issuer metadata, protocol version, and the offered credentials with metadata.
     */
    async resolveCredentialOffer(credentialOffer) {
        return await this.openId4VciHolderService.resolveCredentialOffer(this.agentContext, credentialOffer);
    }
    /**
     * This function is to be used to receive an credential in OpenID4VCI using the Authorization Code Flow.
     *
     * Not to be confused with the {@link resolveOpenId4VpAuthorizationRequest}, which is only used for OpenID4VP requests.
     *
     * It will generate an authorization session based on the provided options.
     *
     * There are two possible flows:
     * - Oauth2Redirect: an authorization request URI is returend which can be used to obtain the authorization code.
     *   This needs to be done manually (e.g. by opening a browser window)
     * - PresentationDuringIssuance: an openid4vp presentation request needs to be handled. A oid4vpRequestUri is returned
     *   which can be parsed using `resolveOpenId4VpAuthorizationRequest`. After the presentation session has been completed,
     *   the resulting `presentationDuringIssuanceSession` can be used to obtain an authorization code
     *
     * Authorization to request credentials can only be requested through scopes.
     *
     * @param resolvedCredentialOffer Obtained through @see resolveCredentialOffer
     * @param authCodeFlowOptions
     * @returns The authorization request URI alongside the code verifier and original @param authCodeFlowOptions
     */
    async resolveOpenId4VciAuthorizationRequest(resolvedCredentialOffer, authCodeFlowOptions) {
        return await this.openId4VciHolderService.resolveAuthorizationRequest(this.agentContext, resolvedCredentialOffer, authCodeFlowOptions);
    }
    /**
     * Retrieve an authorization code using an `presentationDuringIssuanceSession`.
     *
     * The authorization code can be exchanged for an `accessToken` @see requestToken
     */
    async retrieveAuthorizationCodeUsingPresentation(options) {
        return await this.openId4VciHolderService.retrieveAuthorizationCodeUsingPresentation(this.agentContext, options);
    }
    /**
     * Requests the token to be used for credential requests.
     */
    async requestToken(options) {
        const { accessTokenResponse, dpop } = await this.openId4VciHolderService.requestAccessToken(this.agentContext, options);
        return {
            accessToken: accessTokenResponse.access_token,
            cNonce: accessTokenResponse.c_nonce,
            dpop,
            accessTokenResponse,
        };
    }
    /**
     * Request a set of credentials from the credential isser.
     * Can be used with both the pre-authorized code flow and the authorization code flow.
     */
    async requestCredentials(options) {
        const { resolvedCredentialOffer, cNonce, accessToken, dpop, clientId, ...credentialRequestOptions } = options;
        return this.openId4VciHolderService.acceptCredentialOffer(this.agentContext, {
            resolvedCredentialOffer,
            acceptCredentialOfferOptions: credentialRequestOptions,
            accessToken,
            cNonce,
            dpop,
            clientId,
        });
    }
    /**
     * Send a notification event to the credential issuer
     */
    async sendNotification(options) {
        return this.openId4VciHolderService.sendNotification(this.agentContext, options);
    }
};
exports.OpenId4VcHolderApi = OpenId4VcHolderApi;
exports.OpenId4VcHolderApi = OpenId4VcHolderApi = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [core_1.AgentContext,
        OpenId4VciHolderService_1.OpenId4VciHolderService,
        OpenId4vpHolderService_1.OpenId4VpHolderService,
        core_1.DifPresentationExchangeService,
        core_1.DcqlService])
], OpenId4VcHolderApi);
//# sourceMappingURL=OpenId4VcHolderApi.js.map