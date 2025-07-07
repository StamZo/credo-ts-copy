"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwkDidRegistrar = void 0;
const DidDocumentRole_1 = require("../../domain/DidDocumentRole");
const repository_1 = require("../../repository");
const kms_1 = require("../../../kms");
const DidJwk_1 = require("./DidJwk");
class JwkDidRegistrar {
    constructor() {
        this.supportedMethods = ['jwk'];
    }
    async create(agentContext, options) {
        const didRepository = agentContext.dependencyManager.resolve(repository_1.DidRepository);
        try {
            let publicJwk;
            let keyId;
            const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
            if (options.options.createKey) {
                const createKeyResult = await kms.createKey(options.options.createKey);
                publicJwk = createKeyResult.publicJwk;
                keyId = createKeyResult.keyId;
            }
            else if (options.options.keyId) {
                const _publicJwk = await kms.getPublicKey({ keyId: options.options.keyId });
                keyId = options.options.keyId;
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
                if (_publicJwk.kty === 'oct') {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: 'failed',
                            reason: `notFound: key with key id '${options.options.keyId}' uses unsupported kty 'oct' for did:jwk`,
                        },
                    };
                }
                publicJwk = _publicJwk;
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: 'Missing keyId or createKey',
                    },
                };
            }
            const didJwk = DidJwk_1.DidJwk.fromPublicJwk(kms_1.PublicJwk.fromPublicJwk(publicJwk));
            // Save the did so we know we created it and can issue with it
            const didRecord = new repository_1.DidRecord({
                did: didJwk.did,
                role: DidDocumentRole_1.DidDocumentRole.Created,
                keys: [
                    {
                        didDocumentRelativeKeyId: '#0',
                        kmsKeyId: keyId,
                    },
                ],
            });
            await didRepository.save(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didJwk.did,
                    didDocument: didJwk.didDocument,
                },
            };
        }
        catch (error) {
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
    async update() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notSupported: cannot update did:jwk did',
            },
        };
    }
    async deactivate() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notSupported: cannot deactivate did:jwk did',
            },
        };
    }
}
exports.JwkDidRegistrar = JwkDidRegistrar;
//# sourceMappingURL=JwkDidRegistrar.js.map