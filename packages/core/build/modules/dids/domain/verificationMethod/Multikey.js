"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_MULTIKEY = void 0;
exports.getMultikey = getMultikey;
exports.isMultikey = isMultikey;
exports.getPublicJwkFromMultikey = getPublicJwkFromMultikey;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
exports.VERIFICATION_METHOD_TYPE_MULTIKEY = 'Multikey';
/**
 * Get a Multikey verification method.
 */
function getMultikey({ did, publicJwk, verificationMethodId }) {
    if (!verificationMethodId) {
        verificationMethodId = `${did}#${publicJwk.fingerprint}`;
    }
    return {
        id: verificationMethodId,
        type: exports.VERIFICATION_METHOD_TYPE_MULTIKEY,
        controller: did,
        publicKeyMultibase: publicJwk.fingerprint,
    };
}
/**
 * Check whether a verification method is a Multikey verification method.
 */
function isMultikey(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_MULTIKEY;
}
/**
 * Get a public jwk from a Multikey verification method.
 */
function getPublicJwkFromMultikey(verificationMethod) {
    if (!verificationMethod.publicKeyMultibase) {
        throw new error_1.CredoError(`Missing publicKeyMultibase on verification method with type ${exports.VERIFICATION_METHOD_TYPE_MULTIKEY}`);
    }
    return kms_1.PublicJwk.fromFingerprint(verificationMethod.publicKeyMultibase);
}
//# sourceMappingURL=Multikey.js.map