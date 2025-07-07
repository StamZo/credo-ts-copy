"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyVdrIndyDidRegistrar = void 0;
const anoncreds_1 = require("@credo-ts/anoncreds");
const core_1 = require("@credo-ts/core");
const indy_vdr_shared_1 = require("@hyperledger/indy-vdr-shared");
const error_1 = require("../error");
const IndyVdrPoolService_1 = require("../pool/IndyVdrPoolService");
const didIndyUtil_1 = require("./didIndyUtil");
const didSovUtil_1 = require("./didSovUtil");
class IndyVdrIndyDidRegistrar {
    constructor() {
        this.supportedMethods = ['indy'];
    }
    didCreateActionResult({ namespace, didAction, did, }) {
        return {
            jobId: did,
            didDocumentMetadata: {},
            didRegistrationMetadata: {
                didIndyNamespace: namespace,
            },
            didState: didAction,
        };
    }
    didCreateFailedResult({ reason, }) {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: reason,
            },
        };
    }
    didCreateFinishedResult({ did, didDocument, namespace, }) {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {
                didIndyNamespace: namespace,
            },
            didState: {
                state: 'finished',
                did,
                didDocument,
            },
        };
    }
    async parseInput(agentContext, options) {
        if (options.options.endorsedTransaction) {
            if (!options.did || typeof options.did !== 'string') {
                return {
                    status: 'error',
                    reason: 'If endorsedTransaction is provided, a DID must also be provided',
                };
            }
            const { namespace, namespaceIdentifier } = (0, anoncreds_1.parseIndyDid)(options.did);
            // endorser did from the transaction
            const endorserNamespaceIdentifier = JSON.parse(options.options.endorsedTransaction.nymRequest).identifier;
            return {
                status: 'ok',
                type: 'endorsedTransaction',
                endorsedTransaction: options.options.endorsedTransaction,
                did: options.did,
                namespace,
                namespaceIdentifier,
                endorserNamespaceIdentifier,
            };
        }
        const endorserDid = options.options.endorserDid;
        const { namespace: endorserNamespace, namespaceIdentifier: endorserNamespaceIdentifier } = (0, anoncreds_1.parseIndyDid)(endorserDid);
        const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
        const _verificationKey = options.options.keyId
            ? await kms.getPublicKey({ keyId: options.options.keyId })
            : (await kms.createKey({
                type: {
                    kty: 'OKP',
                    crv: 'Ed25519',
                },
            })).publicJwk;
        if (_verificationKey.kty !== 'OKP' || _verificationKey.crv !== 'Ed25519') {
            return {
                status: 'error',
                reason: `keyId must point to an Ed25519 key, but found ${core_1.Kms.getJwkHumanDescription(_verificationKey)}`,
            };
        }
        const verificationKey = core_1.Kms.PublicJwk.fromPublicJwk(_verificationKey);
        // Create a new key and calculate did according to the rules for indy did method
        const buffer = core_1.Hasher.hash(verificationKey.publicKey.publicKey, 'sha-256');
        const namespaceIdentifier = core_1.TypedArrayEncoder.toBase58(buffer.slice(0, 16));
        const did = `did:indy:${endorserNamespace}:${namespaceIdentifier}`;
        return {
            status: 'ok',
            type: 'create',
            did,
            verificationKey,
            endorserDid: options.options.endorserDid,
            alias: options.options.alias,
            role: options.options.role,
            services: options.options.services,
            useEndpointAttrib: options.options.useEndpointAttrib,
            namespaceIdentifier,
            namespace: endorserNamespace,
            endorserNamespaceIdentifier,
        };
    }
    async saveDidRecord(agentContext, did, didDocument, keys) {
        // Save the did so we know we created it and can issue with it
        const didRecord = new core_1.DidRecord({
            did,
            role: core_1.DidDocumentRole.Created,
            didDocument,
            keys,
        });
        const didRepository = agentContext.dependencyManager.resolve(core_1.DidRepository);
        await didRepository.save(agentContext, didRecord);
    }
    createDidDocument(did, verificationKey, services, useEndpointAttrib) {
        const verificationKeyBase58 = core_1.TypedArrayEncoder.toBase58(verificationKey.publicKey.publicKey);
        // Create base did document
        const didDocumentBuilder = (0, didIndyUtil_1.indyDidDocumentFromDid)(did, verificationKeyBase58);
        let diddocContent = undefined;
        // Add services if object was passed
        if (services) {
            for (const item of services) {
                const prependDidIfNotPresent = (id) => {
                    return id.startsWith('#') ? `${did}${id}` : id;
                };
                // Prepend the did to the service id if it is not already there
                item.id = prependDidIfNotPresent(item.id);
                // TODO: should we also prepend the did to routingKeys?
                if (item instanceof core_1.DidCommV1Service) {
                    item.recipientKeys = item.recipientKeys.map(prependDidIfNotPresent);
                }
                didDocumentBuilder.addService(item);
            }
            const commTypes = [core_1.IndyAgentService.type, core_1.DidCommV1Service.type, core_1.NewDidCommV2Service.type, core_1.DidCommV2Service.type];
            const serviceTypes = new Set(services.map((item) => item.type));
            const keyAgreementId = `${did}#key-agreement-1`;
            // If there is at least a communication service, add the key agreement key
            if (commTypes.some((type) => serviceTypes.has(type))) {
                didDocumentBuilder
                    .addContext('https://w3id.org/security/suites/x25519-2019/v1')
                    .addVerificationMethod({
                    controller: did,
                    id: keyAgreementId,
                    publicKeyBase58: (0, didIndyUtil_1.createKeyAgreementKey)(verificationKeyBase58),
                    type: 'X25519KeyAgreementKey2019',
                })
                    .addKeyAgreement(keyAgreementId);
            }
            // FIXME: it doesn't seem this context exists?
            // If there is a DIDComm V2 service, add context
            if (serviceTypes.has(core_1.NewDidCommV2Service.type) || serviceTypes.has(core_1.DidCommV2Service.type)) {
                didDocumentBuilder.addContext('https://didcomm.org/messaging/contexts/v2');
            }
            if (!useEndpointAttrib) {
                // create diddocContent parameter based on the diff between the base and the resulting DID Document
                diddocContent = (0, didIndyUtil_1.didDocDiff)(didDocumentBuilder.build().toJSON(), (0, didIndyUtil_1.indyDidDocumentFromDid)(did, verificationKeyBase58).build().toJSON());
            }
        }
        // Build did document
        const didDocument = didDocumentBuilder.build();
        return {
            diddocContent,
            didDocument,
        };
    }
    // FIXME: we need to completely revamp this logic, it's overly complex
    // We might even want to look at ditching the whole generic DIDs api ...
    async create(agentContext, options) {
        try {
            const res = await this.parseInput(agentContext, options);
            if (res.status === 'error')
                return this.didCreateFailedResult({ reason: res.reason });
            const did = res.did;
            const pool = agentContext.dependencyManager.resolve(IndyVdrPoolService_1.IndyVdrPoolService).getPoolForNamespace(res.namespace);
            let nymRequest;
            let didDocument;
            let attribRequest;
            let verificationKey = undefined;
            if (res.type === 'endorsedTransaction') {
                const { nymRequest: _nymRequest, attribRequest: _attribRequest } = res.endorsedTransaction;
                nymRequest = new indy_vdr_shared_1.CustomRequest({ customRequest: _nymRequest });
                attribRequest = _attribRequest ? new indy_vdr_shared_1.CustomRequest({ customRequest: _attribRequest }) : undefined;
            }
            else {
                const { services, useEndpointAttrib, alias, endorserNamespaceIdentifier, namespaceIdentifier, did, role, endorserDid, namespace, } = res;
                verificationKey = res.verificationKey;
                const { didDocument: _didDocument, diddocContent } = this.createDidDocument(did, verificationKey, services, useEndpointAttrib);
                didDocument = _didDocument;
                const didRegisterSigningKey = options.options.endorserMode === 'internal'
                    ? await (0, didIndyUtil_1.verificationPublicJwkForIndyDid)(agentContext, options.options.endorserDid)
                    : undefined;
                nymRequest = await this.createRegisterDidWriteRequest({
                    agentContext,
                    pool,
                    signingKey: didRegisterSigningKey,
                    submitterNamespaceIdentifier: endorserNamespaceIdentifier,
                    namespaceIdentifier,
                    verificationKey,
                    alias,
                    diddocContent,
                    role,
                });
                if (services && useEndpointAttrib) {
                    const endpoints = (0, didSovUtil_1.endpointsAttribFromServices)(services);
                    attribRequest = await this.createSetDidEndpointsRequest({
                        agentContext,
                        pool,
                        signingKey: verificationKey,
                        endorserDid: options.options.endorserMode === 'external' ? endorserDid : undefined,
                        unqualifiedDid: namespaceIdentifier,
                        endpoints,
                    });
                }
                if (options.options.endorserMode === 'external') {
                    // We already save the did record, including the link between kms key id and did key id
                    await this.saveDidRecord(agentContext, did, didDocument, [
                        {
                            didDocumentRelativeKeyId: '#verkey',
                            kmsKeyId: verificationKey.keyId,
                        },
                    ]);
                    const didAction = {
                        state: 'action',
                        action: 'endorseIndyTransaction',
                        endorserDid: endorserDid,
                        nymRequest: nymRequest.body,
                        attribRequest: attribRequest?.body,
                        did: did,
                    };
                    return this.didCreateActionResult({ namespace, didAction, did });
                }
            }
            await this.registerPublicDid(agentContext, pool, nymRequest);
            if (attribRequest)
                await this.setEndpointsForDid(agentContext, pool, attribRequest);
            // DID Document is undefined if this method is called based on external endorsement
            // but in that case the did document is already saved
            if (verificationKey && didDocument) {
                await this.saveDidRecord(agentContext, did, didDocument, [
                    {
                        didDocumentRelativeKeyId: '#verkey',
                        kmsKeyId: verificationKey.keyId,
                    },
                ]);
            }
            didDocument = didDocument ?? (await (0, didIndyUtil_1.buildDidDocument)(agentContext, pool, did));
            return this.didCreateFinishedResult({ did, didDocument, namespace: res.namespace });
        }
        catch (error) {
            agentContext.config.logger.error('Error creating indy did', {
                error,
            });
            return this.didCreateFailedResult({
                reason: `unknownError: ${error.message}`,
            });
        }
    }
    async update() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notImplemented: updating did:indy not implemented yet',
            },
        };
    }
    async deactivate() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notImplemented: deactivating did:indy not implemented yet',
            },
        };
    }
    async createRegisterDidWriteRequest(options) {
        const { agentContext, pool, submitterNamespaceIdentifier, namespaceIdentifier, verificationKey, alias, signingKey, role, } = options;
        // FIXME: Add diddocContent when supported by indy-vdr
        if (options.diddocContent) {
            throw new error_1.IndyVdrError('diddocContent is not yet supported');
        }
        const request = new indy_vdr_shared_1.NymRequest({
            submitterDid: submitterNamespaceIdentifier,
            dest: namespaceIdentifier,
            verkey: core_1.TypedArrayEncoder.toBase58(verificationKey.publicKey.publicKey),
            alias,
            role,
        });
        if (!signingKey)
            return request;
        const writeRequest = await pool.prepareWriteRequest(agentContext, request, signingKey, undefined);
        return writeRequest;
    }
    async registerPublicDid(agentContext, pool, writeRequest) {
        const body = writeRequest.body;
        try {
            const response = await pool.submitRequest(writeRequest);
            agentContext.config.logger.debug(`Register public did on ledger '${pool.indyNamespace}'\nRequest: ${body}}`, {
                response,
            });
            return;
        }
        catch (error) {
            agentContext.config.logger.error(`Error Registering public did on ledger '${pool.indyNamespace}'\nRequest: ${body}}`);
            throw error;
        }
    }
    async createSetDidEndpointsRequest(options) {
        const { agentContext, pool, endpoints, unqualifiedDid, signingKey, endorserDid } = options;
        const request = new indy_vdr_shared_1.AttribRequest({
            submitterDid: unqualifiedDid,
            targetDid: unqualifiedDid,
            raw: JSON.stringify({ endpoint: endpoints }),
        });
        const writeRequest = await pool.prepareWriteRequest(agentContext, request, signingKey, endorserDid);
        return writeRequest;
    }
    async setEndpointsForDid(agentContext, pool, writeRequest) {
        const body = writeRequest.body;
        try {
            const response = await pool.submitRequest(writeRequest);
            agentContext.config.logger.debug(`Successfully set endpoints for did on ledger '${pool.indyNamespace}'.\nRequest: ${body}}`, {
                response,
            });
        }
        catch (error) {
            agentContext.config.logger.error(`Error setting endpoints for did on ledger '${pool.indyNamespace}'.\nRequest: ${body}}`);
            throw new error_1.IndyVdrError(error);
        }
    }
}
exports.IndyVdrIndyDidRegistrar = IndyVdrIndyDidRegistrar;
//# sourceMappingURL=IndyVdrIndyDidRegistrar.js.map