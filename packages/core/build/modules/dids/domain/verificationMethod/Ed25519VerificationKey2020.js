"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020 = void 0;
exports.getEd25519VerificationKey2020 = getEd25519VerificationKey2020;
exports.isEd25519VerificationKey2020 = isEd25519VerificationKey2020;
exports.getPublicJwkFromEd25519VerificationKey2020 = getPublicJwkFromEd25519VerificationKey2020;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
const VerificationMethod_1 = require("./VerificationMethod");
exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020 = 'Ed25519VerificationKey2020';
/**
 * Get a Ed25519VerificationKey2020 verification method.
 */
function getEd25519VerificationKey2020({ publicJwk, id, controller, }) {
    return new VerificationMethod_1.VerificationMethod({
        id,
        type: exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020,
        controller,
        publicKeyMultibase: publicJwk.fingerprint,
    });
}
/**
 * Check whether a verification method is a Ed25519VerificationKey2020 verification method.
 */
function isEd25519VerificationKey2020(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020;
}
/**
 * Get a key from a Ed25519VerificationKey2020 verification method.
 */
function getPublicJwkFromEd25519VerificationKey2020(verificationMethod) {
    if (!verificationMethod.publicKeyMultibase) {
        throw new error_1.CredoError('verification method is missing publicKeyMultibase');
    }
    const publicJwk = kms_1.PublicJwk.fromFingerprint(verificationMethod.publicKeyMultibase);
    const publicKey = publicJwk.publicKey;
    if (publicKey.kty !== 'OKP' || publicKey.crv !== 'Ed25519') {
        throw new error_1.CredoError(`Verification method ${verificationMethod.type} is for unexpected ${(0, kms_1.getJwkHumanDescription)(publicJwk.toJson())}.`);
    }
    return publicJwk;
}
//# sourceMappingURL=Ed25519VerificationKey2020.js.map