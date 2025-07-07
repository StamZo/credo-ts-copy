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
exports.OpenId4VcIssuerService = void 0;
const core_1 = require("@credo-ts/core");
const oauth2_1 = require("@openid4vc/oauth2");
const openid4vci_1 = require("@openid4vc/openid4vci");
const openid4vc_verifier_1 = require("../openid4vc-verifier");
const shared_1 = require("../shared");
const callbacks_1 = require("../shared/callbacks");
const issuerMetadataUtils_1 = require("../shared/issuerMetadataUtils");
const router_1 = require("../shared/router");
const utils_1 = require("../shared/utils");
const OpenId4VcIssuanceSessionState_1 = require("./OpenId4VcIssuanceSessionState");
const OpenId4VcIssuerEvents_1 = require("./OpenId4VcIssuerEvents");
const OpenId4VcIssuerModuleConfig_1 = require("./OpenId4VcIssuerModuleConfig");
const repository_1 = require("./repository");
const txCode_1 = require("./util/txCode");
/**
 * @internal
 */
let OpenId4VcIssuerService = class OpenId4VcIssuerService {
    constructor(w3cCredentialService, openId4VcIssuerConfig, openId4VcIssuerRepository, openId4VcIssuanceSessionRepository) {
        this.w3cCredentialService = w3cCredentialService;
        this.openId4VcIssuerConfig = openId4VcIssuerConfig;
        this.openId4VcIssuerRepository = openId4VcIssuerRepository;
        this.openId4VcIssuanceSessionRepository = openId4VcIssuanceSessionRepository;
    }
    async createStatelessCredentialOffer(agentContext, options) {
        const { authorizationCodeFlowConfig, issuer, credentialConfigurationIds } = options;
        const vcIssuer = this.getIssuer(agentContext);
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        const uniqueOfferedCredentials = Array.from(new Set(options.credentialConfigurationIds));
        if (uniqueOfferedCredentials.length !== credentialConfigurationIds.length) {
            throw new core_1.CredoError('All offered credentials must have unique ids.');
        }
        // Check if all the offered credential configuration ids have a scope value. If not, it won't be possible to actually request
        // issuance of the credential later on
        (0, openid4vci_1.extractScopesForCredentialConfigurationIds)({
            credentialConfigurationIds: options.credentialConfigurationIds,
            issuerMetadata,
            throwOnConfigurationWithoutScope: true,
        });
        if (authorizationCodeFlowConfig.authorizationServerUrl === issuerMetadata.credentialIssuer.credential_issuer) {
            throw new core_1.CredoError('Stateless offers can only be created for external authorization servers. Make sure to configure an external authorization server on the issuer record, and provide the authoriation server url.');
        }
        const { credentialOffer, credentialOfferObject } = await vcIssuer.createCredentialOffer({
            credentialConfigurationIds: options.credentialConfigurationIds,
            grants: {
                authorization_code: {
                    authorization_server: authorizationCodeFlowConfig.authorizationServerUrl,
                },
            },
            credentialOfferScheme: options.baseUri,
            issuerMetadata,
        });
        return {
            credentialOffer,
            credentialOfferObject,
        };
    }
    async createCredentialOffer(agentContext, options) {
        const { preAuthorizedCodeFlowConfig, authorizationCodeFlowConfig, issuer, credentialConfigurationIds, version = 'v1.draft11-15', authorization, } = options;
        if (!preAuthorizedCodeFlowConfig && !authorizationCodeFlowConfig) {
            throw new core_1.CredoError('Authorization Config or Pre-Authorized Config must be provided.');
        }
        const vcIssuer = this.getIssuer(agentContext);
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        const uniqueOfferedCredentials = Array.from(new Set(options.credentialConfigurationIds));
        if (uniqueOfferedCredentials.length !== credentialConfigurationIds.length) {
            throw new core_1.CredoError('All offered credentials must have unique ids.');
        }
        if (uniqueOfferedCredentials.length === 0) {
            throw new core_1.CredoError('You need to offer at least one credential.');
        }
        // We always use shortened URIs currently
        const credentialOfferId = core_1.utils.uuid();
        const hostedCredentialOfferUri = (0, core_1.joinUriParts)(issuerMetadata.credentialIssuer.credential_issuer, [
            this.openId4VcIssuerConfig.credentialOfferEndpointPath,
            credentialOfferId,
        ]);
        // Check if all the offered credential configuration ids have a scope value. If not, it won't be possible to actually request
        // issuance of the credential later on. For pre-auth it's not needed to add a scope.
        if (options.authorizationCodeFlowConfig) {
            (0, openid4vci_1.extractScopesForCredentialConfigurationIds)({
                credentialConfigurationIds: options.credentialConfigurationIds,
                issuerMetadata,
                throwOnConfigurationWithoutScope: true,
            });
        }
        const grants = await this.getGrantsFromConfig(agentContext, {
            issuerMetadata,
            preAuthorizedCodeFlowConfig,
            authorizationCodeFlowConfig,
        });
        const { credentialOffer, credentialOfferObject } = await vcIssuer.createCredentialOffer({
            credentialConfigurationIds: options.credentialConfigurationIds,
            grants,
            credentialOfferUri: hostedCredentialOfferUri,
            credentialOfferScheme: options.baseUri,
            issuerMetadata: {
                originalDraftVersion: version === 'v1.draft11-15' ? openid4vci_1.Openid4vciDraftVersion.Draft11 : openid4vci_1.Openid4vciDraftVersion.Draft15,
                ...issuerMetadata,
            },
        });
        const issuanceSessionRepository = this.openId4VcIssuanceSessionRepository;
        const issuanceSession = new repository_1.OpenId4VcIssuanceSessionRecord({
            credentialOfferPayload: credentialOfferObject,
            credentialOfferUri: hostedCredentialOfferUri,
            credentialOfferId,
            issuerId: issuer.issuerId,
            state: OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.OfferCreated,
            authorization: credentialOfferObject.grants?.authorization_code?.issuer_state
                ? {
                    issuerState: credentialOfferObject.grants?.authorization_code?.issuer_state,
                }
                : undefined,
            presentation: authorizationCodeFlowConfig?.requirePresentationDuringIssuance
                ? {
                    required: true,
                }
                : undefined,
            dpop: authorization?.requireDpop
                ? {
                    required: true,
                }
                : undefined,
            walletAttestation: authorization?.requireWalletAttestation
                ? {
                    required: true,
                }
                : undefined,
            // TODO: how to mix pre-auth and auth? Need to do state checks
            preAuthorizedCode: credentialOfferObject.grants?.[oauth2_1.preAuthorizedCodeGrantIdentifier]?.['pre-authorized_code'],
            userPin: preAuthorizedCodeFlowConfig?.txCode
                ? (0, txCode_1.generateTxCode)(agentContext, preAuthorizedCodeFlowConfig.txCode)
                : undefined,
            issuanceMetadata: options.issuanceMetadata,
        });
        await issuanceSessionRepository.save(agentContext, issuanceSession);
        this.emitStateChangedEvent(agentContext, issuanceSession, null);
        return {
            issuanceSession,
            credentialOffer,
        };
    }
    async createCredentialResponse(agentContext, options) {
        options.issuanceSession.assertState([
            // OfferUriRetrieved is valid when doing auth flow (we should add a check)
            OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.OfferUriRetrieved,
            OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.AccessTokenCreated,
            OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.CredentialRequestReceived,
            // It is possible to issue multiple credentials in one session
            OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.CredentialsPartiallyIssued,
        ]);
        const { issuanceSession } = options;
        const issuer = await this.getIssuerByIssuerId(agentContext, options.issuanceSession.issuerId);
        const vcIssuer = this.getIssuer(agentContext, { issuanceSessionId: issuanceSession.id });
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        const parsedCredentialRequest = vcIssuer.parseCredentialRequest({
            issuerMetadata,
            credentialRequest: options.credentialRequest,
        });
        const { credentialRequest, credentialIdentifier, format, } = parsedCredentialRequest;
        if (credentialIdentifier) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidCredentialRequest,
                error_description: `Using unsupported 'credential_identifier'`,
            });
        }
        if (credentialRequest.format && !format) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.UnsupportedCredentialFormat,
                error_description: `Unsupported credential request based on format '${credentialRequest.format}'`,
            });
        }
        if (parsedCredentialRequest.credentialConfigurationId && !parsedCredentialRequest.credentialConfiguration) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.UnsupportedCredentialFormat,
                error_description: `Unsupported credential request based on credential configuration id ${credentialRequest.credential_configuration_id}`,
            });
        }
        const { credentialConfiguration, credentialConfigurationId } = this.getCredentialConfigurationsForRequest({
            issuanceSession,
            issuerMetadata,
            requestFormat: format,
            credentialConfigurations: parsedCredentialRequest.credentialConfiguration && parsedCredentialRequest.credentialConfigurationId
                ? {
                    [parsedCredentialRequest.credentialConfigurationId]: parsedCredentialRequest.credentialConfiguration,
                }
                : undefined,
            authorization: options.authorization,
        });
        const verifiedCredentialRequestProofs = await this.verifyCredentialRequestProofs(agentContext, {
            issuanceSession,
            issuer,
            parsedCredentialRequest,
            credentialConfiguration,
            credentialConfigurationId,
        });
        const signedCredentials = await this.getSignedCredentials(agentContext, {
            credentialRequest,
            issuanceSession,
            issuer,
            credentialConfiguration,
            credentialConfigurationId,
            requestFormat: format,
            authorization: options.authorization,
            credentialRequestToCredentialMapper: options.credentialRequestToCredentialMapper,
            credentialRequestProofs: verifiedCredentialRequestProofs,
        });
        // NOTE: nonce in credential response is deprecated in newer drafts, but for now we keep it in
        const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
        const credentialResponse = vcIssuer.createCredentialResponse({
            credential: credentialRequest.proof ? signedCredentials.credentials[0] : undefined,
            credentials: credentialRequest.proofs ? signedCredentials.credentials : undefined,
            cNonce,
            cNonceExpiresInSeconds,
            credentialRequest: parsedCredentialRequest,
        });
        issuanceSession.issuedCredentials.push(credentialConfigurationId);
        const newState = issuanceSession.issuedCredentials.length >=
            issuanceSession.credentialOfferPayload.credential_configuration_ids.length
            ? OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.Completed
            : OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.CredentialsPartiallyIssued;
        await this.updateState(agentContext, issuanceSession, newState);
        return {
            credentialResponse,
            issuanceSession,
        };
    }
    async verifyCredentialRequestProofs(agentContext, options) {
        const { parsedCredentialRequest, issuer, issuanceSession, credentialConfiguration, credentialConfigurationId } = options;
        const { proofs } = parsedCredentialRequest;
        const vcIssuer = this.getIssuer(agentContext, { issuanceSessionId: issuanceSession.id });
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        // FIXME: verify request against the configuration
        // - key attestations required
        // - proof types supported
        // - signing alg values supported
        // - key attestation level met.
        const allowedProofTypes = credentialConfiguration.proof_types_supported ?? {
            jwt: { proof_signing_alg_values_supported: (0, utils_1.getSupportedJwaSignatureAlgorithms)(agentContext) },
        };
        const [proofType, proofValue] = Object.entries(proofs ?? {})[0] ?? [];
        if (!proofType || !proofValue || proofValue.length === 0) {
            const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                error_description: 'Missing required proof(s) in credential request',
                c_nonce: cNonce,
                c_nonce_expires_in: cNonceExpiresInSeconds,
            });
        }
        if (proofType !== 'jwt' && proofType !== 'attestation') {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                error_description: `Proof type '${proofType}' is not supported `,
            });
        }
        const supportedProofType = allowedProofTypes[proofType];
        if (!supportedProofType) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                error_description: `Proof type '${proofType}' is not supported for credential configuration '${credentialConfigurationId}'`,
            });
        }
        if (proofType === 'attestation' && proofValue.length !== 1) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                error_description: "Only a single proofs entry is supported for proof type 'attestation'",
            });
        }
        await this.updateState(agentContext, issuanceSession, OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.CredentialRequestReceived);
        if (proofType === 'attestation') {
            const keyAttestationJwt = proofValue[0];
            const keyAttestation = await vcIssuer.verifyCredentialRequestAttestationProof({
                issuerMetadata,
                keyAttestationJwt,
            });
            if (!supportedProofType.proof_signing_alg_values_supported.includes(keyAttestation.header.alg)) {
                throw new oauth2_1.Oauth2ServerErrorResponseError({
                    error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                    error_description: `Proof signing alg value '${keyAttestation.header.alg}' is not supported for proof type 'attestation' in credentail configuration '${credentialConfigurationId}'`,
                });
            }
            if (!keyAttestation.payload.nonce) {
                const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
                throw new oauth2_1.Oauth2ServerErrorResponseError({
                    error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                    error_description: 'Missing nonce in attestation proof in credential request. If no nonce is present in the attestation, use the jwt proof type instead',
                    c_nonce: cNonce,
                    c_nonce_expires_in: cNonceExpiresInSeconds,
                });
            }
            if (supportedProofType.key_attestations_required && keyAttestation) {
                const expectedKeyStorage = supportedProofType.key_attestations_required.key_storage;
                const expectedUserAuthentication = supportedProofType.key_attestations_required.user_authentication;
                if (expectedKeyStorage &&
                    !expectedKeyStorage.some((keyStorage) => keyAttestation.payload.key_storage?.includes(keyStorage))) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: `Insufficent key_storage for key attestation. Proof type 'attestation' for credential configuration '${credentialConfigurationId}', expects one of key_storage values ${expectedKeyStorage.join(', ')}`,
                    });
                }
                if (expectedUserAuthentication &&
                    !expectedUserAuthentication.some((userAuthentication) => keyAttestation.payload.user_authentication?.includes(userAuthentication))) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: `Insufficent user_authentication for key attestation. Proof type 'attestation' for credential configuration '${credentialConfigurationId}', expects one of user_authentication values ${expectedUserAuthentication.join(', ')}`,
                    });
                }
            }
            await this.verifyNonce(agentContext, issuer, keyAttestation.payload.nonce).catch(async (error) => {
                const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
                throw new oauth2_1.Oauth2ServerErrorResponseError({
                    error: oauth2_1.Oauth2ErrorCodes.InvalidNonce,
                    error_description: 'Invalid nonce in credential request',
                    c_nonce: cNonce,
                    c_nonce_expires_in: cNonceExpiresInSeconds,
                }, {
                    cause: error,
                });
            });
            return {
                bindingMethod: 'jwk',
                keys: keyAttestation.payload.attested_keys.map((attestedKey) => {
                    return {
                        method: 'jwk',
                        jwk: core_1.Kms.PublicJwk.fromUnknown(attestedKey),
                    };
                }),
                proofType: 'attestation',
                // It's up to the credential request mapper to ensure we trust the key attestation signer
                // For x5c it's kinda covered already.
                keyAttestation,
            };
        }
        if (proofType === 'jwt') {
            let firstNonce = undefined;
            const proofSigners = [];
            for (const jwt of proofValue) {
                const { signer, payload, header, keyAttestation } = await vcIssuer.verifyCredentialRequestJwtProof({
                    issuerMetadata,
                    jwt,
                    clientId: options.issuanceSession.clientId,
                });
                // TOOD: we should probably do this check before signature verification, but we then we
                // first need to decode the jwt
                if (!supportedProofType.proof_signing_alg_values_supported.includes(header.alg)) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: `Proof signing alg value '${header.alg}' is not supported for proof type 'jwt' in credentail configuration '${credentialConfigurationId}'`,
                    });
                }
                if (signer.method !== 'jwk' && signer.method !== 'did') {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: "Only 'jwk' and 'did' binding methods supported for jwt proof",
                    });
                }
                if (proofSigners[0] && signer.method !== proofSigners[0].method) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: "All proofs must be signed using the same binding method. Found a mix of 'did' and 'jwk'",
                    });
                }
                if (proofSigners[0] && signer.alg !== proofSigners[0].alg) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: "All proofs must be signed using the same alg value. Found a mix of different 'alg' values.",
                    });
                }
                if (keyAttestation && signer.method === 'did') {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: "Binding method 'did' is not supported when a key attestation is provided.",
                    });
                }
                if (supportedProofType.key_attestations_required && !keyAttestation) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: `Missing required key attestation. Key attestations are required for proof type 'jwt' in credentail configuration '${credentialConfigurationId}'`,
                    });
                }
                if (supportedProofType.key_attestations_required && keyAttestation) {
                    const expectedKeyStorage = supportedProofType.key_attestations_required.key_storage;
                    const expectedUserAuthentication = supportedProofType.key_attestations_required.user_authentication;
                    if (expectedKeyStorage &&
                        !expectedKeyStorage.some((keyStorage) => keyAttestation.payload.key_storage?.includes(keyStorage))) {
                        throw new oauth2_1.Oauth2ServerErrorResponseError({
                            error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                            error_description: `Insufficent key_storage for key attestation. Proof type 'jwt' for credential configuration '${credentialConfigurationId}', expects one of key_storage values ${expectedKeyStorage.join(', ')}`,
                        });
                    }
                    if (expectedUserAuthentication &&
                        !expectedUserAuthentication.some((userAuthentication) => keyAttestation.payload.user_authentication?.includes(userAuthentication))) {
                        throw new oauth2_1.Oauth2ServerErrorResponseError({
                            error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                            error_description: `Insufficent user_authentication for key attestation. Proof type 'jwt' for credential configuration '${credentialConfigurationId}', expects one of user_authentication values ${expectedUserAuthentication.join(', ')}`,
                        });
                    }
                }
                if (keyAttestation && proofValue.length > 1) {
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: "Only a single proofs entry is supported when jwt proof header contains  'key_attestation'",
                    });
                }
                if (!payload.nonce) {
                    const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: 'Missing nonce in proof(s) in credential request',
                        c_nonce: cNonce,
                        c_nonce_expires_in: cNonceExpiresInSeconds,
                    });
                }
                // Set previous nonce if not yet set (first iteration)
                if (!firstNonce)
                    firstNonce = payload.nonce;
                if (firstNonce !== payload.nonce) {
                    const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
                        error_description: 'Not all nonce values in proofs are equal',
                        c_nonce: cNonce,
                        c_nonce_expires_in: cNonceExpiresInSeconds,
                    });
                }
                // Verify the nonce
                await this.verifyNonce(agentContext, issuer, payload.nonce).catch(async (error) => {
                    const { cNonce, cNonceExpiresInSeconds } = await this.createNonce(agentContext, issuer);
                    throw new oauth2_1.Oauth2ServerErrorResponseError({
                        error: oauth2_1.Oauth2ErrorCodes.InvalidNonce,
                        error_description: 'Invalid nonce in credential request',
                        c_nonce: cNonce,
                        c_nonce_expires_in: cNonceExpiresInSeconds,
                    }, {
                        cause: error,
                    });
                });
                if (keyAttestation) {
                    return {
                        proofType: 'jwt',
                        bindingMethod: 'jwk',
                        keys: keyAttestation.payload.attested_keys.map((attestedKey) => {
                            return {
                                method: 'jwk',
                                jwk: core_1.Kms.PublicJwk.fromUnknown(attestedKey),
                            };
                        }),
                        keyAttestation,
                    };
                }
                proofSigners.push(signer);
            }
            if (proofSigners[0].method === 'did') {
                const signers = proofSigners;
                return {
                    proofType: 'jwt',
                    bindingMethod: 'did',
                    keys: signers.map((signer) => ({
                        didUrl: signer.didUrl,
                        method: 'did',
                        jwk: core_1.Kms.PublicJwk.fromUnknown(signer.publicJwk),
                    })),
                };
            }
            return {
                proofType: 'jwt',
                bindingMethod: 'jwk',
                keys: proofSigners.map((signer) => {
                    return {
                        method: 'jwk',
                        jwk: core_1.Kms.PublicJwk.fromUnknown(signer.publicJwk),
                    };
                }),
            };
        }
        // This will not happen, but to make TS happy
        throw new oauth2_1.Oauth2ServerErrorResponseError({
            error: oauth2_1.Oauth2ErrorCodes.InvalidProof,
            error_description: 'Missing required proof(s) in credential request',
        });
    }
    async findIssuanceSessionsByQuery(agentContext, query, queryOptions) {
        return this.openId4VcIssuanceSessionRepository.findByQuery(agentContext, query, queryOptions);
    }
    async findSingleIssuancSessionByQuery(agentContext, query) {
        return this.openId4VcIssuanceSessionRepository.findSingleByQuery(agentContext, query);
    }
    async getIssuanceSessionById(agentContext, issuanceSessionId) {
        return this.openId4VcIssuanceSessionRepository.getById(agentContext, issuanceSessionId);
    }
    async getAllIssuers(agentContext) {
        return this.openId4VcIssuerRepository.getAll(agentContext);
    }
    async getIssuerByIssuerId(agentContext, issuerId) {
        return this.openId4VcIssuerRepository.getByIssuerId(agentContext, issuerId);
    }
    async updateIssuer(agentContext, issuer) {
        return this.openId4VcIssuerRepository.update(agentContext, issuer);
    }
    async createIssuer(agentContext, options) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        // TODO: ideally we can store additional data with a key, such as:
        // - createdAt
        // - purpose
        const accessTokenSignerKey = await kms.createKey({
            type: options.accessTokenSignerKeyType ?? { kty: 'OKP', crv: 'Ed25519' },
        });
        const openId4VcIssuer = new repository_1.OpenId4VcIssuerRecord({
            issuerId: options.issuerId ?? core_1.utils.uuid(),
            display: options.display,
            dpopSigningAlgValuesSupported: options.dpopSigningAlgValuesSupported,
            accessTokenPublicJwk: accessTokenSignerKey.publicJwk,
            authorizationServerConfigs: options.authorizationServerConfigs,
            credentialConfigurationsSupported: options.credentialConfigurationsSupported,
            batchCredentialIssuance: options.batchCredentialIssuance,
        });
        await this.openId4VcIssuerRepository.save(agentContext, openId4VcIssuer);
        await (0, router_1.storeActorIdForContextCorrelationId)(agentContext, openId4VcIssuer.issuerId);
        return openId4VcIssuer;
    }
    async rotateAccessTokenSigningKey(agentContext, issuer, options) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const previousKey = issuer.resolvedAccessTokenPublicJwk;
        const accessTokenSignerKey = await kms.createKey({
            type: options?.accessTokenSignerKeyType ?? { kty: 'OKP', crv: 'Ed25519' },
        });
        issuer.accessTokenPublicJwk = accessTokenSignerKey.publicJwk;
        await this.openId4VcIssuerRepository.update(agentContext, issuer);
        // Remove previous key
        await kms.deleteKey({
            keyId: previousKey.keyId,
        });
    }
    /**
     * @param fetchExternalAuthorizationServerMetadata defaults to false
     */
    async getIssuerMetadata(agentContext, issuerRecord, fetchExternalAuthorizationServerMetadata = false) {
        const config = agentContext.dependencyManager.resolve(OpenId4VcIssuerModuleConfig_1.OpenId4VcIssuerModuleConfig);
        const issuerUrl = (0, core_1.joinUriParts)(config.baseUrl, [issuerRecord.issuerId]);
        const oauth2Client = this.getOauth2Client(agentContext);
        const extraAuthorizationServers = fetchExternalAuthorizationServerMetadata && issuerRecord.authorizationServerConfigs
            ? await Promise.all(issuerRecord.authorizationServerConfigs.map(async (server) => {
                const metadata = await oauth2Client.fetchAuthorizationServerMetadata(server.issuer);
                if (!metadata)
                    throw new core_1.CredoError(`Authorization server metadata not found for issuer '${server.issuer}'`);
                return metadata;
            }))
            : [];
        const authorizationServers = issuerRecord.authorizationServerConfigs && issuerRecord.authorizationServerConfigs.length > 0
            ? [
                ...issuerRecord.authorizationServerConfigs.map((authorizationServer) => authorizationServer.issuer),
                // Our issuer is also a valid authorization server (only for pre-auth)
                issuerUrl,
            ]
            : undefined;
        const credentialIssuerMetadata = {
            credential_issuer: issuerUrl,
            credential_endpoint: (0, core_1.joinUriParts)(issuerUrl, [config.credentialEndpointPath]),
            credential_configurations_supported: issuerRecord.credentialConfigurationsSupported ?? {},
            authorization_servers: authorizationServers,
            display: issuerRecord.display,
            nonce_endpoint: (0, core_1.joinUriParts)(issuerUrl, [config.nonceEndpointPath]),
            batch_credential_issuance: issuerRecord.batchCredentialIssuance
                ? {
                    batch_size: issuerRecord.batchCredentialIssuance.batchSize,
                }
                : undefined,
        };
        const issuerAuthorizationServer = {
            issuer: issuerUrl,
            token_endpoint: (0, core_1.joinUriParts)(issuerUrl, [config.accessTokenEndpointPath]),
            'pre-authorized_grant_anonymous_access_supported': true,
            jwks_uri: (0, core_1.joinUriParts)(issuerUrl, [config.jwksEndpointPath]),
            authorization_challenge_endpoint: (0, core_1.joinUriParts)(issuerUrl, [config.authorizationChallengeEndpointPath]),
            // TODO: PAR (maybe not needed as we only use this auth server for presentation during issuance)
            // pushed_authorization_request_endpoint: '',
            // require_pushed_authorization_requests: true
            code_challenge_methods_supported: [oauth2_1.PkceCodeChallengeMethod.S256],
            dpop_signing_alg_values_supported: issuerRecord.dpopSigningAlgValuesSupported,
        };
        return {
            credentialIssuer: credentialIssuerMetadata,
            authorizationServers: [issuerAuthorizationServer, ...extraAuthorizationServers],
        };
    }
    async createNonce(agentContext, issuer) {
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        const jwsService = agentContext.dependencyManager.resolve(core_1.JwsService);
        const cNonceExpiresInSeconds = this.openId4VcIssuerConfig.cNonceExpiresInSeconds;
        const cNonceExpiresAt = (0, utils_1.addSecondsToDate)(new Date(), cNonceExpiresInSeconds);
        const key = issuer.resolvedAccessTokenPublicJwk;
        const cNonce = await jwsService.createJwsCompact(agentContext, {
            keyId: key.keyId,
            payload: core_1.JwtPayload.fromJson({
                iss: issuerMetadata.credentialIssuer.credential_issuer,
                exp: (0, utils_1.dateToSeconds)(cNonceExpiresAt),
            }),
            protectedHeaderOptions: {
                typ: 'credo+cnonce',
                kid: key.keyId,
                alg: key.signatureAlgorithm,
            },
        });
        return {
            cNonce,
            cNonceExpiresAt,
            cNonceExpiresInSeconds,
        };
    }
    /**
     * @todo nonces are very short lived (1 min), but it might be nice to also cache the nonces
     * in the cache if we have 'seen' them. They will only be in the cache for a short time
     * and it will prevent replay
     */
    async verifyNonce(agentContext, issuer, cNonce) {
        const issuerMetadata = await this.getIssuerMetadata(agentContext, issuer);
        const jwsService = agentContext.dependencyManager.resolve(core_1.JwsService);
        const key = issuer.resolvedAccessTokenPublicJwk;
        const jwt = core_1.Jwt.fromSerializedJwt(cNonce);
        jwt.payload.validate();
        if (jwt.payload.iss !== issuerMetadata.credentialIssuer.credential_issuer) {
            throw new core_1.CredoError(`Invalid 'iss' claim in cNonce jwt`);
        }
        if (jwt.header.typ !== 'credo+cnonce') {
            throw new core_1.CredoError(`Invalid 'typ' claim in cNonce jwt header`);
        }
        const verification = await jwsService.verifyJws(agentContext, {
            jws: cNonce,
            jwsSigner: {
                method: 'jwk',
                jwk: key,
            },
        });
        if (!verification.isValid) {
            throw new core_1.CredoError('Invalid nonce');
        }
    }
    getIssuer(agentContext, options = {}) {
        return new openid4vci_1.Openid4vciIssuer({
            callbacks: (0, callbacks_1.getOid4vcCallbacks)(agentContext, options),
        });
    }
    getOauth2Client(agentContext) {
        return new oauth2_1.Oauth2Client({
            callbacks: (0, callbacks_1.getOid4vcCallbacks)(agentContext),
        });
    }
    getOauth2AuthorizationServer(agentContext, options = {}) {
        return new oauth2_1.Oauth2AuthorizationServer({
            callbacks: (0, callbacks_1.getOid4vcCallbacks)(agentContext, options),
        });
    }
    getResourceServer(agentContext, issuerRecord) {
        return new oauth2_1.Oauth2ResourceServer({
            callbacks: {
                ...(0, callbacks_1.getOid4vcCallbacks)(agentContext),
                clientAuthentication: (0, callbacks_1.dynamicOid4vciClientAuthentication)(agentContext, issuerRecord),
            },
        });
    }
    /**
     * Update the record to a new state and emit an state changed event. Also updates the record
     * in storage.
     */
    async updateState(agentContext, issuanceSession, newState) {
        agentContext.config.logger.debug(`Updating openid4vc issuance session record ${issuanceSession.id} to state ${newState} (previous=${issuanceSession.state})`);
        const previousState = issuanceSession.state;
        issuanceSession.state = newState;
        await this.openId4VcIssuanceSessionRepository.update(agentContext, issuanceSession);
        this.emitStateChangedEvent(agentContext, issuanceSession, previousState);
    }
    emitStateChangedEvent(agentContext, issuanceSession, previousState) {
        const eventEmitter = agentContext.dependencyManager.resolve(core_1.EventEmitter);
        eventEmitter.emit(agentContext, {
            type: OpenId4VcIssuerEvents_1.OpenId4VcIssuerEvents.IssuanceSessionStateChanged,
            payload: {
                issuanceSession: issuanceSession.clone(),
                previousState: previousState,
            },
        });
    }
    async getGrantsFromConfig(agentContext, config) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const { preAuthorizedCodeFlowConfig, authorizationCodeFlowConfig, issuerMetadata } = config;
        // TOOD: export type
        const grants = {};
        // Pre auth
        if (preAuthorizedCodeFlowConfig) {
            const { txCode, authorizationServerUrl, preAuthorizedCode } = preAuthorizedCodeFlowConfig;
            grants[oauth2_1.preAuthorizedCodeGrantIdentifier] = {
                'pre-authorized_code': preAuthorizedCode ?? core_1.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 })),
                tx_code: txCode,
                authorization_server: config.issuerMetadata.credentialIssuer.authorization_servers
                    ? authorizationServerUrl
                    : undefined,
            };
        }
        // Auth
        if (authorizationCodeFlowConfig) {
            const { requirePresentationDuringIssuance } = authorizationCodeFlowConfig;
            let authorizationServerUrl = authorizationCodeFlowConfig.authorizationServerUrl;
            if (requirePresentationDuringIssuance) {
                if (authorizationServerUrl && authorizationServerUrl !== issuerMetadata.credentialIssuer.credential_issuer) {
                    throw new core_1.CredoError(`When 'requirePresentationDuringIssuance' is set, 'authorizationServerUrl' must be undefined or match the credential issuer identifier`);
                }
                authorizationServerUrl = issuerMetadata.credentialIssuer.credential_issuer;
            }
            grants.authorization_code = {
                issuer_state: 
                // TODO: the issuer_state should not be guessable, so it's best if we generate it and now allow the user to provide it?
                // but same is true for the pre-auth code and users of credo can also provide that value. We can't easily do unique constraint with askat
                authorizationCodeFlowConfig.issuerState ?? core_1.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 })),
                authorization_server: config.issuerMetadata.credentialIssuer.authorization_servers
                    ? authorizationServerUrl
                    : undefined,
            };
        }
        return grants;
    }
    getCredentialConfigurationsForRequest(options) {
        const { requestFormat, issuanceSession, issuerMetadata, authorization, credentialConfigurations } = options;
        // Check against all credential configurations
        const configurationsMatchingRequest = credentialConfigurations
            ? credentialConfigurations
            : requestFormat
                ? (0, openid4vci_1.getCredentialConfigurationsMatchingRequestFormat)({
                    requestFormat,
                    credentialConfigurations: issuerMetadata.credentialIssuer.credential_configurations_supported,
                })
                : undefined;
        if (!configurationsMatchingRequest) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidCredentialRequest,
                error_description: `Either 'credential_configuration_id' or 'format' needs to be defined'`,
            });
        }
        if (Object.keys(configurationsMatchingRequest).length === 0) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidCredentialRequest,
                error_description: 'Credential request does not match any credential configuration',
            });
        }
        // Limit to offered configurations
        const configurationsMatchingRequestAndOffer = (0, issuerMetadataUtils_1.getOfferedCredentials)(issuanceSession.credentialOfferPayload.credential_configuration_ids, configurationsMatchingRequest, { ignoreNotFoundIds: true });
        if (Object.keys(configurationsMatchingRequestAndOffer).length === 0) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidCredentialRequest,
                error_description: 'Credential request does not match any credential configurations from credential offer',
            });
        }
        // Limit to not-issued configurations
        const configurationsMatchingRequestAndOfferNotIssued = (0, issuerMetadataUtils_1.getOfferedCredentials)(issuanceSession.credentialOfferPayload.credential_configuration_ids.filter((id) => !issuanceSession.issuedCredentials.includes(id)), configurationsMatchingRequestAndOffer, { ignoreNotFoundIds: true });
        if (Object.keys(configurationsMatchingRequestAndOfferNotIssued).length === 0) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidCredentialRequest,
                error_description: 'Credential request does not match any credential configurations from credential offer that have not been issued yet',
            });
        }
        // For pre-auth we allow all ids from the offer
        if (authorization.accessToken.payload['pre-authorized_code']) {
            // We return the first one that matches all checks. Pre draft 15 it could be multiple entries, but only if you offer
            // multiple credentials of the same type. We need to do checks on this, so we pick the first one
            const [credentialConfigurationId, credentialConfiguration] = Object.entries(configurationsMatchingRequestAndOfferNotIssued)[0];
            return {
                credentialConfigurationId,
                credentialConfiguration,
            };
        }
        // Limit to scopes from the token
        // We only do this for auth flow, so it's not required to add a scope for every configuration.
        const configurationsMatchingRequestOfferScope = (0, issuerMetadataUtils_1.getCredentialConfigurationsSupportedForScopes)(configurationsMatchingRequestAndOfferNotIssued, authorization.accessToken.payload.scope?.split(' ') ?? []);
        if (Object.keys(configurationsMatchingRequestOfferScope).length === 0) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InsufficientScope,
                error_description: 'Scope does not grant issuance for any requested credential configurations from credential offer',
            }, {
                status: 403,
            });
        }
        // We return the first one that matches all checks. Pre draft 15 it could be multiple entries, but only if you offer
        // multiple credentials of the same type. We need to do checks on this, so we pick the first one
        const [credentialConfigurationId, credentialConfiguration] = Object.entries(configurationsMatchingRequestOfferScope)[0];
        return {
            credentialConfigurationId,
            credentialConfiguration: credentialConfiguration,
        };
    }
    async getSignedCredentials(agentContext, options) {
        const { issuanceSession, credentialConfiguration, credentialConfigurationId, credentialRequestProofs } = options;
        const mapper = options.credentialRequestToCredentialMapper ?? this.openId4VcIssuerConfig.credentialRequestToCredentialMapper;
        let verification = undefined;
        // NOTE: this will throw an error if the verifier module is not registered and there is a
        // verification session. But you can't get here without the verifier module anyway
        if (issuanceSession.presentation?.openId4VcVerificationSessionId) {
            const verifierApi = agentContext.dependencyManager.resolve(openid4vc_verifier_1.OpenId4VcVerifierApi);
            const session = await verifierApi.getVerificationSessionById(issuanceSession.presentation.openId4VcVerificationSessionId);
            const response = await verifierApi.getVerifiedAuthorizationResponse(issuanceSession.presentation.openId4VcVerificationSessionId);
            if (response.presentationExchange) {
                verification = {
                    session,
                    presentationExchange: response.presentationExchange,
                };
            }
            else if (response.dcql) {
                verification = {
                    session,
                    dcql: response.dcql,
                };
            }
            else {
                throw new core_1.CredoError(`Verified authorization response for verification session with id '${session.id}' does not have presenationExchange or dcql defined.`);
            }
        }
        const signOptions = await mapper({
            agentContext,
            issuanceSession,
            holderBinding: credentialRequestProofs,
            credentialOffer: issuanceSession.credentialOfferPayload,
            verification,
            credentialRequest: options.credentialRequest,
            credentialRequestFormat: options.requestFormat,
            // Macthing credential configuration
            credentialConfiguration,
            credentialConfigurationId,
            // Authorization
            authorization: options.authorization,
        });
        const expectedLength = credentialRequestProofs.keys.length;
        // NOTE: we may want to allow a mismatch between this (as there is a match batch length), but for now it needs to match
        if (signOptions.credentials.length !== expectedLength) {
            throw new core_1.CredoError(`Credential request to credential mapper returned '${signOptions.credentials.length}' to be signed, while '${expectedLength}' holder binding entries were provided. Make sure to return one credential for each holder binding entry`);
        }
        if (signOptions.format === core_1.ClaimFormat.JwtVc || signOptions.format === core_1.ClaimFormat.LdpVc) {
            const oid4vciFormatMap = {
                [shared_1.OpenId4VciCredentialFormatProfile.JwtVcJson]: core_1.ClaimFormat.JwtVc,
                [shared_1.OpenId4VciCredentialFormatProfile.JwtVcJsonLd]: core_1.ClaimFormat.JwtVc,
                [shared_1.OpenId4VciCredentialFormatProfile.LdpVc]: core_1.ClaimFormat.LdpVc,
            };
            const expectedClaimFormat = oid4vciFormatMap[credentialConfiguration.format];
            if (signOptions.format !== expectedClaimFormat) {
                throw new core_1.CredoError(`Invalid credential format returned by sign options. Expected '${expectedClaimFormat}', received '${signOptions.format}'.`);
            }
            return {
                format: credentialConfiguration.format,
                credentials: (await Promise.all(signOptions.credentials.map((credential) => this.signW3cCredential(agentContext, signOptions.format, credential).then((signed) => signed.encoded)))),
            };
        }
        if (signOptions.format === core_1.ClaimFormat.SdJwtVc) {
            if (credentialConfiguration.format !== shared_1.OpenId4VciCredentialFormatProfile.SdJwtVc &&
                credentialConfiguration.format !== shared_1.OpenId4VciCredentialFormatProfile.SdJwtDc) {
                throw new core_1.CredoError(`Invalid credential format returned by sign options. Expected '${core_1.ClaimFormat.SdJwtVc}', received '${signOptions.format}'.`);
            }
            if (!signOptions.credentials.every((c) => c.payload.vct === credentialConfiguration.vct)) {
                throw new core_1.CredoError(`One or more vct values of the offered credential(s) do not match the vct of the requested credential. Offered ${Array.from(new Set(signOptions.credentials.map((c) => `'${c.payload.vct}'`))).join(', ')} Requested '${credentialConfiguration.vct}'.`);
            }
            const sdJwtVcApi = agentContext.dependencyManager.resolve(core_1.SdJwtVcApi);
            return {
                format: credentialConfiguration.format,
                credentials: await Promise.all(signOptions.credentials.map((credential) => sdJwtVcApi
                    .sign({
                    ...credential,
                    // Set header type based on the oid4vci format
                    headerType: credentialConfiguration.format,
                })
                    .then((signed) => signed.compact))),
            };
        }
        if (signOptions.format === core_1.ClaimFormat.MsoMdoc) {
            if (signOptions.format !== credentialConfiguration.format) {
                throw new core_1.CredoError(`Invalid credential format returned by sign options. Expected '${credentialConfiguration.format}', received '${signOptions.format}'.`);
            }
            if (!signOptions.credentials.every((c) => c.docType === credentialConfiguration.doctype)) {
                throw new core_1.CredoError(`One or more doctype values of the offered credential(s) do not match the doctype of the requested credential. Offered ${Array.from(new Set(signOptions.credentials.map((c) => `'${c.docType}'`))).join(', ')} Requested '${credentialConfiguration.doctype}'.`);
            }
            const mdocApi = agentContext.dependencyManager.resolve(core_1.MdocApi);
            return {
                format: shared_1.OpenId4VciCredentialFormatProfile.MsoMdoc,
                credentials: await Promise.all(signOptions.credentials.map((credential) => mdocApi.sign(credential).then((signed) => signed.base64Url))),
            };
        }
        throw new core_1.CredoError(`Unsupported credential format ${signOptions.format}`);
    }
    async signW3cCredential(agentContext, format, options) {
        const publicJwk = await (0, utils_1.getPublicJwkFromDid)(agentContext, options.verificationMethod);
        if (format === core_1.ClaimFormat.JwtVc) {
            return await this.w3cCredentialService.signCredential(agentContext, {
                format: core_1.ClaimFormat.JwtVc,
                credential: options.credential,
                verificationMethod: options.verificationMethod,
                alg: publicJwk.signatureAlgorithm,
            });
        }
        const proofType = (0, utils_1.getProofTypeFromPublicJwk)(agentContext, publicJwk);
        return await this.w3cCredentialService.signCredential(agentContext, {
            format: core_1.ClaimFormat.LdpVc,
            credential: options.credential,
            verificationMethod: options.verificationMethod,
            proofType: proofType,
        });
    }
};
exports.OpenId4VcIssuerService = OpenId4VcIssuerService;
exports.OpenId4VcIssuerService = OpenId4VcIssuerService = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [core_1.W3cCredentialService,
        OpenId4VcIssuerModuleConfig_1.OpenId4VcIssuerModuleConfig,
        repository_1.OpenId4VcIssuerRepository,
        repository_1.OpenId4VcIssuanceSessionRepository])
], OpenId4VcIssuerService);
//# sourceMappingURL=OpenId4VcIssuerService.js.map