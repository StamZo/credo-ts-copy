"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheqdDidRegistrar = void 0;
const sdk_1 = require("@cheqd/sdk");
const core_1 = require("@credo-ts/core");
const sdk_2 = require("@cheqd/sdk");
const v2_1 = require("@cheqd/ts-proto/cheqd/resource/v2");
const core_2 = require("@credo-ts/core");
const identifiers_1 = require("../anoncreds/utils/identifiers");
const ledger_1 = require("../ledger");
const didCheqdUtil_1 = require("./didCheqdUtil");
class CheqdDidRegistrar {
    constructor() {
        this.supportedMethods = ['cheqd'];
        this.contextMapping = {
            Ed25519VerificationKey2018: identifiers_1.ED25519_SUITE_CONTEXT_URL_2018,
            Ed25519VerificationKey2020: identifiers_1.ED25519_SUITE_CONTEXT_URL_2020,
            JsonWebKey2020: core_1.SECURITY_JWS_CONTEXT_URL,
        };
    }
    collectAllContexts(didDocument) {
        const contextSet = new Set(typeof didDocument.context === 'string'
            ? [didDocument.context]
            : Array.isArray(didDocument.context)
                ? didDocument.context
                : []);
        // List of verification relationships to check for embedded verification methods
        // Note: these are the relationships defined in the DID Core spec
        const relationships = [
            'authentication',
            'assertionMethod',
            'capabilityInvocation',
            'capabilityDelegation',
            'keyAgreement',
            'verificationMethod',
        ];
        // Collect verification methods from relationships
        for (const rel of relationships) {
            const entries = didDocument[rel];
            if (entries) {
                for (const entry of entries) {
                    if (typeof entry !== 'string' && entry.type) {
                        const contextUrl = this.contextMapping[entry.type];
                        if (contextUrl) {
                            contextSet.add(contextUrl);
                        }
                    }
                }
            }
        }
        return contextSet;
    }
    async create(agentContext, options) {
        const didRepository = agentContext.dependencyManager.resolve(core_2.DidRepository);
        const cheqdLedgerService = agentContext.dependencyManager.resolve(ledger_1.CheqdLedgerService);
        let didDocument;
        const versionId = options.options?.versionId ?? core_2.utils.uuid();
        let keys = [];
        try {
            if (options.didDocument) {
                const isSpecCompliantPayload = (0, didCheqdUtil_1.validateSpecCompliantPayload)(options.didDocument);
                if (!isSpecCompliantPayload.valid) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: `Invalid did document provided. ${isSpecCompliantPayload.error}`,
                        },
                    };
                }
                didDocument = options.didDocument;
                const authenticationIds = didDocument.authentication?.map((v) => (typeof v === 'string' ? v : v.id)) ?? [];
                const didDocumentRelativeKeyIds = options.options.keys.map((key) => key.didDocumentRelativeKeyId);
                keys = options.options.keys;
                // Ensure all keys are present in the did document
                for (const didDocumentKeyId of didDocumentRelativeKeyIds) {
                    didDocument.dereferenceKey(didDocumentKeyId);
                }
                if (!authenticationIds.every((id) => didDocumentRelativeKeyIds.includes(id.replace(didDocument.id, '')))) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: `For all 'authentication' verification methods in the did document a 'key' entry in the options MUST be provided that link the did document key id with the kms key id`,
                        },
                    };
                }
                const cheqdDid = (0, identifiers_1.parseCheqdDid)(options.didDocument.id);
                if (!cheqdDid) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: `Unable to parse cheqd did ${options.didDocument.id}`,
                        },
                    };
                }
            }
            else if (options.options.createKey || options.options.keyId) {
                const methodSpecificIdAlgo = options.options.methodSpecificIdAlgo;
                const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
                let publicJwk;
                if (options.options.createKey) {
                    const createKeyResult = await kms.createKey(options.options.createKey);
                    publicJwk = createKeyResult.publicJwk;
                    keys.push({
                        kmsKeyId: createKeyResult.keyId,
                        didDocumentRelativeKeyId: '#key-1',
                    });
                }
                else {
                    const _publicJwk = await kms.getPublicKey({
                        keyId: options.options.keyId,
                    });
                    keys.push({
                        kmsKeyId: options.options.keyId,
                        didDocumentRelativeKeyId: '#key-1',
                    });
                    if (!_publicJwk) {
                        return {
                            didDocumentMetadata: {},
                            didRegistrationMetadata: {},
                            didState: {
                                state: 'failed',
                                reason: `notFound: key with key id '${options.options.keyId}' not found`,
                            },
                        };
                    }
                    if (_publicJwk.kty !== 'OKP' || _publicJwk.crv !== 'Ed25519') {
                        return {
                            didDocumentMetadata: {},
                            didRegistrationMetadata: {},
                            didState: {
                                state: 'failed',
                                reason: `key with key id '${options.options.keyId}' uses unsupported ${core_1.Kms.getJwkHumanDescription(_publicJwk)} for did:cheqd`,
                            },
                        };
                    }
                    publicJwk = {
                        ..._publicJwk,
                        crv: _publicJwk.crv,
                    };
                }
                // TODO: make this configureable
                const verificationMethod = sdk_1.VerificationMethods.JWK;
                const jwk = core_1.Kms.PublicJwk.fromPublicJwk(publicJwk);
                didDocument = (0, didCheqdUtil_1.generateDidDoc)({
                    verificationMethod,
                    verificationMethodId: 'key-1',
                    methodSpecificIdAlgo: methodSpecificIdAlgo || sdk_2.MethodSpecificIdAlgo.Uuid,
                    network: options.options.network,
                    publicKey: core_2.TypedArrayEncoder.toHex(jwk.publicKey.publicKey),
                });
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: 'Provide a didDocument or provide createKey or keyId in options',
                    },
                };
            }
            // Collect all contexts from the didDic into a set
            const contextSet = this.collectAllContexts(didDocument);
            // Add Cheqd default context to the did document
            didDocument.context = Array.from(contextSet.add(core_1.DID_V1_CONTEXT_URL));
            const didDocumentJson = didDocument.toJSON();
            const payloadToSign = await (0, didCheqdUtil_1.createMsgCreateDidDocPayloadToSign)(didDocumentJson, versionId);
            const authentication = didDocument.authentication?.map((authentication) => typeof authentication === 'string' ? didDocument.dereferenceVerificationMethod(authentication) : authentication);
            if (!authentication || authentication.length === 0) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: "No keys to sign with in 'authentication' of DID document",
                    },
                };
            }
            const signInputs = await this.signPayload(agentContext, payloadToSign, authentication, keys);
            const response = await cheqdLedgerService.create(didDocumentJson, signInputs, versionId);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            // Save the did so we know we created it and can issue with it
            const didRecord = new core_2.DidRecord({
                did: didDocument.id,
                role: core_2.DidDocumentRole.Created,
                didDocument,
                keys,
            });
            await didRepository.save(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didDocument.id,
                    didDocument,
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error('Error registering DID', error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'failed',
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async update(agentContext, options) {
        const didRepository = agentContext.dependencyManager.resolve(core_2.DidRepository);
        const cheqdLedgerService = agentContext.dependencyManager.resolve(ledger_1.CheqdLedgerService);
        const versionId = options.options?.versionId || core_2.utils.uuid();
        let didDocument;
        let didRecord;
        try {
            if (options.didDocument) {
                const isSpecCompliantPayload = (0, didCheqdUtil_1.validateSpecCompliantPayload)(options.didDocument);
                if (!isSpecCompliantPayload.valid) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: `Invalid did document provided. ${isSpecCompliantPayload.error}`,
                        },
                    };
                }
                didDocument = options.didDocument;
                const resolvedDocument = await cheqdLedgerService.resolve(didDocument.id);
                didRecord = await didRepository.findCreatedDid(agentContext, didDocument.id);
                if (!resolvedDocument.didDocument || resolvedDocument.didDocumentMetadata.deactivated || !didRecord) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: 'Did not found',
                        },
                    };
                }
                const keys = didRecord.keys ?? [];
                if (options.options?.createKey || options.options?.keyId) {
                    const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
                    let createdKey;
                    let publicJwk;
                    if (options.options.createKey) {
                        const createKeyResult = await kms.createKey(options.options.createKey);
                        publicJwk = createKeyResult.publicJwk;
                        createdKey = {
                            didDocumentRelativeKeyId: `#${core_2.utils.uuid()}-1`,
                            kmsKeyId: createKeyResult.keyId,
                        };
                    }
                    else if (options.options.keyId) {
                        const _publicJwk = await kms.getPublicKey({
                            keyId: options.options.keyId,
                        });
                        createdKey = {
                            didDocumentRelativeKeyId: `#${core_2.utils.uuid()}-1`,
                            kmsKeyId: options.options.keyId,
                        };
                        if (!_publicJwk) {
                            return {
                                didDocumentMetadata: {},
                                didRegistrationMetadata: {},
                                didState: {
                                    state: 'failed',
                                    reason: `notFound: key with key id '${options.options.keyId}' not found`,
                                },
                            };
                        }
                        if (_publicJwk.kty !== 'OKP' || _publicJwk.crv !== 'Ed25519') {
                            return {
                                didDocumentMetadata: {},
                                didRegistrationMetadata: {},
                                didState: {
                                    state: 'failed',
                                    reason: `key with key id '${options.options.keyId}' uses unsupported ${core_1.Kms.getJwkHumanDescription(_publicJwk)} for did:cheqd`,
                                },
                            };
                        }
                        publicJwk = {
                            ..._publicJwk,
                            crv: _publicJwk.crv,
                        };
                    }
                    else {
                        // This will never happen, but to make TS happy
                        return {
                            didDocumentMetadata: {},
                            didRegistrationMetadata: {},
                            didState: {
                                state: 'failed',
                                reason: 'Expect options.createKey or options.keyId',
                            },
                        };
                    }
                    // TODO: make this configureable
                    const verificationMethod = sdk_1.VerificationMethods.JWK;
                    const jwk = core_1.Kms.PublicJwk.fromPublicJwk(publicJwk);
                    keys.push(createdKey);
                    didDocument.verificationMethod?.concat(core_2.JsonTransformer.fromJSON((0, sdk_2.createDidVerificationMethod)([verificationMethod], [
                        {
                            methodSpecificId: didDocument.id.split(':')[3],
                            didUrl: didDocument.id,
                            keyId: `${didDocument.id}${createdKey.didDocumentRelativeKeyId}`,
                            publicKey: core_2.TypedArrayEncoder.toHex(jwk.publicKey.publicKey),
                        },
                    ]), core_2.VerificationMethod));
                }
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: 'Provide a valid didDocument',
                    },
                };
            }
            // Filter out all keys that are not present in the did document anymore
            didRecord.keys = didRecord.keys?.filter(({ didDocumentRelativeKeyId }) => {
                try {
                    didDocument.dereferenceKey(didDocumentRelativeKeyId);
                    return true;
                }
                catch (_error) {
                    return false;
                }
            });
            // TODO: we don't know which keys are managed by Credo. Should we
            // create a keys array for all keys within the did document set to the legacy key id
            // TODO: we need some sort of migration plan, otherwise we will have to support
            // legacy key ids forever
            // const authenticationIds = didDocument.authentication?.map(a => typeof a === 'string' ? a : a.id) ?? []
            // const didDocumentKeyIds = didRecord.keys?.map(({didDocumentRelativeKeyId}) => didDocumentRelativeKeyId)
            //  if (!authenticationIds.every((id) => didDocumentKeyIds?.includes(id))) {
            //     return {
            //       didDocumentMetadata: {},
            //       didRegistrationMetadata: {},
            //       didState: {
            //         state: "failed",
            //         reason: `For all 'authentication' verification methods in the did document a 'key' entry in the options MUST be provided that link the did document key id with the kms key id`,
            //       },
            //     };
            //   }
            const payloadToSign = await (0, didCheqdUtil_1.createMsgCreateDidDocPayloadToSign)(didDocument.toJSON(), versionId);
            const authentication = didDocument.authentication?.map((authentication) => typeof authentication === 'string' ? didDocument.dereferenceVerificationMethod(authentication) : authentication);
            if (!authentication || authentication.length === 0) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: "No keys to sign with in 'authentication' of DID document",
                    },
                };
            }
            const signInputs = await this.signPayload(agentContext, payloadToSign, 
            // TOOD: we should also sign with the authentication entries that are removed (so we should diff)
            authentication, didRecord.keys);
            const response = await cheqdLedgerService.update(didDocument.toJSON(), signInputs, versionId);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            // Collect all contexts, override existing context if provided
            const contextSet = this.collectAllContexts(options.didDocument || didDocument);
            // Add Cheqd default context to the did document
            didDocument.context = Array.from(contextSet.add(core_1.DID_V1_CONTEXT_URL));
            // Save the did so we know we created it and can issue with it
            didRecord.didDocument = didDocument;
            await didRepository.update(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didDocument.id,
                    didDocument,
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error('Error updating DID', error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'failed',
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async deactivate(agentContext, options) {
        const didRepository = agentContext.dependencyManager.resolve(core_2.DidRepository);
        const cheqdLedgerService = agentContext.dependencyManager.resolve(ledger_1.CheqdLedgerService);
        const did = options.did;
        const versionId = options.options?.versionId || core_2.utils.uuid();
        try {
            const { didDocument, didDocumentMetadata } = await cheqdLedgerService.resolve(did);
            const didRecord = await didRepository.findCreatedDid(agentContext, did);
            if (!didDocument || didDocumentMetadata.deactivated || !didRecord) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: 'Did not found',
                    },
                };
            }
            const payloadToSign = (0, didCheqdUtil_1.createMsgDeactivateDidDocPayloadToSign)(didDocument, versionId);
            const didDocumentInstance = core_2.DidDocument.fromJSON(didDocument);
            const authentication = didDocumentInstance.authentication?.map((authentication) => typeof authentication === 'string'
                ? didDocumentInstance.dereferenceVerificationMethod(authentication)
                : authentication);
            if (!authentication || authentication.length === 0) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: "No keys to sign with in 'authentication' of DID document",
                    },
                };
            }
            const signInputs = await this.signPayload(agentContext, payloadToSign, authentication, didRecord.keys);
            const response = await cheqdLedgerService.deactivate(didDocument, signInputs, versionId);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            await didRepository.update(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didDocument.id,
                    didDocument: core_2.JsonTransformer.fromJSON(didRecord.didDocument, core_2.DidDocument),
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error('Error deactivating DID', error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'failed',
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async createResource(agentContext, did, resource) {
        const didRepository = agentContext.dependencyManager.resolve(core_2.DidRepository);
        const cheqdLedgerService = agentContext.dependencyManager.resolve(ledger_1.CheqdLedgerService);
        const { didDocument, didDocumentMetadata } = await cheqdLedgerService.resolve(did);
        const didRecord = await didRepository.findCreatedDid(agentContext, did);
        if (!didDocument || didDocumentMetadata.deactivated || !didRecord) {
            return {
                resourceMetadata: {},
                resourceRegistrationMetadata: {},
                resourceState: {
                    state: 'failed',
                    reason: `DID: ${did} not found`,
                },
            };
        }
        try {
            let data;
            if (typeof resource.data === 'string') {
                data = core_2.TypedArrayEncoder.fromBase64(resource.data);
            }
            else if (typeof resource.data === 'object') {
                data = core_2.TypedArrayEncoder.fromString(JSON.stringify(resource.data));
            }
            else {
                data = resource.data;
            }
            const resourcePayload = v2_1.MsgCreateResourcePayload.fromPartial({
                collectionId: did.split(':')[3],
                id: resource.id,
                resourceType: resource.resourceType,
                name: resource.name,
                version: resource.version,
                alsoKnownAs: resource.alsoKnownAs,
                data,
            });
            const payloadToSign = v2_1.MsgCreateResourcePayload.encode(resourcePayload).finish();
            const didDocumentInstance = core_2.JsonTransformer.fromJSON(didDocument, core_2.DidDocument);
            const signInputs = await this.signPayload(agentContext, payloadToSign, didDocumentInstance.verificationMethod, didRecord.keys);
            const response = await cheqdLedgerService.createResource(did, resourcePayload, signInputs);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            return {
                resourceMetadata: {},
                resourceRegistrationMetadata: {},
                resourceState: {
                    state: 'finished',
                    resourceId: resourcePayload.id,
                    resource: resourcePayload,
                },
            };
        }
        catch (error) {
            return {
                resourceMetadata: {},
                resourceRegistrationMetadata: {},
                resourceState: {
                    state: 'failed',
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async signPayload(agentContext, payload, verificationMethod = [], keys) {
        const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
        return await Promise.all(verificationMethod.map(async (method) => {
            const publicJwk = (0, core_1.getPublicJwkFromVerificationMethod)(method);
            const kmsKeyId = (0, core_1.getKmsKeyIdForVerifiacationMethod)(method, keys) ?? publicJwk.legacyKeyId;
            const { signature } = await kms.sign({
                data: payload,
                algorithm: publicJwk.signatureAlgorithm,
                keyId: kmsKeyId,
            });
            // EC signatures need to be sent as DER encoded for Cheqd
            const jwk = publicJwk.toJson();
            if (jwk.kty === 'EC') {
                return {
                    verificationMethodId: method.id,
                    signature: core_1.Kms.rawEcSignatureToDer(signature, jwk.crv),
                };
            }
            return {
                verificationMethodId: method.id,
                signature,
            };
        }));
    }
}
exports.CheqdDidRegistrar = CheqdDidRegistrar;
//# sourceMappingURL=CheqdDidRegistrar.js.map