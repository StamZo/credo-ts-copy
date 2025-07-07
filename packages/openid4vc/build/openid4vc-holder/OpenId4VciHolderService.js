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
exports.OpenId4VciHolderService = void 0;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const oauth2_1 = require("@openid4vc/oauth2");
const openid4vci_1 = require("@openid4vc/openid4vci");
const openid4vci_2 = require("@openid4vc/openid4vci");
const shared_1 = require("../shared");
const callbacks_1 = require("../shared/callbacks");
const issuerMetadataUtils_1 = require("../shared/issuerMetadataUtils");
const utils_1 = require("../shared/utils");
const OpenId4VciHolderServiceOptions_1 = require("./OpenId4VciHolderServiceOptions");
let OpenId4VciHolderService = class OpenId4VciHolderService {
    constructor(logger, w3cCredentialService) {
        this.w3cCredentialService = w3cCredentialService;
        this.logger = logger;
    }
    async resolveIssuerMetadata(agentContext, credentialIssuer) {
        const client = this.getClient(agentContext);
        const metadata = await client.resolveIssuerMetadata(credentialIssuer);
        this.logger.debug('fetched credential issuer metadata', { metadata });
        return metadata;
    }
    async resolveCredentialOffer(agentContext, credentialOffer) {
        const client = this.getClient(agentContext);
        const credentialOfferObject = await client.resolveCredentialOffer(credentialOffer);
        const metadata = await client.resolveIssuerMetadata(credentialOfferObject.credential_issuer);
        this.logger.debug('fetched credential offer and issuer metadata', { metadata, credentialOfferObject });
        const credentialConfigurationsSupported = (0, issuerMetadataUtils_1.getOfferedCredentials)(credentialOfferObject.credential_configuration_ids, client.getKnownCredentialConfigurationsSupported(metadata.credentialIssuer), 
        // We only filter for known configurations, so it's ok if not found
        { ignoreNotFoundIds: true });
        return {
            metadata,
            offeredCredentialConfigurations: credentialConfigurationsSupported,
            credentialOfferPayload: credentialOfferObject,
        };
    }
    async resolveAuthorizationRequest(agentContext, resolvedCredentialOffer, authCodeFlowOptions) {
        const { clientId, redirectUri } = authCodeFlowOptions;
        const { metadata, credentialOfferPayload, offeredCredentialConfigurations } = resolvedCredentialOffer;
        const oauth2Client = this.getOauth2Client(agentContext);
        const client = this.getClient(agentContext, {
            clientId: authCodeFlowOptions.clientId,
            clientAttestation: authCodeFlowOptions.walletAttestationJwt,
        });
        // If scope is not provided, we request scope for all offered credentials
        const scope = authCodeFlowOptions.scope ?? (0, issuerMetadataUtils_1.getScopesFromCredentialConfigurationsSupported)(offeredCredentialConfigurations);
        if (!credentialOfferPayload.grants?.[oauth2_1.authorizationCodeGrantIdentifier]) {
            throw new core_2.CredoError(`Provided credential offer does not include the 'authorization_code' grant.`);
        }
        const authorizationCodeGrant = credentialOfferPayload.grants[oauth2_1.authorizationCodeGrantIdentifier];
        const authorizationServer = (0, openid4vci_1.determineAuthorizationServerForCredentialOffer)({
            issuerMetadata: metadata,
            grantAuthorizationServer: authorizationCodeGrant.authorization_server,
        });
        const authorizationServerMetadata = (0, oauth2_1.getAuthorizationServerMetadataFromList)(metadata.authorizationServers, authorizationServer);
        // TODO: should we allow key reuse between dpop and wallet attestation?
        const isDpopSupported = oauth2Client.isDpopSupported({ authorizationServerMetadata });
        const dpop = isDpopSupported.supported
            ? await this.getDpopOptions(agentContext, {
                dpopSigningAlgValuesSupported: isDpopSupported.dpopSigningAlgValuesSupported,
            })
            : undefined;
        const authorizationResult = await client.initiateAuthorization({
            clientId,
            issuerMetadata: metadata,
            credentialOffer: credentialOfferPayload,
            scope: scope.join(' '),
            redirectUri,
            dpop,
        });
        if (authorizationResult.authorizationFlow === openid4vci_2.AuthorizationFlow.PresentationDuringIssuance) {
            return {
                authorizationFlow: openid4vci_2.AuthorizationFlow.PresentationDuringIssuance,
                openid4vpRequestUrl: authorizationResult.openid4vpRequestUrl,
                authSession: authorizationResult.authSession,
                // FIXME: return dpop result from this endpoint (dpop nonce)
                dpop: dpop
                    ? {
                        alg: dpop.signer.alg,
                        jwk: core_2.Kms.PublicJwk.fromUnknown(dpop.signer.publicJwk),
                    }
                    : undefined,
            };
        }
        // Normal Oauth2Redirect flow
        return {
            authorizationFlow: openid4vci_2.AuthorizationFlow.Oauth2Redirect,
            codeVerifier: authorizationResult.pkce?.codeVerifier,
            authorizationRequestUrl: authorizationResult.authorizationRequestUrl,
            // FIXME: return dpop result from this endpoint (dpop nonce)
            dpop: dpop
                ? {
                    alg: dpop.signer.alg,
                    jwk: core_2.Kms.PublicJwk.fromUnknown(dpop.signer.publicJwk),
                }
                : undefined,
        };
    }
    async sendNotification(agentContext, options) {
        const client = this.getClient(agentContext);
        await client.sendNotification({
            accessToken: options.accessToken,
            dpop: options.dpop
                ? await this.getDpopOptions(agentContext, {
                    ...options.dpop,
                    dpopSigningAlgValuesSupported: [options.dpop.alg],
                })
                : undefined,
            issuerMetadata: options.metadata,
            notification: {
                event: options.notificationEvent,
                notificationId: options.notificationId,
            },
        });
    }
    async getDpopOptions(agentContext, { jwk, dpopSigningAlgValuesSupported, nonce, }) {
        const kms = agentContext.resolve(core_2.Kms.KeyManagementApi);
        if (jwk) {
            const alg = dpopSigningAlgValuesSupported.find((alg) => jwk.supportedSignatureAlgorithms.includes(alg));
            if (!alg) {
                throw new core_2.CredoError(`No supported dpop signature algorithms found in dpop_signing_alg_values_supported '${dpopSigningAlgValuesSupported.join(', ')}' matching jwk ${jwk.jwkTypehumanDescription}`);
            }
            return {
                signer: {
                    method: 'jwk',
                    alg,
                    publicJwk: jwk.toJson(),
                },
                nonce,
            };
        }
        const alg = dpopSigningAlgValuesSupported.find((alg) => {
            try {
                core_2.Kms.PublicJwk.supportedPublicJwkClassForSignatureAlgorithm(alg);
                return true;
            }
            catch {
                return false;
            }
        });
        if (!alg) {
            throw new core_2.CredoError(`No supported dpop signature algorithms found in dpop_signing_alg_values_supported '${dpopSigningAlgValuesSupported.join(', ')}'`);
        }
        const key = await kms.createKeyForSignatureAlgorithm({ algorithm: alg });
        return {
            signer: {
                method: 'jwk',
                alg,
                publicJwk: key.publicJwk,
            },
            nonce,
        };
    }
    async retrieveAuthorizationCodeUsingPresentation(agentContext, options) {
        const client = this.getClient(agentContext, {
            clientAttestation: options.walletAttestationJwt,
        });
        const dpop = options.dpop
            ? await this.getDpopOptions(agentContext, {
                ...options.dpop,
                dpopSigningAlgValuesSupported: [options.dpop.alg],
            })
            : undefined;
        const { authorizationChallengeResponse, dpop: dpopResult } = await client.retrieveAuthorizationCodeUsingPresentation({
            authSession: options.authSession,
            presentationDuringIssuanceSession: options.presentationDuringIssuanceSession,
            credentialOffer: options.resolvedCredentialOffer.credentialOfferPayload,
            issuerMetadata: options.resolvedCredentialOffer.metadata,
            dpop,
        });
        return {
            authorizationCode: authorizationChallengeResponse.authorization_code,
            dpop: dpop
                ? {
                    ...dpopResult,
                    alg: dpop.signer.alg,
                    jwk: core_2.Kms.PublicJwk.fromUnknown(dpop.signer.publicJwk),
                }
                : undefined,
        };
    }
    async requestAccessToken(agentContext, options) {
        const { metadata, credentialOfferPayload } = options.resolvedCredentialOffer;
        const client = this.getClient(agentContext, {
            clientAttestation: options.walletAttestationJwt,
            clientId: 'clientId' in options ? options.clientId : undefined,
        });
        const oauth2Client = this.getOauth2Client(agentContext);
        const authorizationServer = options.code
            ? credentialOfferPayload.grants?.authorization_code?.authorization_server
            : credentialOfferPayload.grants?.[oauth2_1.preAuthorizedCodeGrantIdentifier]?.authorization_server;
        const authorizationServerMetadata = (0, oauth2_1.getAuthorizationServerMetadataFromList)(metadata.authorizationServers, authorizationServer ?? metadata.authorizationServers[0].issuer);
        const isDpopSupported = oauth2Client.isDpopSupported({
            authorizationServerMetadata,
        });
        const dpop = options.dpop
            ? await this.getDpopOptions(agentContext, {
                ...options.dpop,
                dpopSigningAlgValuesSupported: [options.dpop.alg],
            })
            : // We should be careful about this case. It could just be the user didn't correctly
                // provide the DPoP from the auth response. In whic case different DPoP will be used
                // However it might be that they only use DPoP for the token request (esp in pre-auth case)
                isDpopSupported.supported
                    ? await this.getDpopOptions(agentContext, {
                        dpopSigningAlgValuesSupported: isDpopSupported.dpopSigningAlgValuesSupported,
                    })
                    : undefined;
        const result = options.code
            ? await client.retrieveAuthorizationCodeAccessTokenFromOffer({
                issuerMetadata: metadata,
                credentialOffer: credentialOfferPayload,
                authorizationCode: options.code,
                dpop,
                pkceCodeVerifier: options.codeVerifier,
                redirectUri: options.redirectUri,
            })
            : await client.retrievePreAuthorizedCodeAccessTokenFromOffer({
                credentialOffer: credentialOfferPayload,
                issuerMetadata: metadata,
                dpop,
                txCode: options.txCode,
            });
        return {
            ...result,
            dpop: dpop
                ? {
                    ...result.dpop,
                    alg: dpop.signer.alg,
                    jwk: core_2.Kms.PublicJwk.fromUnknown(dpop.signer.publicJwk),
                }
                : undefined,
        };
    }
    async acceptCredentialOffer(agentContext, options) {
        const { resolvedCredentialOffer, acceptCredentialOfferOptions } = options;
        const { metadata, offeredCredentialConfigurations } = resolvedCredentialOffer;
        const { credentialConfigurationIds, credentialBindingResolver, verifyCredentialStatus, allowedProofOfPossessionSignatureAlgorithms, } = acceptCredentialOfferOptions;
        const client = this.getClient(agentContext);
        if (credentialConfigurationIds?.length === 0) {
            throw new core_2.CredoError(`'credentialConfigurationIds' may not be empty`);
        }
        const receivedCredentials = [];
        let cNonce = options.cNonce;
        let dpopNonce = options.dpop?.nonce;
        const credentialConfigurationsToRequest = credentialConfigurationIds?.map((id) => {
            if (!offeredCredentialConfigurations[id]) {
                const offeredCredentialIds = Object.keys(offeredCredentialConfigurations).join(', ');
                throw new core_2.CredoError(`Credential to request '${id}' is not present in offered credentials. Offered credentials are ${offeredCredentialIds}`);
            }
            return [id, offeredCredentialConfigurations[id]];
        }) ?? Object.entries(offeredCredentialConfigurations);
        // If we don't have a nonce yet, we need to first get one
        if (!cNonce) {
            // Best option is to use nonce endpoint (draft 14+)
            if (metadata.credentialIssuer.nonce_endpoint) {
                const nonceResponse = await client.requestNonce({ issuerMetadata: metadata });
                cNonce = nonceResponse.c_nonce;
            }
            else {
                // Otherwise we will send a dummy request
                await client
                    .retrieveCredentials({
                    issuerMetadata: metadata,
                    accessToken: options.accessToken,
                    credentialConfigurationId: credentialConfigurationsToRequest[0][0],
                    dpop: options.dpop
                        ? await this.getDpopOptions(agentContext, {
                            ...options.dpop,
                            nonce: dpopNonce,
                            dpopSigningAlgValuesSupported: [options.dpop.alg],
                        })
                        : undefined,
                })
                    .catch((e) => {
                    if (e instanceof openid4vci_2.Openid4vciRetrieveCredentialsError && e.response.credentialErrorResponseResult?.success) {
                        cNonce = e.response.credentialErrorResponseResult.data.c_nonce;
                    }
                });
            }
        }
        if (!cNonce) {
            throw new core_2.CredoError('No cNonce provided and unable to acquire cNonce from the credential issuer');
        }
        for (const [offeredCredentialId, offeredCredentialConfiguration] of credentialConfigurationsToRequest) {
            const proofs = await this.getCredentialRequestOptions(agentContext, {
                allowedProofOfPossesionAlgorithms: allowedProofOfPossessionSignatureAlgorithms ?? (0, utils_1.getSupportedJwaSignatureAlgorithms)(agentContext),
                metadata,
                offeredCredential: {
                    id: offeredCredentialId,
                    configuration: offeredCredentialConfiguration,
                },
                clientId: options.clientId,
                // We already checked whether nonce exists above
                cNonce: cNonce,
                credentialBindingResolver,
            });
            this.logger.debug('Generated credential request proof of possesion', { proofs });
            const proof = 
            // Draft 11 ALWAYS uses proof
            (metadata.originalDraftVersion === openid4vci_2.Openid4vciDraftVersion.Draft11 ||
                // Draft 14 allows both proof and proofs. Try to use proof when it makes to improve interoperability
                (metadata.originalDraftVersion === openid4vci_2.Openid4vciDraftVersion.Draft14 &&
                    metadata.credentialIssuer.batch_credential_issuance === undefined)) &&
                proofs.jwt?.length === 1
                ? {
                    proof_type: 'jwt',
                    jwt: proofs.jwt[0],
                }
                : undefined;
            const { credentialResponse, dpop } = await client.retrieveCredentials({
                issuerMetadata: metadata,
                accessToken: options.accessToken,
                credentialConfigurationId: offeredCredentialId,
                dpop: options.dpop
                    ? await this.getDpopOptions(agentContext, {
                        ...options.dpop,
                        nonce: dpopNonce,
                        dpopSigningAlgValuesSupported: [options.dpop.alg],
                    })
                    : undefined,
                // Only include proofs if we don't add proof
                proofs: !proof ? proofs : undefined,
                proof,
            });
            // Set new nonce values
            cNonce = credentialResponse.c_nonce;
            dpopNonce = dpop?.nonce;
            // Create credential, but we don't store it yet (only after the user has accepted the credential)
            const credential = await this.handleCredentialResponse(agentContext, credentialResponse, {
                verifyCredentialStatus: verifyCredentialStatus ?? false,
                credentialIssuerMetadata: metadata.credentialIssuer,
                format: offeredCredentialConfiguration.format,
                credentialConfigurationId: offeredCredentialId,
                credentialConfiguration: offeredCredentialConfiguration,
            });
            this.logger.debug('received credential', credential.credentials.map((c) => c instanceof core_2.Mdoc ? { issuerSignedNamespaces: c.issuerSignedNamespaces, base64Url: c.base64Url } : c));
            receivedCredentials.push(credential);
        }
        return {
            credentials: receivedCredentials,
            dpop: options.dpop
                ? {
                    ...options.dpop,
                    nonce: dpopNonce,
                }
                : undefined,
            cNonce,
        };
    }
    /**
     * Get the options for the credential request. Internally this will resolve the proof of possession
     * requirements, and based on that it will call the proofOfPossessionVerificationMethodResolver to
     * allow the caller to select the correct verification method based on the requirements for the proof
     * of possession.
     */
    async getCredentialRequestOptions(agentContext, options) {
        const dids = agentContext.resolve(core_1.DidsApi);
        const { allowedProofOfPossesionAlgorithms, offeredCredential } = options;
        const { configuration, id: configurationId } = offeredCredential;
        const supportedJwaSignatureAlgorithms = (0, utils_1.getSupportedJwaSignatureAlgorithms)(agentContext);
        const possibleProofOfPossessionSignatureAlgorithms = allowedProofOfPossesionAlgorithms
            ? allowedProofOfPossesionAlgorithms.filter((algorithm) => supportedJwaSignatureAlgorithms.includes(algorithm))
            : supportedJwaSignatureAlgorithms;
        if (possibleProofOfPossessionSignatureAlgorithms.length === 0) {
            throw new core_2.CredoError([
                'No possible proof of possession signature algorithm found.',
                `Signature algorithms supported by the Agent '${supportedJwaSignatureAlgorithms.join(', ')}'`,
                `Allowed Signature algorithms '${allowedProofOfPossesionAlgorithms?.join(', ')}'`,
            ].join('\n'));
        }
        const { proofTypes, supportedDidMethods, supportsAllDidMethods, supportsJwk } = this.getProofOfPossessionRequirements(agentContext, {
            credentialToRequest: options.offeredCredential,
            metadata: options.metadata,
            possibleProofOfPossessionSignatureAlgorithms,
        });
        const format = configuration.format;
        const supportsAnyMethod = supportedDidMethods !== undefined || supportsAllDidMethods || supportsJwk;
        const issuerMaxBatchSize = options.metadata.credentialIssuer.batch_credential_issuance?.batch_size ?? 1;
        // Now we need to determine how the credential will be bound to us
        const credentialBinding = await options.credentialBindingResolver({
            agentContext,
            credentialFormat: format,
            credentialConfigurationId: configurationId,
            credentialConfiguration: configuration,
            metadata: options.metadata,
            issuerMaxBatchSize,
            proofTypes,
            supportsAllDidMethods,
            supportedDidMethods,
            supportsJwk,
        });
        const client = this.getClient(agentContext);
        // Make sure the issuer of proof of possession is valid according to openid issuer metadata
        if (credentialBinding.method === 'did') {
            if (!proofTypes.jwt) {
                throw new core_2.CredoError(`JWT proof type is not supported for configuration '${configurationId}', which is required for did based credential binding.`);
            }
            if (proofTypes.jwt.keyAttestationsRequired) {
                throw new core_2.CredoError(`Credential binding returned list of DID urls, but credential configuration '${configurationId}' requires key attestations. Key attestations and DIDs are not compatible.`);
            }
            if (credentialBinding.didUrls.length > issuerMaxBatchSize) {
                throw new core_2.CredoError(`Issuer supports issuing a batch of maximum ${issuerMaxBatchSize} credential(s). Binding resolver returned ${credentialBinding.didUrls.length} DID urls. Make sure the returned value does not exceed the max batch issuance.`);
            }
            if (credentialBinding.didUrls.length === 0) {
                throw new core_2.CredoError('Credential binding with method did returned empty didUrls list');
            }
            const firstDid = (0, core_2.parseDid)(credentialBinding.didUrls[0]);
            if (!credentialBinding.didUrls.every((didUrl) => (0, core_2.parseDid)(didUrl).method === firstDid.method)) {
                throw new core_2.CredoError('Expected all did urls for binding method did to use the same did method');
            }
            if (!supportsAllDidMethods &&
                // If supportedDidMethods is undefined, it means the issuer didn't include the binding methods in the metadata
                // The user can still select a verification method, but we can't validate it
                supportedDidMethods !== undefined &&
                !supportedDidMethods.find((supportedDidMethod) => firstDid.did.startsWith(supportedDidMethod) && supportsAnyMethod)) {
                // Test binding method
                const supportedDidMethodsString = supportedDidMethods.join(', ');
                throw new core_2.CredoError(`Resolved credential binding for proof of possession uses did method '${firstDid.method}', but issuer only supports '${supportedDidMethodsString}'`);
            }
            const { publicJwk: firstKey } = await dids.resolveVerificationMethodFromCreatedDidRecord(firstDid.didUrl);
            const algorithm = proofTypes.jwt.supportedSignatureAlgorithms.find((algorithm) => firstKey.supportedSignatureAlgorithms.includes(algorithm));
            if (!algorithm) {
                throw new core_2.CredoError(`Credential binding returned did url that points to key '${firstKey.jwkTypehumanDescription}' that supports signature algorithms ${firstKey.supportedSignatureAlgorithms.join(', ')}, but one of '${proofTypes.jwt.supportedSignatureAlgorithms.join(', ')}' was expected`);
            }
            // This will/should leverage the caching, so it's ok to resolve the did here
            const keys = await Promise.all(credentialBinding.didUrls.map(async (didUrl, index) => index === 0
                ? // We already fetched the first did
                    { jwk: firstKey, didUrl: firstDid.didUrl }
                : { jwk: (await dids.resolveVerificationMethodFromCreatedDidRecord(didUrl)).publicJwk, didUrl }));
            if (!keys.every((key) => core_2.Kms.assymetricJwkKeyTypeMatches(key.jwk.toJson(), firstKey.toJson()))) {
                throw new core_2.CredoError('Expected all did urls to point to the same key type');
            }
            return {
                jwt: await Promise.all(keys.map((key) => client
                    .createCredentialRequestJwtProof({
                    credentialConfigurationId: configurationId,
                    issuerMetadata: options.metadata,
                    signer: {
                        method: 'did',
                        didUrl: key.didUrl,
                        alg: algorithm,
                        kid: key.jwk.keyId,
                    },
                    nonce: options.cNonce,
                    clientId: options.clientId,
                })
                    .then(({ jwt }) => jwt))),
            };
        }
        if (credentialBinding.method === 'jwk') {
            if (!supportsJwk && supportsAnyMethod) {
                throw new core_2.CredoError(`Resolved credential binding for proof of possession uses jwk, but openid issuer does not support 'jwk' or 'cose_key' cryptographic binding method`);
            }
            if (!proofTypes.jwt) {
                throw new core_2.CredoError(`JWT proof type is not supported for configuration '${configurationId}', which is required for jwk based credential binding.`);
            }
            if (proofTypes.jwt.keyAttestationsRequired) {
                throw new core_2.CredoError(`Credential binding returned list of JWK keys, but credential configuration '${configurationId}' requires key attestations. Return a key attestation with binding method 'attestation'.`);
            }
            if (credentialBinding.keys.length > issuerMaxBatchSize) {
                throw new core_2.CredoError(`Issuer supports issuing a batch of maximum ${issuerMaxBatchSize} credential(s). Binding resolver returned ${credentialBinding.keys.length} keys. Make sure the returned value does not exceed the max batch issuance.`);
            }
            if (credentialBinding.keys.length === 0) {
                throw new core_2.CredoError('Credential binding with method jwk returned empty keys list');
            }
            const firstJwk = credentialBinding.keys[0];
            if (!credentialBinding.keys.every((key) => core_2.Kms.assymetricJwkKeyTypeMatches(key.toJson(), firstJwk.toJson()))) {
                throw new core_2.CredoError('Expected all keys for binding method jwk to use the same key type');
            }
            const algorithm = proofTypes.jwt.supportedSignatureAlgorithms.find((algorithm) => firstJwk.supportedSignatureAlgorithms.includes(algorithm));
            if (!algorithm) {
                throw new core_2.CredoError(`Credential binding returned jwk that points to key '${firstJwk.jwkTypehumanDescription}' that supports signature algorithms ${firstJwk.supportedSignatureAlgorithms.join(', ')}, but one of '${proofTypes.jwt.supportedSignatureAlgorithms.join(', ')}' was expected`);
            }
            return {
                jwt: await Promise.all(credentialBinding.keys.map((jwk) => client
                    .createCredentialRequestJwtProof({
                    credentialConfigurationId: configurationId,
                    issuerMetadata: options.metadata,
                    signer: {
                        method: 'jwk',
                        publicJwk: jwk.toJson(),
                        alg: algorithm,
                    },
                    nonce: options.cNonce,
                    clientId: options.clientId,
                })
                    .then(({ jwt }) => jwt))),
            };
        }
        if (credentialBinding.method === 'attestation') {
            const { payload } = (0, openid4vci_1.parseKeyAttestationJwt)({ keyAttestationJwt: credentialBinding.keyAttestationJwt });
            // TODO: check client_id matches in payload
            if (payload.attested_keys.length > issuerMaxBatchSize) {
                throw new core_2.CredoError(`Issuer supports issuing a batch of maximum ${issuerMaxBatchSize} credential(s). Binding resolver returned key attestation with ${payload.attested_keys.length} attested keys. Make sure the returned value does not exceed the max batch issuance.`);
            }
            // TODO: check nonce matches cNonce
            if (proofTypes.attestation && payload.nonce) {
                // If attestation is supported and the attestation contains a nonce, we can use the attestation directly
                return {
                    attestation: [credentialBinding.keyAttestationJwt],
                };
            }
            if (proofTypes.jwt) {
                const jwk = core_2.Kms.PublicJwk.fromUnknown(payload.attested_keys[0]);
                return {
                    jwt: [
                        await client
                            .createCredentialRequestJwtProof({
                            credentialConfigurationId: configurationId,
                            issuerMetadata: options.metadata,
                            signer: {
                                method: 'jwk',
                                publicJwk: payload.attested_keys[0],
                                // TODO: we should probably use the 'alg' from the jwk
                                alg: jwk.supportedSignatureAlgorithms[0],
                            },
                            keyAttestationJwt: credentialBinding.keyAttestationJwt,
                            nonce: options.cNonce,
                            clientId: options.clientId,
                        })
                            .then(({ jwt }) => jwt),
                    ],
                };
            }
            throw new core_2.CredoError(`Unable to create credential request proofs. Configuration supports 'attestation' proof type, but attestation did not contain a 'nonce' value`);
        }
        // @ts-expect-error currently if/else if exhaustive, but once we add new option it will give ts error
        throw new core_2.CredoError(`Unsupported credential binding method ${credentialBinding.method}`);
    }
    /**
     * Get the requirements for creating the proof of possession. Based on the allowed
     * credential formats, the allowed proof of possession signature algorithms, and the
     * credential type, this method will select the best credential format and signature
     * algorithm to use, based on the order of preference.
     */
    getProofOfPossessionRequirements(agentContext, options) {
        const { credentialToRequest, possibleProofOfPossessionSignatureAlgorithms, metadata } = options;
        const { configuration, id: configurationId } = credentialToRequest;
        if (!OpenId4VciHolderServiceOptions_1.openId4VciSupportedCredentialFormats.includes(configuration.format)) {
            throw new core_2.CredoError([
                `Requested credential with format '${credentialToRequest.configuration.format}',`,
                `for the credential with id '${credentialToRequest.id},`,
                `but the wallet only supports the following formats '${OpenId4VciHolderServiceOptions_1.openId4VciSupportedCredentialFormats.join(', ')}'`,
            ].join('\n'));
        }
        // For each of the supported algs, find the key types, then find the proof types
        const signatureSuiteRegistry = agentContext.dependencyManager.resolve(core_2.SignatureSuiteRegistry);
        let proofTypesSupported = configuration.proof_types_supported;
        if (!proofTypesSupported) {
            // For draft above 11 we do not allow no proof_type (we do not support no key binding for now)
            if (metadata.originalDraftVersion !== openid4vci_2.Openid4vciDraftVersion.Draft11) {
                throw new core_2.CredoError(`Credential configuration '${configurationId}' does not specifcy proof_types_supported. Credentials not bound to keys are not supported at the moment`);
            }
            // For draft 11 we fall back to jwt proof type
            proofTypesSupported = {
                jwt: {
                    proof_signing_alg_values_supported: possibleProofOfPossessionSignatureAlgorithms,
                },
            };
        }
        const proofTypes = {
            jwt: undefined,
            attestation: undefined,
        };
        for (const [proofType, proofTypeConfig] of Object.entries(proofTypesSupported)) {
            if (proofType !== 'jwt' && proofType !== 'attestation')
                continue;
            let signatureAlgorithms = [];
            const proofSigningAlgsSupported = proofTypeConfig?.proof_signing_alg_values_supported;
            if (proofSigningAlgsSupported === undefined) {
                // If undefined, it means the issuer didn't include the cryptographic suites in the metadata
                // We just guess that the first one is supported
                signatureAlgorithms = options.possibleProofOfPossessionSignatureAlgorithms;
            }
            else {
                switch (credentialToRequest.configuration.format) {
                    case shared_1.OpenId4VciCredentialFormatProfile.JwtVcJson:
                    case shared_1.OpenId4VciCredentialFormatProfile.JwtVcJsonLd:
                    case shared_1.OpenId4VciCredentialFormatProfile.SdJwtVc:
                    case shared_1.OpenId4VciCredentialFormatProfile.SdJwtDc:
                    case shared_1.OpenId4VciCredentialFormatProfile.MsoMdoc:
                        signatureAlgorithms = options.possibleProofOfPossessionSignatureAlgorithms.filter((signatureAlgorithm) => proofSigningAlgsSupported.includes(signatureAlgorithm));
                        break;
                    // FIXME: this is wrong, as the proof type is separate from the credential signing alg
                    // But there might be some draft 11 logic that depends on this, can be removed soon
                    case shared_1.OpenId4VciCredentialFormatProfile.LdpVc:
                        signatureAlgorithms = options.possibleProofOfPossessionSignatureAlgorithms.filter((signatureAlgorithm) => {
                            try {
                                const jwkClass = core_2.Kms.PublicJwk.supportedPublicJwkClassForSignatureAlgorithm(signatureAlgorithm);
                                const matchingSuites = signatureSuiteRegistry.getAllByPublicJwkType(jwkClass);
                                if (matchingSuites.length === 0)
                                    return false;
                                return proofSigningAlgsSupported.includes(matchingSuites[0].proofType);
                            }
                            catch {
                                return false;
                            }
                        });
                        break;
                    default:
                        throw new core_2.CredoError('Unsupported credential format.');
                }
            }
            proofTypes[proofType] = {
                supportedSignatureAlgorithms: signatureAlgorithms,
                keyAttestationsRequired: proofTypeConfig.key_attestations_required
                    ? {
                        keyStorage: proofTypeConfig.key_attestations_required.key_storage,
                        userAuthentication: proofTypeConfig.key_attestations_required.user_authentication,
                    }
                    : undefined,
            };
        }
        const { jwt, attestation } = proofTypes;
        if (!jwt && !attestation) {
            const supported = Object.keys(proofTypesSupported).join(', ');
            throw new core_2.CredoError(`Unsupported proof type(s) ${supported}. Supported proof type(s) are: jwt, attestation`);
        }
        const issuerSupportedBindingMethods = credentialToRequest.configuration.cryptographic_binding_methods_supported;
        const supportsAllDidMethods = issuerSupportedBindingMethods?.includes('did') ?? false;
        const supportedDidMethods = issuerSupportedBindingMethods?.filter((method) => method.startsWith('did:'));
        // The cryptographic_binding_methods_supported describe the cryptographic key material that the issued Credential is bound to.
        const supportsCoseKey = issuerSupportedBindingMethods?.includes('cose_key') ?? false;
        const supportsJwk = issuerSupportedBindingMethods?.includes('jwk') || supportsCoseKey;
        return {
            proofTypes,
            supportedDidMethods,
            supportsAllDidMethods,
            supportsJwk,
        };
    }
    async handleCredentialResponse(agentContext, credentialResponse, options) {
        const { verifyCredentialStatus, credentialConfigurationId, credentialConfiguration } = options;
        this.logger.debug('Credential response', credentialResponse);
        const credentials = credentialResponse.credentials ?? (credentialResponse.credential ? [credentialResponse.credential] : undefined);
        if (!credentials) {
            throw new core_2.CredoError(`Credential response returned neither 'credentials' nor 'credential' parameter.`);
        }
        const notificationId = credentialResponse.notification_id;
        const format = options.format;
        if (format === shared_1.OpenId4VciCredentialFormatProfile.SdJwtVc || format === shared_1.OpenId4VciCredentialFormatProfile.SdJwtDc) {
            if (!credentials.every((c) => typeof c === 'string')) {
                throw new core_2.CredoError(`Received credential(s) of format ${format}, but not all credential(s) are a string. ${JSON.stringify(credentials)}`);
            }
            const sdJwtVcApi = agentContext.dependencyManager.resolve(core_2.SdJwtVcApi);
            const verificationResults = await Promise.all(credentials.map((compactSdJwtVc, index) => sdJwtVcApi.verify({
                compactSdJwtVc,
                // Only load and verify it for the first instance
                fetchTypeMetadata: index === 0,
            })));
            if (!verificationResults.every((result) => result.isValid)) {
                agentContext.config.logger.error('Failed to validate credential(s)', { verificationResults });
                throw new core_2.CredoError(`Failed to validate sd-jwt-vc credentials. Results = ${JSON.stringify(verificationResults)}`);
            }
            return {
                credentials: verificationResults.map((result) => result.sdJwtVc),
                notificationId,
                credentialConfigurationId,
                credentialConfiguration,
            };
        }
        if (options.format === shared_1.OpenId4VciCredentialFormatProfile.JwtVcJson ||
            options.format === shared_1.OpenId4VciCredentialFormatProfile.JwtVcJsonLd) {
            if (!credentials.every((c) => typeof c === 'string')) {
                throw new core_2.CredoError(`Received credential(s) of format ${format}, but not all credential(s) are a string. ${JSON.stringify(credentials)}`);
            }
            const result = await Promise.all(credentials.map(async (c) => {
                const credential = core_2.W3cJwtVerifiableCredential.fromSerializedJwt(c);
                const result = await this.w3cCredentialService.verifyCredential(agentContext, {
                    credential,
                    verifyCredentialStatus,
                });
                return { credential, result };
            }));
            if (!result.every((c) => c.result.isValid)) {
                agentContext.config.logger.error('Failed to validate credentials', { result });
                throw new core_2.CredoError(`Failed to validate credential, error = ${result
                    .map((e) => e.result.error?.message)
                    .filter(Boolean)
                    .join(', ')}`);
            }
            return {
                credentials: result.map((r) => r.credential),
                notificationId,
                credentialConfigurationId,
                credentialConfiguration,
            };
        }
        if (format === shared_1.OpenId4VciCredentialFormatProfile.LdpVc) {
            if (!credentials.every((c) => typeof c === 'object')) {
                throw new core_2.CredoError(`Received credential(s) of format ${format}, but not all credential(s) are an object. ${JSON.stringify(credentials)}`);
            }
            const result = await Promise.all(credentials.map(async (c) => {
                const credential = core_2.W3cJsonLdVerifiableCredential.fromJson(c);
                const result = await this.w3cCredentialService.verifyCredential(agentContext, {
                    credential,
                    verifyCredentialStatus,
                });
                return { credential, result };
            }));
            if (!result.every((c) => c.result.isValid)) {
                agentContext.config.logger.error('Failed to validate credentials', { result });
                throw new core_2.CredoError(`Failed to validate credential, error = ${result
                    .map((e) => e.result.error?.message)
                    .filter(Boolean)
                    .join(', ')}`);
            }
            return {
                credentials: result.map((r) => r.credential),
                notificationId,
                credentialConfigurationId,
                credentialConfiguration,
            };
        }
        if (format === shared_1.OpenId4VciCredentialFormatProfile.MsoMdoc) {
            if (!credentials.every((c) => typeof c === 'string')) {
                throw new core_2.CredoError(`Received credential(s) of format ${format}, but not all credential(s) are a string. ${JSON.stringify(credentials)}`);
            }
            const mdocApi = agentContext.dependencyManager.resolve(core_2.MdocApi);
            const result = await Promise.all(credentials.map(async (credential) => {
                const mdoc = core_2.Mdoc.fromBase64Url(credential);
                const result = await mdocApi.verify(mdoc, {});
                return {
                    result,
                    mdoc,
                };
            }));
            if (!result.every((r) => r.result.isValid)) {
                agentContext.config.logger.error('Failed to validate credentials', { result });
                throw new core_2.CredoError(`Failed to validate mdoc credential(s). \n - ${result
                    .map((r, i) => (r.result.isValid ? undefined : `(${i}) ${r.result.error}`))
                    .filter(Boolean)
                    .join('\n - ')}`);
            }
            return {
                credentials: result.map((c) => c.mdoc),
                notificationId,
                credentialConfigurationId,
                credentialConfiguration,
            };
        }
        throw new core_2.CredoError(`Unsupported credential format ${options.format}`);
    }
    getClient(agentContext, { clientAttestation, clientId } = {}) {
        const callbacks = (0, callbacks_1.getOid4vcCallbacks)(agentContext);
        return new openid4vci_2.Openid4vciClient({
            callbacks: {
                ...callbacks,
                clientAuthentication: (options) => {
                    const { authorizationServerMetadata, url, body } = options;
                    const oauth2Client = this.getOauth2Client(agentContext);
                    const clientAttestationSupported = oauth2Client.isClientAttestationSupported({
                        authorizationServerMetadata,
                    });
                    // Client attestations
                    if (clientAttestation && clientAttestationSupported) {
                        return (0, oauth2_1.clientAuthenticationClientAttestationJwt)({
                            clientAttestationJwt: clientAttestation,
                            callbacks,
                        })(options);
                    }
                    // Pre auth flow
                    if (url === authorizationServerMetadata.token_endpoint &&
                        authorizationServerMetadata['pre-authorized_grant_anonymous_access_supported'] &&
                        body.grant_type === oauth2_1.preAuthorizedCodeGrantIdentifier) {
                        return (0, oauth2_1.clientAuthenticationAnonymous)()(options);
                    }
                    // Just a client id (no auth)
                    if (clientId) {
                        return (0, oauth2_1.clientAuthenticationNone)({ clientId })(options);
                    }
                    // NOTE: we fall back to anonymous authentication for pre-auth for now, as there's quite some
                    // issuers that do not have pre-authorized_grant_anonymous_access_supported defined
                    if (url === authorizationServerMetadata.token_endpoint &&
                        body.grant_type === oauth2_1.preAuthorizedCodeGrantIdentifier) {
                        return (0, oauth2_1.clientAuthenticationAnonymous)()(options);
                    }
                    // TODO: We should still look at auth_methods_supported
                    // If there is an auth session for the auth challenge endpoint, we don't have to include the client_id
                    if (url === authorizationServerMetadata.authorization_challenge_endpoint && body.auth_session) {
                        return (0, oauth2_1.clientAuthenticationAnonymous)()(options);
                    }
                    throw new core_2.CredoError('Unable to perform client authentication.');
                },
            },
        });
    }
    getOauth2Client(agentContext) {
        return new oauth2_1.Oauth2Client({
            callbacks: (0, callbacks_1.getOid4vcCallbacks)(agentContext),
        });
    }
};
exports.OpenId4VciHolderService = OpenId4VciHolderService;
exports.OpenId4VciHolderService = OpenId4VciHolderService = __decorate([
    (0, core_2.injectable)(),
    __param(0, (0, core_2.inject)(core_2.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [Object, core_2.W3cCredentialService])
], OpenId4VciHolderService);
//# sourceMappingURL=OpenId4VciHolderService.js.map