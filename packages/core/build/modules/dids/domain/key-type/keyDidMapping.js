"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationMethodsForPublicJwk = getVerificationMethodsForPublicJwk;
exports.getSupportedVerificationMethodTypesForPublicJwk = getSupportedVerificationMethodTypesForPublicJwk;
exports.getPublicJwkFromVerificationMethod = getPublicJwkFromVerificationMethod;
const error_1 = require("../../../../error");
const verificationMethod_1 = require("../verificationMethod");
const JsonWebKey2020_1 = require("../verificationMethod/JsonWebKey2020");
const kms_1 = require("../../../kms");
const ed25519_1 = require("./ed25519");
const keyDidJsonWebKey_1 = require("./keyDidJsonWebKey");
const secp256k1_1 = require("./secp256k1");
const x25519_1 = require("./x25519");
const supportedKeyDids = [ed25519_1.keyDidEd25519, x25519_1.keyDidX25519, keyDidJsonWebKey_1.keyDidJsonWebKey, secp256k1_1.keyDidSecp256k1];
// TODO: at some point we should update all usages to Jwk / Multikey methods
// so we don't need key type specific verification methods anymore
function getVerificationMethodsForPublicJwk(publicJwk, did) {
    const { getVerificationMethods } = getKeyDidMappingByPublicJwk(publicJwk);
    return getVerificationMethods(did, publicJwk);
}
function getSupportedVerificationMethodTypesForPublicJwk(publicJwk) {
    const { supportedVerificationMethodTypes } = getKeyDidMappingByPublicJwk(publicJwk);
    return supportedVerificationMethodTypes;
}
function getPublicJwkFromVerificationMethod(verificationMethod) {
    // This is a special verification method, as it supports basically all key types.
    if ((0, JsonWebKey2020_1.isJsonWebKey2020)(verificationMethod)) {
        return (0, JsonWebKey2020_1.getPublicJwkFromJsonWebKey2020)(verificationMethod);
    }
    if ((0, verificationMethod_1.isMultikey)(verificationMethod)) {
        return (0, verificationMethod_1.getPublicJwkFromMultikey)(verificationMethod);
    }
    const keyDid = supportedKeyDids.find((keyDid) => keyDid.supportedVerificationMethodTypes.includes(verificationMethod.type));
    if (!keyDid) {
        throw new error_1.CredoError(`Unsupported key did from verification method type '${verificationMethod.type}'`);
    }
    return keyDid.getPublicJwkFromVerificationMethod(verificationMethod);
}
function getKeyDidMappingByPublicJwk(jwk) {
    const jwkTypeClass = jwk instanceof kms_1.PublicJwk ? jwk.JwkClass : jwk;
    const keyDid = supportedKeyDids.find((supportedKeyDid) => 
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    supportedKeyDid.PublicJwkTypes.includes(jwkTypeClass));
    if (!keyDid) {
        throw new error_1.CredoError(`Unsupported did mapping for jwk '${jwk instanceof kms_1.PublicJwk ? jwk.jwkTypehumanDescription : jwk.name}'`);
    }
    return keyDid;
}
//# sourceMappingURL=keyDidMapping.js.map