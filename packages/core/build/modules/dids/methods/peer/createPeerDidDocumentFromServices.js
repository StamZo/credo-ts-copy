"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPeerDidDocumentFromServices = createPeerDidDocumentFromServices;
const ed25519_1 = require("@stablelib/ed25519");
const kms_1 = require("../../../kms");
const domain_1 = require("../../domain");
const DidDocumentBuilder_1 = require("../../domain/DidDocumentBuilder");
const DidCommV1Service_1 = require("../../domain/service/DidCommV1Service");
const key_1 = require("../key");
function createPeerDidDocumentFromServices(services, withKeys) {
    const didDocumentBuilder = new DidDocumentBuilder_1.DidDocumentBuilder('');
    // Keep track of all added key id based on the fingerprint so we can add them to the recipientKeys as references
    const recipientKeyIdMapping = {};
    const keys = [];
    let keyIndex = 1;
    services.forEach((service, index) => {
        // Get the local key reference for each of the recipient keys
        const recipientKeys = service.recipientKeys.map((recipientKey) => {
            // Key already added to the did document
            if (recipientKeyIdMapping[recipientKey.fingerprint])
                return recipientKeyIdMapping[recipientKey.fingerprint];
            const x25519Key = kms_1.PublicJwk.fromPublicKey({
                crv: 'X25519',
                kty: 'OKP',
                publicKey: (0, ed25519_1.convertPublicKeyToX25519)(recipientKey.publicKey.publicKey),
            });
            // key ids follow the #key-N pattern to comply with did:peer:2 spec
            const ed25519RelativeVerificationMethodId = `#key-${keyIndex++}`;
            const ed25519VerificationMethod = (0, domain_1.getEd25519VerificationKey2018)({
                id: ed25519RelativeVerificationMethodId,
                publicJwk: recipientKey,
                controller: '#id',
            });
            const x25519RelativeVerificationMethodId = `#key-${keyIndex++}`;
            const x25519VerificationMethod = (0, domain_1.getX25519KeyAgreementKey2019)({
                id: x25519RelativeVerificationMethodId,
                publicJwk: x25519Key,
                controller: '#id',
            });
            recipientKeyIdMapping[recipientKey.fingerprint] = ed25519VerificationMethod.id;
            // NOTE: both use the same key id as the x25519 key is derived from the ed25519 key
            // This is special for DIDComm v1 and any kms that wants to support DIDComm v1 will have
            // to support both Ed25519 and X25519 operations on a Ed25519 key
            if (withKeys) {
                keys.push({
                    didDocumentRelativeKeyId: ed25519RelativeVerificationMethodId,
                    kmsKeyId: recipientKey.keyId,
                });
                keys.push({
                    didDocumentRelativeKeyId: x25519RelativeVerificationMethodId,
                    kmsKeyId: recipientKey.keyId,
                });
            }
            // We should not add duplicated keys for services
            didDocumentBuilder.addAuthentication(ed25519VerificationMethod).addKeyAgreement(x25519VerificationMethod);
            return recipientKeyIdMapping[recipientKey.fingerprint];
        });
        // Transform all routing keys into did:key:xxx#key-id references. This will probably change for didcomm v2
        const routingKeys = service.routingKeys?.map((key) => {
            const didKey = new key_1.DidKey(key);
            return `${didKey.did}#${key.fingerprint}`;
        });
        didDocumentBuilder.addService(new DidCommV1Service_1.DidCommV1Service({
            id: service.id,
            priority: index,
            serviceEndpoint: service.serviceEndpoint,
            recipientKeys,
            routingKeys,
        }));
    });
    return {
        didDocument: didDocumentBuilder.build(),
        keys: (withKeys ? keys : undefined),
    };
}
//# sourceMappingURL=createPeerDidDocumentFromServices.js.map