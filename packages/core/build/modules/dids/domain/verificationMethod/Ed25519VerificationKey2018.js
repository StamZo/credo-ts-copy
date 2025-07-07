"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018 = void 0;
exports.getEd25519VerificationKey2018 = getEd25519VerificationKey2018;
exports.isEd25519VerificationKey2018 = isEd25519VerificationKey2018;
exports.getPublicJwkFromEd25519VerificationKey2018 = getPublicJwkFromEd25519VerificationKey2018;
const error_1 = require("../../../../error");
const utils_1 = require("../../../../utils");
const kms_1 = require("../../../kms");
const VerificationMethod_1 = require("./VerificationMethod");
exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018 = 'Ed25519VerificationKey2018';
/**
 * Get a Ed25519VerificationKey2018 verification method.
 */
function getEd25519VerificationKey2018({ publicJwk, id, controller, }) {
    return new VerificationMethod_1.VerificationMethod({
        id,
        type: exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018,
        controller,
        publicKeyBase58: utils_1.TypedArrayEncoder.toBase58(publicJwk.publicKey.publicKey),
    });
}
/**
 * Check whether a verification method is a Ed25519VerificationKey2018 verification method.
 */
function isEd25519VerificationKey2018(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018;
}
/**
 * Get a key from a Ed25519VerificationKey2018 verification method.
 */
/**
 * Get a public jwk from a Ed25519VerificationKey2018 verification method.
 */
function getPublicJwkFromEd25519VerificationKey2018(verificationMethod) {
    if (!verificationMethod.publicKeyBase58) {
        throw new error_1.CredoError('verification method is missing publicKeyBase58');
    }
    return kms_1.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'Ed25519',
        publicKey: utils_1.TypedArrayEncoder.fromBase58(verificationMethod.publicKeyBase58),
    });
}
//# sourceMappingURL=Ed25519VerificationKey2018.js.map