"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingEd25519Key = findMatchingEd25519Key;
const kms_1 = require("../kms");
const keyDidMapping_1 = require("./domain/key-type/keyDidMapping");
/**
 * Tries to find a matching Ed25519 key to the supplied X25519 key
 * @param x25519Key X25519 key
 * @param didDocument Did document containing all the keys
 * @returns a matching Ed25519 key or `undefined` (if no matching key found)
 */
function findMatchingEd25519Key(x25519Key, didDocument) {
    const verificationMethods = didDocument.verificationMethod ?? [];
    const keyAgreements = didDocument.keyAgreement ?? [];
    const authentications = didDocument.authentication ?? [];
    const allKeyReferences = [
        ...verificationMethods,
        ...authentications.filter((keyAgreement) => typeof keyAgreement !== 'string'),
        ...keyAgreements.filter((keyAgreement) => typeof keyAgreement !== 'string'),
    ];
    return allKeyReferences
        .map((keyReference) => {
        const verificationMethod = didDocument.dereferenceKey(keyReference.id);
        return {
            publicJwk: (0, keyDidMapping_1.getPublicJwkFromVerificationMethod)(verificationMethod),
            verificationMethod,
        };
    })
        .find((v) => {
        if (!v.publicJwk.is(kms_1.Ed25519PublicJwk))
            return false;
        const keyX25519 = v.publicJwk.convertTo(kms_1.X25519PublicJwk);
        return (0, kms_1.assymetricPublicJwkMatches)(keyX25519.toJson(), x25519Key.toJson());
    });
}
//# sourceMappingURL=findMatchingEd25519Key.js.map