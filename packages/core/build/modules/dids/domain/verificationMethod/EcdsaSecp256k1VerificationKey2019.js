"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019 = void 0;
exports.getEcdsaSecp256k1VerificationKey2019 = getEcdsaSecp256k1VerificationKey2019;
exports.isEcdsaSecp256k1VerificationKey2019 = isEcdsaSecp256k1VerificationKey2019;
exports.getPublicJwkFromEcdsaSecp256k1VerificationKey2019 = getPublicJwkFromEcdsaSecp256k1VerificationKey2019;
const error_1 = require("../../../../error");
const utils_1 = require("../../../../utils");
const kms_1 = require("../../../kms");
const VerificationMethod_1 = require("./VerificationMethod");
exports.VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019 = 'EcdsaSecp256k1VerificationKey2019';
/**
 * Get a EcdsaSecp256k1VerificationKey2019 verification method.
 */
function getEcdsaSecp256k1VerificationKey2019({ publicJwk, id, controller, }) {
    return new VerificationMethod_1.VerificationMethod({
        id,
        type: exports.VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019,
        controller,
        publicKeyBase58: utils_1.TypedArrayEncoder.toBase58(publicJwk.publicKey.publicKey),
    });
}
/**
 * Check whether a verification method is a EcdsaSecp256k1VerificationKey2019 verification method.
 */
function isEcdsaSecp256k1VerificationKey2019(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019;
}
/**
 * Get a public jwk from a EcdsaSecp256k1VerificationKey2019 verification method.
 */
function getPublicJwkFromEcdsaSecp256k1VerificationKey2019(verificationMethod) {
    if (!verificationMethod.publicKeyBase58) {
        throw new error_1.CredoError('verification method is missing publicKeyBase58');
    }
    return kms_1.PublicJwk.fromPublicKey({
        kty: 'EC',
        crv: 'secp256k1',
        publicKey: utils_1.TypedArrayEncoder.fromBase58(verificationMethod.publicKeyBase58),
    });
}
//# sourceMappingURL=EcdsaSecp256k1VerificationKey2019.js.map