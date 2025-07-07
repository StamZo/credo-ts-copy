"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerDidRegistrar = void 0;
const utils_1 = require("../../../../utils");
const domain_1 = require("../../domain");
const DidDocumentRole_1 = require("../../domain/DidDocumentRole");
const repository_1 = require("../../repository");
const kms_1 = require("../../../kms");
const didPeer_1 = require("./didPeer");
const peerDidNumAlgo0_1 = require("./peerDidNumAlgo0");
const peerDidNumAlgo1_1 = require("./peerDidNumAlgo1");
const peerDidNumAlgo2_1 = require("./peerDidNumAlgo2");
const peerDidNumAlgo4_1 = require("./peerDidNumAlgo4");
class PeerDidRegistrar {
    constructor() {
        this.supportedMethods = ['peer'];
    }
    async create(agentContext, options) {
        const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
        const didRepository = agentContext.dependencyManager.resolve(repository_1.DidRepository);
        let did;
        let didDocument;
        let keys;
        try {
            if (isPeerDidNumAlgo0CreateOptions(options)) {
                let publicJwk;
                if (options.options.createKey) {
                    const createKeyResult = await kms.createKey(options.options.createKey);
                    publicJwk = kms_1.PublicJwk.fromPublicJwk(createKeyResult.publicJwk);
                    keys = [
                        {
                            didDocumentRelativeKeyId: `#${publicJwk.fingerprint}`,
                            kmsKeyId: createKeyResult.keyId,
                        },
                    ];
                }
                else {
                    const _publicJwk = await kms.getPublicKey({
                        keyId: options.options.keyId,
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
                    publicJwk = kms_1.PublicJwk.fromPublicJwk(_publicJwk);
                    keys = [
                        {
                            didDocumentRelativeKeyId: `#${publicJwk.fingerprint}`,
                            kmsKeyId: options.options.keyId,
                        },
                    ];
                }
                didDocument = (0, peerDidNumAlgo0_1.publicJwkToNumAlgo0DidDocument)(publicJwk);
                did = didDocument.id;
            }
            else if (isPeerDidNumAlgo1CreateOptions(options)) {
                const didDocumentJson = options.didDocument.toJSON();
                did = (0, peerDidNumAlgo1_1.didDocumentJsonToNumAlgo1Did)(didDocumentJson);
                keys = options.options.keys;
                didDocument = utils_1.JsonTransformer.fromJSON({ ...didDocumentJson, id: did }, domain_1.DidDocument);
            }
            else if (isPeerDidNumAlgo2CreateOptions(options)) {
                const didDocumentJson = options.didDocument.toJSON();
                did = (0, peerDidNumAlgo2_1.didDocumentToNumAlgo2Did)(options.didDocument);
                keys = options.options.keys;
                didDocument = utils_1.JsonTransformer.fromJSON({ ...didDocumentJson, id: did }, domain_1.DidDocument);
            }
            else if (isPeerDidNumAlgo4CreateOptions(options)) {
                const didDocumentJson = options.didDocument.toJSON();
                keys = options.options.keys;
                const { longFormDid, shortFormDid } = (0, peerDidNumAlgo4_1.didDocumentToNumAlgo4Did)(options.didDocument);
                did = longFormDid;
                didDocument = utils_1.JsonTransformer.fromJSON({ ...didDocumentJson, id: longFormDid, alsoKnownAs: [shortFormDid] }, domain_1.DidDocument);
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: 'Missing or incorrect numAlgo provided',
                    },
                };
            }
            if (!keys || keys.length === 0) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: 'failed',
                        reason: `Missing required 'keys' linking did document verification method id to the kms key id. Provide at least one key in the create options`,
                    },
                };
            }
            // Save the did so we know we created it and can use it for didcomm
            const didRecord = new repository_1.DidRecord({
                did,
                role: DidDocumentRole_1.DidDocumentRole.Created,
                didDocument: isPeerDidNumAlgo1CreateOptions(options) ? didDocument : undefined,
                keys,
                tags: {
                    // We need to save the recipientKeys, so we can find the associated did
                    // of a key when we receive a message from another connection.
                    recipientKeyFingerprints: didDocument.recipientKeys.map((key) => key.fingerprint),
                    alternativeDids: (0, didPeer_1.getAlternativeDidsForPeerDid)(did),
                },
            });
            await didRepository.save(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didDocument.id,
                    didDocument,
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
                reason: 'notImplemented: updating did:peer not implemented yet',
            },
        };
    }
    async deactivate() {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notImplemented: deactivating did:peer not implemented yet',
            },
        };
    }
}
exports.PeerDidRegistrar = PeerDidRegistrar;
function isPeerDidNumAlgo1CreateOptions(options) {
    return options.options.numAlgo === didPeer_1.PeerDidNumAlgo.GenesisDoc;
}
function isPeerDidNumAlgo0CreateOptions(options) {
    return options.options.numAlgo === didPeer_1.PeerDidNumAlgo.InceptionKeyWithoutDoc;
}
function isPeerDidNumAlgo2CreateOptions(options) {
    return options.options.numAlgo === didPeer_1.PeerDidNumAlgo.MultipleInceptionKeyWithoutDoc;
}
function isPeerDidNumAlgo4CreateOptions(options) {
    return options.options.numAlgo === didPeer_1.PeerDidNumAlgo.ShortFormAndLongForm;
}
//# sourceMappingURL=PeerDidRegistrar.js.map