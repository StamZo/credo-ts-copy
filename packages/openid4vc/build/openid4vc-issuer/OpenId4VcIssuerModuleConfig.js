"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenId4VcIssuerModuleConfig = void 0;
const router_1 = require("../shared/router");
const DEFAULT_C_NONCE_EXPIRES_IN = 1 * 60; // 1 minute
const DEFAULT_AUTHORIZATION_CODE_EXPIRES_IN = 1 * 60; // 1 minute
const DEFAULT_TOKEN_EXPIRES_IN = 3 * 60; // 3 minutes
const DEFAULT_STATEFUL_CREDENTIAL_OFFER_EXPIRES_IN = 3 * 60; // 3 minutes
class OpenId4VcIssuerModuleConfig {
    constructor(options) {
        this.options = options;
        this.getVerificationSessionForIssuanceSessionAuthorization =
            options.getVerificationSessionForIssuanceSessionAuthorization;
        this.router = options.router ?? (0, router_1.importExpress)().Router();
    }
    get baseUrl() {
        return this.options.baseUrl;
    }
    /**
     * A function mapping a credential request to the credential to be issued.
     */
    get credentialRequestToCredentialMapper() {
        return this.options.credentialRequestToCredentialMapper;
    }
    /**
     * The time after which a cNone will expire.
     *
     * @default 60 (1 minute)
     */
    get cNonceExpiresInSeconds() {
        return this.options.cNonceExpiresInSeconds ?? DEFAULT_C_NONCE_EXPIRES_IN;
    }
    /**
     * The time after which a stateful credential offer not bound to a subject expires. Once the offer has been bound
     * to a subject the access token expiration takes effect. This is to prevent long-lived `pre-authorized_code` and
     * `issuer_state` values.
     *
     * @default 360 (5 minutes)
     */
    get statefulCredentialOfferExpirationInSeconds() {
        return this.options.statefulCredentialOfferExpirationInSeconds ?? DEFAULT_STATEFUL_CREDENTIAL_OFFER_EXPIRES_IN;
    }
    /**
     * The time after which a cNonce will expire.
     *
     * @default 60 (1 minute)
     */
    get authorizationCodeExpiresInSeconds() {
        return this.options.authorizationCodeExpiresInSeconds ?? DEFAULT_AUTHORIZATION_CODE_EXPIRES_IN;
    }
    /**
     * The time after which an access token will expire.
     *
     * @default 360 (5 minutes)
     */
    get accessTokenExpiresInSeconds() {
        return this.options.accessTokenExpiresInSeconds ?? DEFAULT_TOKEN_EXPIRES_IN;
    }
    /**
     * Whether DPoP is required for all issuance sessions. This value can be overridden when creating
     * a credential offer. If dpop is not required, but used by a client in the first request to credo,
     * DPoP will be required going forward.
     *
     * @default false
     */
    get dpopRequired() {
        return this.options.dpopRequired ?? false;
    }
    /**
     * Whether wallet attestations are required for all issuance sessions. This value can be overridden when creating
     * a credential offer, but will have effect for dynamic issuance sessions. If wallet attestations are not required
     * but used by a client in the first request to credo,
     * wallet attestations will be required going forward.
     *
     * @default false
     */
    get walletAttestationsRequired() {
        return this.options.walletAttestationsRequired ?? false;
    }
    /**
     * Whether to allow dynamic issuance sessions based on a credential request.
     *
     * This requires an external authorization server which issues access tokens without
     * a `pre-authorized_code` or `issuer_state` parameter.
     *
     * Credo only supports stateful credential offer sessions (pre-auth or presentation during issuance)
     *
     * @default false
     */
    get allowDynamicIssuanceSessions() {
        return this.options.allowDynamicIssuanceSessions ?? false;
    }
    /**
     * @default /nonce
     */
    get nonceEndpointPath() {
        return this.options.endpoints?.nonce ?? '/nonce';
    }
    /**
     * @default /challenge
     */
    get authorizationChallengeEndpointPath() {
        return this.options.endpoints?.authorizationChallenge ?? '/challenge';
    }
    /**
     * @default /offers
     */
    get credentialOfferEndpointPath() {
        return this.options.endpoints?.credentialOffer ?? '/offers';
    }
    /**
     * @default /credential
     */
    get credentialEndpointPath() {
        return this.options.endpoints?.credential ?? '/credential';
    }
    /**
     * @default /token
     */
    get accessTokenEndpointPath() {
        return this.options.endpoints?.accessToken ?? '/token';
    }
    /**
     * @default /jwks
     */
    get jwksEndpointPath() {
        return this.options.endpoints?.jwks ?? '/jwks';
    }
}
exports.OpenId4VcIssuerModuleConfig = OpenId4VcIssuerModuleConfig;
//# sourceMappingURL=OpenId4VcIssuerModuleConfig.js.map