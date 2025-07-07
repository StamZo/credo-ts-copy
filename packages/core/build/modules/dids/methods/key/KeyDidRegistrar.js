"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyDidRegistrar = void 0;
const kms_1 = require("../../../kms");
const DidDocumentRole_1 = require("../../domain/DidDocumentRole");
const repository_1 = require("../../repository");
const DidKey_1 = require("./DidKey");
class KeyDidRegistrar {
    constructor() {
        this.supportedMethods = ['key'];
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
            else {
                const _publicJwk = await kms.getPublicKey({
                    keyId: options.options.keyId,
                });
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
                            reason: `notFound: key with key id '${options.options.keyId}' uses unsupported kty 'oct' for did:key`,
                        },
                    };
                }
                publicJwk = _publicJwk;
            }
            const jwk = kms_1.PublicJwk.fromPublicJwk(publicJwk);
            const didKey = new DidKey_1.DidKey(jwk);
            // Save the did so we know we created it and can issue with it
            const didRecord = new repository_1.DidRecord({
                did: didKey.did,
                role: DidDocumentRole_1.DidDocumentRole.Created,
                keys: [
                    {
                        didDocumentRelativeKeyId: `#${didKey.publicJwk.fingerprint}`,
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
                    did: didKey.did,
                    didDocument: didKey.didDocument,
                    secret: {},
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
                reason: 'notSupported: cannot update did:key did',
            },
        };
    }
    async deactivate() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notSupported: cannot deactivate did:key did',
            },
        };
    }
}
exports.KeyDidRegistrar = KeyDidRegistrar;
//# sourceMappingURL=KeyDidRegistrar.js.map