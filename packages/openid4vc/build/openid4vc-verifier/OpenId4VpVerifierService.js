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
exports.OpenId4VpVerifierService = void 0;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const oauth2_1 = require("@openid4vc/oauth2");
const openid4vp_1 = require("@openid4vc/openid4vp");
const callbacks_1 = require("../shared/callbacks");
const router_1 = require("../shared/router");
const transactionData_1 = require("../shared/transactionData");
const utils_1 = require("../shared/utils");
const OpenId4VcVerificationSessionState_1 = require("./OpenId4VcVerificationSessionState");
const OpenId4VcVerifierEvents_1 = require("./OpenId4VcVerifierEvents");
const OpenId4VcVerifierModuleConfig_1 = require("./OpenId4VcVerifierModuleConfig");
const repository_1 = require("./repository");
/**
 * @internal
 */
let OpenId4VpVerifierService = class OpenId4VpVerifierService {
    constructor(logger, w3cCredentialService, openId4VcVerifierRepository, config, openId4VcVerificationSessionRepository) {
        this.logger = logger;
        this.w3cCredentialService = w3cCredentialService;
        this.openId4VcVerifierRepository = openId4VcVerifierRepository;
        this.config = config;
        this.openId4VcVerificationSessionRepository = openId4VcVerificationSessionRepository;
    }
    getOpenid4vpVerifier(agentContext) {
        const callbacks = (0, callbacks_1.getOid4vcCallbacks)(agentContext);
        const openid4vpClient = new openid4vp_1.Openid4vpVerifier({ callbacks });
        return openid4vpClient;
    }
    async createAuthorizationRequest(agentContext, options) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const nonce = core_2.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 }));
        const state = core_2.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 }));
        const responseMode = options.responseMode ?? 'direct_post.jwt';
        const isDcApiRequest = responseMode === 'dc_api' || responseMode === 'dc_api.jwt';
        const version = options.version ?? 'v1.draft24';
        if (version === 'v1.draft21' && isDcApiRequest) {
            throw new core_2.CredoError(`OpenID4VP version '${version}' cannot be used with responseMode '${options.responseMode}'. Use version 'v1.draft24' instead.`);
        }
        if (version === 'v1.draft21' && options.transactionData) {
            throw new core_2.CredoError(`OpenID4VP version '${version}' cannot be used with transactionData. Use version 'v1.draft24' instead.`);
        }
        if (version === 'v1.draft21' && options.dcql) {
            throw new core_2.CredoError(`OpenID4VP version '${version}' cannot be used with dcql. Use version 'v1.draft24' instead.`);
        }
        // Check to prevent direct_post from being used with mDOC
        const hasMdocRequest = options.presentationExchange?.definition.input_descriptors.some((i) => i.format?.mso_mdoc) ||
            options.dcql?.query.credentials.some((c) => c.format === 'mso_mdoc');
        if (responseMode === 'direct_post' && hasMdocRequest) {
            throw new core_2.CredoError("Unable to create authorization request with response mode 'direct_post' containing mDOC credentials. ISO 18013-7 requires the usage of response mode 'direct_post.jwt', and needs parameters from the encrypted response header to verify the mDOC sigature.");
        }
        if (options.verifierAttestations) {
            const hasValidCredentialIdsForDcql = options?.dcql?.query.credentials.every(({ id }) => options.verifierAttestations?.every((va) => va.credential_ids?.includes(id))) ?? true;
            if (!hasValidCredentialIdsForDcql) {
                throw new core_2.CredoError('Dcql is used as query language and verifier attestations were provided, but the dcql query used credential ids that are not supported by the verifier attestations');
            }
            const hasValidCredentialIdsForPex = options?.presentationExchange?.definition.input_descriptors.every(({ id }) => options.verifierAttestations?.every((va) => va.credential_ids?.includes(id)));
            if (!hasValidCredentialIdsForPex) {
                throw new core_2.CredoError('Presentation Exchange is used as query language and verifier attestations were provided, but the presentation exchange query used credential ids that are not supported by the verifier attestations');
            }
        }
        const authorizationRequestId = core_2.utils.uuid();
        // We include the `session=` in the url so we can still easily
        // find the session an encrypted response
        const authorizationResponseUrl = `${(0, core_2.joinUriParts)(this.config.baseUrl, [options.verifier.verifierId, this.config.authorizationEndpoint])}?session=${authorizationRequestId}`;
        const jwtIssuer = options.requestSigner.method === 'none'
            ? undefined
            : options.requestSigner.method === 'x5c'
                ? await (0, utils_1.requestSignerToJwtIssuer)(agentContext, {
                    ...options.requestSigner,
                    issuer: authorizationResponseUrl,
                })
                : await (0, utils_1.requestSignerToJwtIssuer)(agentContext, options.requestSigner);
        let clientIdScheme;
        let clientId;
        if (!jwtIssuer) {
            if (!isDcApiRequest) {
                throw new Error("requestSigner method 'none' is only supported for response mode 'dc_api' and 'dc_api.jwt'");
            }
            clientIdScheme = 'web-origin';
            clientId = undefined;
        }
        else if (jwtIssuer?.method === 'x5c') {
            const leafCertificate = core_2.X509Service.getLeafCertificate(agentContext, { certificateChain: jwtIssuer.x5c });
            if (leafCertificate.sanDnsNames.includes((0, core_2.getDomainFromUrl)(jwtIssuer.issuer))) {
                clientIdScheme = 'x509_san_dns';
                clientId = (0, core_2.getDomainFromUrl)(jwtIssuer.issuer);
            }
            else {
                throw new core_2.CredoError(`With jwtIssuer method 'x5c' the jwtIssuer's 'issuer' field must match a sanDnsName (FQDN) in the leaf x509 chain's leaf certificate.`);
            }
        }
        else if (jwtIssuer?.method === 'did') {
            clientId = jwtIssuer.didUrl.split('#')[0];
            clientIdScheme = 'did';
        }
        else {
            throw new core_2.CredoError(`Unsupported jwt issuer method '${options.requestSigner.method}'. Only 'did' and 'x5c' are supported.`);
        }
        // We always use shortened URIs currently
        const hostedAuthorizationRequestUri = !isDcApiRequest
            ? (0, core_2.joinUriParts)(this.config.baseUrl, [
                options.verifier.verifierId,
                this.config.authorizationRequestEndpoint,
                authorizationRequestId,
            ])
            : // No hosted request needed when using DC API
                undefined;
        const client_id = 
        // For did/https and draft 21 the client id has no special prefix
        clientIdScheme === 'did' || clientIdScheme === 'https' || version === 'v1.draft21'
            ? clientId
            : `${clientIdScheme}:${clientId}`;
        // for did the client_id is same in draft 21 and 24 so we could support both at the same time
        const legacyClientIdScheme = version === 'v1.draft21' && clientIdScheme !== 'web-origin' ? clientIdScheme : undefined;
        const client_metadata = await this.getClientMetadata(agentContext, {
            responseMode,
            verifier: options.verifier,
            authorizationResponseUrl,
            version,
        });
        const requestParamsBase = {
            nonce,
            presentation_definition: options.presentationExchange?.definition,
            dcql_query: options.dcql?.query,
            transaction_data: options.transactionData?.map((entry) => core_2.JsonEncoder.toBase64URL(entry)),
            response_mode: responseMode,
            response_type: 'vp_token',
            client_metadata,
            verifier_attestations: options.verifierAttestations,
        };
        const openid4vpVerifier = this.getOpenid4vpVerifier(agentContext);
        const authorizationRequest = await openid4vpVerifier.createOpenId4vpAuthorizationRequest({
            jar: jwtIssuer
                ? {
                    jwtSigner: jwtIssuer,
                    requestUri: hostedAuthorizationRequestUri,
                    expiresInSeconds: this.config.authorizationRequestExpiresInSeconds,
                }
                : undefined,
            authorizationRequestPayload: requestParamsBase.response_mode === 'dc_api.jwt' || requestParamsBase.response_mode === 'dc_api'
                ? {
                    ...requestParamsBase,
                    // No client_id for unsigned requests
                    client_id: jwtIssuer ? client_id : undefined,
                    response_mode: requestParamsBase.response_mode,
                    expected_origins: options.expectedOrigins,
                }
                : {
                    ...requestParamsBase,
                    response_mode: requestParamsBase.response_mode,
                    client_id: client_id,
                    state,
                    response_uri: authorizationResponseUrl,
                    client_id_scheme: legacyClientIdScheme,
                },
        });
        const verificationSession = new repository_1.OpenId4VcVerificationSessionRecord({
            // Only store payload for unsiged requests
            authorizationRequestPayload: authorizationRequest.jar
                ? undefined
                : authorizationRequest.authorizationRequestPayload,
            authorizationRequestJwt: authorizationRequest.jar?.authorizationRequestJwt,
            authorizationRequestUri: hostedAuthorizationRequestUri,
            authorizationRequestId,
            state: OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestCreated,
            verifierId: options.verifier.verifierId,
            expiresAt: (0, utils_1.addSecondsToDate)(new Date(), this.config.authorizationRequestExpiresInSeconds),
        });
        await this.openId4VcVerificationSessionRepository.save(agentContext, verificationSession);
        this.emitStateChangedEvent(agentContext, verificationSession, null);
        return {
            authorizationRequest: authorizationRequest.authorizationRequest,
            verificationSession,
            authorizationRequestObject: authorizationRequest.authorizationRequestObject,
        };
    }
    getDcqlVerifiedResponse(agentContext, _dcqlQuery, presentations) {
        const dcqlService = agentContext.dependencyManager.resolve(core_2.DcqlService);
        const dcqlQuery = dcqlService.validateDcqlQuery(_dcqlQuery);
        const dcqlPresentationEntries = Object.entries(presentations);
        const dcqlPresentation = Object.fromEntries(dcqlPresentationEntries.map(([credentialId, presentation]) => {
            const queryCredential = dcqlQuery.credentials.find((c) => c.id === credentialId);
            if (!queryCredential) {
                throw new core_2.CredoError(`vp_token contains presentation for credential query id '${credentialId}', but this credential is not present in the dcql query.`);
            }
            return [
                credentialId,
                this.decodePresentation(agentContext, {
                    presentation,
                    format: queryCredential.format === 'mso_mdoc'
                        ? core_1.ClaimFormat.MsoMdoc
                        : queryCredential.format === 'dc+sd-jwt' || queryCredential.format === 'vc+sd-jwt'
                            ? core_1.ClaimFormat.SdJwtVc
                            : core_1.ClaimFormat.JwtVc,
                }),
            ];
        }));
        const dcqlPresentationResult = dcqlService.assertValidDcqlPresentation(dcqlPresentation, dcqlQuery);
        return {
            query: dcqlQuery,
            presentations: dcqlPresentation,
            presentationResult: dcqlPresentationResult,
        };
    }
    async parseAuthorizationResponse(agentContext, options) {
        const openid4vpVerifier = this.getOpenid4vpVerifier(agentContext);
        const { authorizationResponse, verificationSession, origin } = options;
        let parsedAuthorizationResponse = undefined;
        try {
            parsedAuthorizationResponse = await openid4vpVerifier.parseOpenid4vpAuthorizationResponse({
                authorizationResponse,
                origin,
                authorizationRequestPayload: verificationSession.requestPayload,
                callbacks: (0, callbacks_1.getOid4vcCallbacks)(agentContext),
            });
            // FIXME: use JarmMode enum when new release of oid4vp
            if (parsedAuthorizationResponse.jarm && parsedAuthorizationResponse.jarm.type !== openid4vp_1.JarmMode.Encrypted) {
                throw new oauth2_1.Oauth2ServerErrorResponseError({
                    error: oauth2_1.Oauth2ErrorCodes.InvalidRequest,
                    error_description: `Only encrypted JARM responses are supported, received '${parsedAuthorizationResponse.jarm.type}'.`,
                });
            }
            return {
                ...parsedAuthorizationResponse,
                verificationSession,
            };
        }
        catch (error) {
            if (verificationSession?.state === OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestUriRetrieved ||
                verificationSession?.state === OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestCreated) {
                const parsed = openid4vp_1.zOpenid4vpAuthorizationResponse.safeParse(parsedAuthorizationResponse?.authorizationResponsePayload);
                verificationSession.authorizationResponsePayload = parsed.success ? parsed.data : undefined;
                verificationSession.errorMessage = error.message;
                await this.updateState(agentContext, verificationSession, OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.Error);
            }
            throw error;
        }
    }
    async verifyAuthorizationResponse(agentContext, options) {
        const { verificationSession, authorizationResponse, origin } = options;
        const authorizationRequest = options.verificationSession.requestPayload;
        verificationSession.assertState([
            OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestUriRetrieved,
            OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestCreated,
        ]);
        if (verificationSession.expiresAt && Date.now() > verificationSession.expiresAt.getTime()) {
            throw new oauth2_1.Oauth2ServerErrorResponseError({
                error: oauth2_1.Oauth2ErrorCodes.InvalidRequest,
                error_description: 'session expired',
            });
        }
        const result = await this.parseAuthorizationResponse(agentContext, {
            verificationSession,
            authorizationResponse,
            origin,
        });
        let dcqlResponse = undefined;
        let pexResponse = undefined;
        let transactionData = undefined;
        try {
            const parsedClientId = (0, openid4vp_1.getOpenid4vpClientId)({
                responseMode: authorizationRequest.response_mode,
                clientId: authorizationRequest.client_id,
                legacyClientIdScheme: authorizationRequest.client_id_scheme,
                origin: options.origin,
            });
            // If client_id_scheme was used we need to use the legacy client id.
            const clientId = parsedClientId.legacyClientId ?? parsedClientId.clientId;
            const responseUri = (0, openid4vp_1.isOpenid4vpAuthorizationRequestDcApi)(authorizationRequest)
                ? undefined
                : authorizationRequest.response_uri;
            // NOTE: apu is needed for mDOC over OID4VP without DC API
            const mdocGeneratedNonce = result.jarm?.jarmHeader.apu
                ? core_2.TypedArrayEncoder.toUtf8String(core_2.TypedArrayEncoder.fromBase64(result.jarm?.jarmHeader.apu))
                : undefined;
            if (result.type === 'dcql') {
                const dcqlPresentationEntries = Object.entries(result.dcql.presentations);
                if (!authorizationRequest.dcql_query) {
                    throw new core_2.CredoError('Missing required dcql query');
                }
                const dcql = agentContext.dependencyManager.resolve(core_2.DcqlService);
                const dcqlQuery = dcql.validateDcqlQuery(authorizationRequest.dcql_query);
                const presentationVerificationResults = await Promise.all(dcqlPresentationEntries.map(async ([credentialId, presentation]) => {
                    const queryCredential = dcqlQuery.credentials.find((c) => c.id === credentialId);
                    if (!queryCredential) {
                        throw new core_2.CredoError(`vp_token contains presentation for credential query id '${credentialId}', but this credential is not present in the dcql query.`);
                    }
                    return {
                        ...(await this.verifyPresentation(agentContext, {
                            format: queryCredential.format === 'mso_mdoc'
                                ? core_1.ClaimFormat.MsoMdoc
                                : queryCredential.format === 'dc+sd-jwt' || queryCredential.format === 'vc+sd-jwt'
                                    ? core_1.ClaimFormat.SdJwtVc
                                    : core_1.ClaimFormat.JwtVc,
                            nonce: authorizationRequest.nonce,
                            audience: clientId,
                            origin: options.origin,
                            responseUri,
                            mdocGeneratedNonce,
                            verificationSessionId: result.verificationSession.id,
                            presentation,
                        })),
                        credentialId,
                    };
                }));
                const presentations = presentationVerificationResults.reduce((all, p) => {
                    if (p.verified)
                        all[p.credentialId] = p.presentation;
                    return all;
                }, {});
                const presentationResult = dcql.assertValidDcqlPresentation(presentations, dcqlQuery);
                const errorMessages = presentationVerificationResults
                    .map((result, index) => (!result.verified ? `\t- [${index}]: ${result.reason}` : undefined))
                    .filter((i) => i !== undefined);
                if (errorMessages.length > 0) {
                    throw new core_2.CredoError(`One or more presentations failed verification. \n\t${errorMessages.join('\n')}`);
                }
                dcqlResponse = {
                    presentations,
                    presentationResult,
                    query: dcqlQuery,
                };
            }
            if (result.type === 'pex') {
                const pex = agentContext.dependencyManager.resolve(core_2.DifPresentationExchangeService);
                const encodedPresentations = result.pex.presentations;
                const submission = result.pex.presentationSubmission;
                const definition = result.pex.presentationDefinition;
                pex.validatePresentationDefinition(definition);
                pex.validatePresentationSubmission(submission);
                const presentationsArray = Array.isArray(encodedPresentations) ? encodedPresentations : [encodedPresentations];
                const presentationVerificationResults = await Promise.all(presentationsArray.map((presentation) => {
                    return this.verifyPresentation(agentContext, {
                        nonce: authorizationRequest.nonce,
                        audience: clientId,
                        responseUri,
                        mdocGeneratedNonce,
                        verificationSessionId: result.verificationSession.id,
                        presentation,
                        format: this.claimFormatFromEncodedPresentation(presentation),
                        origin: options.origin,
                    });
                }));
                const errorMessages = presentationVerificationResults
                    .map((result, index) => (!result.verified ? `\t- [${index}]: ${result.reason}` : undefined))
                    .filter((i) => i !== undefined);
                if (errorMessages.length > 0) {
                    throw new core_2.CredoError(`One or more presentations failed verification. \n\t${errorMessages.join('\n')}`);
                }
                const verifiablePresentations = presentationVerificationResults
                    .map((p) => (p.verified ? p.presentation : undefined))
                    .filter((p) => p !== undefined);
                pex.validatePresentation(definition, 
                // vp_token MUST not be an array if only one entry
                verifiablePresentations.length === 1 ? verifiablePresentations[0] : verifiablePresentations, submission);
                const descriptors = (0, core_2.extractPresentationsWithDescriptorsFromSubmission)(
                // vp_token MUST not be an array if only one entry
                verifiablePresentations.length === 1 ? verifiablePresentations[0] : verifiablePresentations, submission, definition);
                pexResponse = {
                    definition,
                    descriptors,
                    presentations: verifiablePresentations,
                    submission,
                };
            }
            transactionData = await this.getVerifiedTransactionData(agentContext, {
                authorizationRequest,
                dcql: dcqlResponse,
                presentationExchange: pexResponse,
            });
        }
        catch (error) {
            result.verificationSession.errorMessage = error.message;
            await this.updateState(agentContext, result.verificationSession, OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.Error);
            throw error;
        }
        result.verificationSession.authorizationResponsePayload = result.authorizationResponsePayload;
        await this.updateState(agentContext, result.verificationSession, OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.ResponseVerified);
        return {
            presentationExchange: pexResponse,
            dcql: dcqlResponse,
            transactionData,
            verificationSession: result.verificationSession,
        };
    }
    /**
     * Get the format based on an encoded presentation. This is mostly leveraged for
     * PEX where it's not known based on the request which format to expect
     */
    claimFormatFromEncodedPresentation(presentation) {
        if (typeof presentation === 'object')
            return core_1.ClaimFormat.LdpVc;
        if (presentation.includes('~'))
            return core_1.ClaimFormat.SdJwtVc;
        if (core_2.Jwt.format.test(presentation))
            return core_1.ClaimFormat.JwtVc;
        // Fallback, we tried all other formats
        return core_1.ClaimFormat.MsoMdoc;
    }
    async getVerifiedAuthorizationResponse(agentContext, verificationSession) {
        verificationSession.assertState(OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.ResponseVerified);
        if (!verificationSession.authorizationResponsePayload) {
            throw new core_2.CredoError('No authorization response payload found in the verification session.');
        }
        const authorizationRequestPayload = verificationSession.requestPayload;
        const openid4vpAuthorizationResponsePayload = verificationSession.authorizationResponsePayload;
        const openid4vpVerifier = this.getOpenid4vpVerifier(agentContext);
        const result = openid4vpVerifier.validateOpenid4vpAuthorizationResponsePayload({
            authorizationRequestPayload: verificationSession.requestPayload,
            authorizationResponsePayload: openid4vpAuthorizationResponsePayload,
        });
        let presentationExchange = undefined;
        const dcql = result.type === 'dcql'
            ? this.getDcqlVerifiedResponse(agentContext, authorizationRequestPayload.dcql_query, result.dcql.presentations)
            : undefined;
        if (result.type === 'pex') {
            const presentationDefinition = authorizationRequestPayload.presentation_definition;
            const submission = openid4vpAuthorizationResponsePayload.presentation_submission;
            if (!submission) {
                throw new core_2.CredoError('Unable to extract submission from the response.');
            }
            const verifiablePresentations = result.pex.presentations.map((presentation) => this.decodePresentation(agentContext, {
                presentation,
                format: this.claimFormatFromEncodedPresentation(presentation),
            }));
            presentationExchange = {
                definition: presentationDefinition,
                submission,
                presentations: verifiablePresentations,
                descriptors: (0, core_2.extractPresentationsWithDescriptorsFromSubmission)(
                // vp_token MUST not be an array if only one entry
                verifiablePresentations.length === 1 ? verifiablePresentations[0] : verifiablePresentations, submission, presentationDefinition),
            };
        }
        if (!presentationExchange && !dcql) {
            throw new core_2.CredoError('No presentationExchange or dcql found in the response.');
        }
        const transactionData = await this.getVerifiedTransactionData(agentContext, {
            authorizationRequest: authorizationRequestPayload,
            dcql,
            presentationExchange,
        });
        return {
            presentationExchange,
            dcql,
            transactionData,
            verificationSession,
        };
    }
    async getVerifiedTransactionData(agentContext, { authorizationRequest, presentationExchange, dcql, }) {
        if (!authorizationRequest.transaction_data)
            return undefined;
        const openid4vpVerifier = this.getOpenid4vpVerifier(agentContext);
        const transactionDataHashesCredentials = {};
        // Extract presentations with credentialId
        const idToCredential = dcql
            ? Object.entries(dcql.presentations)
            : (presentationExchange?.descriptors.map((descriptor) => [descriptor.descriptor.id, descriptor.presentation]) ?? []);
        for (const [credentialId, presentation] of idToCredential) {
            // Only SD-JWT VC supported for now
            if (presentation.claimFormat === core_1.ClaimFormat.SdJwtVc) {
                transactionDataHashesCredentials[credentialId] = (0, transactionData_1.getSdJwtVcTransactionDataHashes)(presentation);
            }
        }
        // Verify the transaction data
        const transactionData = await openid4vpVerifier.verifyTransactionData({
            credentials: transactionDataHashesCredentials,
            transactionData: authorizationRequest.transaction_data,
        });
        return transactionData.map(({ hash, hashAlg, credentialHashIndex, credentialId, transactionDataEntry }) => ({
            credentialHashIndex,
            credentialId,
            encoded: transactionDataEntry.encoded,
            decoded: transactionDataEntry.transactionData,
            transactionDataIndex: transactionDataEntry.transactionDataIndex,
            hash,
            // We only support the values supported by Credo hasher, so it can't be any other value than those.
            hashAlg: hashAlg,
        }));
    }
    async getAllVerifiers(agentContext) {
        return this.openId4VcVerifierRepository.getAll(agentContext);
    }
    async getVerifierByVerifierId(agentContext, verifierId) {
        return this.openId4VcVerifierRepository.getByVerifierId(agentContext, verifierId);
    }
    async updateVerifier(agentContext, verifier) {
        return this.openId4VcVerifierRepository.update(agentContext, verifier);
    }
    async createVerifier(agentContext, options) {
        const openId4VcVerifier = new repository_1.OpenId4VcVerifierRecord({
            verifierId: options?.verifierId ?? core_2.utils.uuid(),
            clientMetadata: options?.clientMetadata,
        });
        await this.openId4VcVerifierRepository.save(agentContext, openId4VcVerifier);
        await (0, router_1.storeActorIdForContextCorrelationId)(agentContext, openId4VcVerifier.verifierId);
        return openId4VcVerifier;
    }
    async findVerificationSessionsByQuery(agentContext, query, queryOptions) {
        return this.openId4VcVerificationSessionRepository.findByQuery(agentContext, query, queryOptions);
    }
    async getVerificationSessionById(agentContext, verificationSessionId) {
        return this.openId4VcVerificationSessionRepository.getById(agentContext, verificationSessionId);
    }
    async getClientMetadata(agentContext, options) {
        const { responseMode, verifier } = options;
        const signatureSuiteRegistry = agentContext.resolve(core_2.SignatureSuiteRegistry);
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const supportedAlgs = (0, utils_1.getSupportedJwaSignatureAlgorithms)(agentContext);
        const supportedMdocAlgs = supportedAlgs.filter(core_2.isMdocSupportedSignatureAlgorithm);
        const supportedProofTypes = signatureSuiteRegistry.supportedProofTypes;
        let jarmEncryptionJwk;
        if ((0, openid4vp_1.isJarmResponseMode)(responseMode)) {
            const key = await kms.createKey({ type: { crv: 'P-256', kty: 'EC' } });
            jarmEncryptionJwk = { ...key.publicJwk, use: 'enc' };
        }
        const jarmClientMetadata = jarmEncryptionJwk
            ? {
                jwks: { keys: [jarmEncryptionJwk] },
                authorization_encrypted_response_alg: 'ECDH-ES',
                // FIXME: we need to support dynamically setting this by letting the wallet post their supported values
                // by posting to `request_uri`
                // For ISO 18013-7 compliance we use A128GCM. But otherwise we use the value described in HAIP.
                authorization_encrypted_response_enc: options.version === 'v1.draft24' ? 'A128GCM' : 'A256GCM',
            }
            : undefined;
        return {
            ...jarmClientMetadata,
            ...verifier.clientMetadata,
            response_types_supported: ['vp_token'],
            vp_formats: {
                mso_mdoc: {
                    alg: supportedMdocAlgs,
                },
                jwt_vc: {
                    alg: supportedAlgs,
                },
                jwt_vc_json: {
                    alg: supportedAlgs,
                },
                jwt_vp_json: {
                    alg: supportedAlgs,
                },
                jwt_vp: {
                    alg: supportedAlgs,
                },
                ldp_vc: {
                    proof_type: supportedProofTypes,
                },
                ldp_vp: {
                    proof_type: supportedProofTypes,
                },
                'vc+sd-jwt': {
                    'kb-jwt_alg_values': supportedAlgs,
                    'sd-jwt_alg_values': supportedAlgs,
                },
                'dc+sd-jwt': {
                    'kb-jwt_alg_values': supportedAlgs,
                    'sd-jwt_alg_values': supportedAlgs,
                },
            },
        };
    }
    decodePresentation(agentContext, options) {
        const { presentation, format } = options;
        if (format === core_1.ClaimFormat.SdJwtVc) {
            if (typeof presentation !== 'string') {
                throw new core_2.CredoError(`Expected vp_token entry for format ${format} to be of type string`);
            }
            const sdJwtVcApi = agentContext.dependencyManager.resolve(core_2.SdJwtVcApi);
            const sdJwtVc = sdJwtVcApi.fromCompact(presentation);
            return sdJwtVc;
        }
        if (format === core_1.ClaimFormat.MsoMdoc) {
            if (typeof presentation !== 'string') {
                throw new core_2.CredoError(`Expected vp_token entry for format ${format} to be of type string`);
            }
            const mdocDeviceResponse = core_2.MdocDeviceResponse.fromBase64Url(presentation);
            return mdocDeviceResponse;
        }
        if (core_1.ClaimFormat.JwtVc) {
            if (typeof presentation !== 'string') {
                throw new core_2.CredoError(`Expected vp_token entry for format ${format} to be of type string`);
            }
            return core_2.W3cJwtVerifiablePresentation.fromSerializedJwt(presentation);
        }
        return core_2.JsonTransformer.fromJSON(presentation, core_2.W3cJsonLdVerifiablePresentation);
    }
    async verifyPresentation(agentContext, options) {
        const x509Config = agentContext.dependencyManager.resolve(core_2.X509ModuleConfig);
        const sdJwtVcApi = agentContext.dependencyManager.resolve(core_2.SdJwtVcApi);
        const { presentation, format } = options;
        try {
            this.logger.trace('Presentation response', core_2.JsonTransformer.toJSON(presentation));
            let isValid;
            let cause = undefined;
            let verifiablePresentation;
            if (format === core_1.ClaimFormat.SdJwtVc) {
                if (typeof presentation !== 'string') {
                    throw new core_2.CredoError(`Expected vp_token entry for format ${format} to be of type string`);
                }
                const sdJwtVc = sdJwtVcApi.fromCompact(presentation);
                const jwt = core_2.Jwt.fromSerializedJwt(presentation.split('~')[0]);
                const certificateChain = (0, core_2.extractX509CertificatesFromJwt)(jwt);
                let trustedCertificates = undefined;
                if (certificateChain && x509Config.getTrustedCertificatesForVerification) {
                    trustedCertificates = await x509Config.getTrustedCertificatesForVerification(agentContext, {
                        certificateChain,
                        verification: {
                            type: 'credential',
                            credential: sdJwtVc,
                            openId4VcVerificationSessionId: options.verificationSessionId,
                        },
                    });
                }
                if (!trustedCertificates) {
                    // We also take from the config here to avoid the callback being called again
                    trustedCertificates = x509Config.trustedCertificates ?? [];
                }
                const verificationResult = await sdJwtVcApi.verify({
                    compactSdJwtVc: presentation,
                    keyBinding: {
                        audience: options.audience,
                        nonce: options.nonce,
                    },
                    trustedCertificates,
                });
                isValid = verificationResult.verification.isValid;
                cause = verificationResult.isValid ? undefined : verificationResult.error;
                verifiablePresentation = sdJwtVc;
            }
            else if (format === core_1.ClaimFormat.MsoMdoc) {
                if (typeof presentation !== 'string') {
                    throw new core_2.CredoError('Expected vp_token entry for format mso_mdoc to be of type string');
                }
                const mdocDeviceResponse = core_2.MdocDeviceResponse.fromBase64Url(presentation);
                if (mdocDeviceResponse.documents.length === 0) {
                    throw new core_2.CredoError('mdoc device response does not contain any mdocs');
                }
                const deviceResponses = mdocDeviceResponse.splitIntoSingleDocumentResponses();
                for (const deviceResponseIndex in deviceResponses) {
                    const mdocDeviceResponse = deviceResponses[deviceResponseIndex];
                    const document = mdocDeviceResponse.documents[0];
                    const certificateChain = document.issuerSignedCertificateChain.map((cert) => core_2.X509Certificate.fromRawCertificate(cert));
                    const trustedCertificates = await x509Config.getTrustedCertificatesForVerification?.(agentContext, {
                        certificateChain,
                        verification: {
                            type: 'credential',
                            credential: document,
                            openId4VcVerificationSessionId: options.verificationSessionId,
                        },
                    });
                    let sessionTranscriptOptions;
                    if (options.origin) {
                        sessionTranscriptOptions = {
                            type: 'openId4VpDcApi',
                            clientId: options.audience,
                            verifierGeneratedNonce: options.nonce,
                            origin: options.origin,
                        };
                    }
                    else {
                        if (!options.mdocGeneratedNonce || !options.responseUri) {
                            throw new core_2.CredoError('mdocGeneratedNonce and responseUri are required for mdoc openid4vp session transcript calculation');
                        }
                        sessionTranscriptOptions = {
                            type: 'openId4Vp',
                            clientId: options.audience,
                            mdocGeneratedNonce: options.mdocGeneratedNonce,
                            responseUri: options.responseUri,
                            verifierGeneratedNonce: options.nonce,
                        };
                    }
                    await mdocDeviceResponse.verify(agentContext, {
                        sessionTranscriptOptions,
                        trustedCertificates,
                    });
                }
                // TODO: extract transaction data hashes once https://github.com/openid/OpenID4VP/pull/330 is resolved
                isValid = true;
                verifiablePresentation = mdocDeviceResponse;
            }
            else if (format === core_1.ClaimFormat.JwtVc) {
                if (typeof presentation !== 'string') {
                    throw new core_2.CredoError(`Expected vp_token entry for format ${format} to be of type string`);
                }
                verifiablePresentation = core_2.W3cJwtVerifiablePresentation.fromSerializedJwt(presentation);
                const verificationResult = await this.w3cCredentialService.verifyPresentation(agentContext, {
                    presentation,
                    challenge: options.nonce,
                    domain: options.audience,
                });
                isValid = verificationResult.isValid;
                cause = verificationResult.error;
            }
            else {
                verifiablePresentation = core_2.JsonTransformer.fromJSON(presentation, core_2.W3cJsonLdVerifiablePresentation);
                const verificationResult = await this.w3cCredentialService.verifyPresentation(agentContext, {
                    presentation: verifiablePresentation,
                    challenge: options.nonce,
                    domain: options.audience,
                });
                isValid = verificationResult.isValid;
                cause = verificationResult.error;
            }
            if (!isValid) {
                throw new core_2.CredoError(`Error occured during verification of presentation.${cause ? ` ${cause.message}` : ''}`, {
                    cause,
                });
            }
            return {
                verified: true,
                presentation: verifiablePresentation,
            };
        }
        catch (error) {
            agentContext.config.logger.warn('Error occurred during verification of presentation', {
                error,
            });
            return {
                verified: false,
                reason: error.message,
            };
        }
    }
    /**
     * Update the record to a new state and emit an state changed event. Also updates the record
     * in storage.
     */
    async updateState(agentContext, verificationSession, newState) {
        agentContext.config.logger.debug(`Updating openid4vc verification session record ${verificationSession.id} to state ${newState} (previous=${verificationSession.state})`);
        const previousState = verificationSession.state;
        verificationSession.state = newState;
        await this.openId4VcVerificationSessionRepository.update(agentContext, verificationSession);
        this.emitStateChangedEvent(agentContext, verificationSession, previousState);
    }
    emitStateChangedEvent(agentContext, verificationSession, previousState) {
        const eventEmitter = agentContext.dependencyManager.resolve(core_2.EventEmitter);
        eventEmitter.emit(agentContext, {
            type: OpenId4VcVerifierEvents_1.OpenId4VcVerifierEvents.VerificationSessionStateChanged,
            payload: {
                verificationSession: verificationSession.clone(),
                previousState,
            },
        });
    }
};
exports.OpenId4VpVerifierService = OpenId4VpVerifierService;
exports.OpenId4VpVerifierService = OpenId4VpVerifierService = __decorate([
    (0, core_2.injectable)(),
    __param(0, (0, core_2.inject)(core_2.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [Object, core_2.W3cCredentialService,
        repository_1.OpenId4VcVerifierRepository,
        OpenId4VcVerifierModuleConfig_1.OpenId4VcVerifierModuleConfig,
        repository_1.OpenId4VcVerificationSessionRepository])
], OpenId4VpVerifierService);
//# sourceMappingURL=OpenId4VpVerifierService.js.map