"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019 = void 0;
exports.getX25519KeyAgreementKey2019 = getX25519KeyAgreementKey2019;
exports.isX25519KeyAgreementKey2019 = isX25519KeyAgreementKey2019;
exports.getPublicJwkFrommX25519KeyAgreementKey2019 = getPublicJwkFrommX25519KeyAgreementKey2019;
const error_1 = require("../../../../error");
const utils_1 = require("../../../../utils");
const kms_1 = require("../../../kms");
const VerificationMethod_1 = require("./VerificationMethod");
exports.VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019 = 'X25519KeyAgreementKey2019';
/**
 * Get a X25519KeyAgreementKey2019 verification method.
 */
function getX25519KeyAgreementKey2019({ publicJwk, id, controller, }) {
    return new VerificationMethod_1.VerificationMethod({
        id,
        type: exports.VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019,
        controller,
        publicKeyBase58: utils_1.TypedArrayEncoder.toBase58(publicJwk.publicKey.publicKey),
    });
}
/**
 * Check whether a verification method is a X25519KeyAgreementKey2019 verification method.
 */
function isX25519KeyAgreementKey2019(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019;
}
/**
 * Get a key from a X25519KeyAgreementKey2019 verification method.
 */
function getPublicJwkFrommX25519KeyAgreementKey2019(verificationMethod) {
    if (!verificationMethod.publicKeyBase58) {
        throw new error_1.CredoError('verification method is missing publicKeyBase58');
    }
    return kms_1.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'X25519',
        publicKey: utils_1.TypedArrayEncoder.fromBase58(verificationMethod.publicKeyBase58),
    });
}
//# sourceMappingURL=X25519KeyAgreementKey2019.js.map