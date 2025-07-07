"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020 = void 0;
exports.getJsonWebKey2020 = getJsonWebKey2020;
exports.isJsonWebKey2020 = isJsonWebKey2020;
exports.getPublicJwkFromJsonWebKey2020 = getPublicJwkFromJsonWebKey2020;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
exports.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020 = 'JsonWebKey2020';
/**
 * Get a JsonWebKey2020 verification method.
 */
function getJsonWebKey2020(options) {
    const verificationMethodId = options.verificationMethodId ?? `${options.did}#${options.publicJwk.fingerprint}`;
    return {
        id: verificationMethodId,
        type: exports.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020,
        controller: options.did,
        publicKeyJwk: options.publicJwk.toJson(),
    };
}
/**
 * Check whether a verification method is a JsonWebKey2020 verification method.
 */
function isJsonWebKey2020(verificationMethod) {
    return verificationMethod.type === exports.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020;
}
/**
 * Get a key from a JsonWebKey2020 verification method.
 */
function getPublicJwkFromJsonWebKey2020(verificationMethod) {
    if (!verificationMethod.publicKeyJwk) {
        throw new error_1.CredoError(`Missing publicKeyJwk on verification method with type ${exports.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020}`);
    }
    return kms_1.PublicJwk.fromUnknown(verificationMethod.publicKeyJwk);
}
//# sourceMappingURL=JsonWebKey2020.js.map