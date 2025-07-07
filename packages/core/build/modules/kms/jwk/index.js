"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicJwk = exports.assertAsymmetricJwkKeyTypeMatches = exports.assymetricPublicJwkMatches = exports.assymetricJwkKeyTypeMatches = exports.getJwkHumanDescription = exports.assertKeyAllowsDerive = exports.assertKeyAllowsDecrypt = exports.keyAllowsDecrypt = exports.assertKeyAllowsEncrypt = exports.keyAllowsEncrypt = exports.assertKeyAllowsVerify = exports.assertKeyAllowsSign = exports.keyAllowsVerify = exports.keyAllowsSign = exports.rawEcSignatureToDer = exports.derEcSignatureToRaw = exports.Secp256k1PublicJwk = exports.X25519PublicJwk = exports.RsaPublicJwk = exports.P521PublicJwk = exports.P384PublicJwk = exports.P256PublicJwk = exports.Ed25519PublicJwk = exports.assertSupportedEncryptionAlgorithm = exports.assertSupportedKeyAgreementAlgorithm = exports.isJwkAsymmetric = exports.assertJwkAsymmetric = exports.publicJwkFromPrivateJwk = exports.KnownJwaSignatureAlgorithms = exports.KnownJwaKeyEncryptionAlgorithms = exports.KnownJwaContentEncryptionAlgorithms = exports.KnownJwaKeyAgreementAlgorithms = void 0;
var jwa_1 = require("./jwa");
Object.defineProperty(exports, "KnownJwaKeyAgreementAlgorithms", { enumerable: true, get: function () { return jwa_1.KnownJwaKeyAgreementAlgorithms; } });
Object.defineProperty(exports, "KnownJwaContentEncryptionAlgorithms", { enumerable: true, get: function () { return jwa_1.KnownJwaContentEncryptionAlgorithms; } });
Object.defineProperty(exports, "KnownJwaKeyEncryptionAlgorithms", { enumerable: true, get: function () { return jwa_1.KnownJwaKeyEncryptionAlgorithms; } });
Object.defineProperty(exports, "KnownJwaSignatureAlgorithms", { enumerable: true, get: function () { return jwa_1.KnownJwaSignatureAlgorithms; } });
var knownJwk_1 = require("./knownJwk");
Object.defineProperty(exports, "publicJwkFromPrivateJwk", { enumerable: true, get: function () { return knownJwk_1.publicJwkFromPrivateJwk; } });
Object.defineProperty(exports, "assertJwkAsymmetric", { enumerable: true, get: function () { return knownJwk_1.assertJwkAsymmetric; } });
Object.defineProperty(exports, "isJwkAsymmetric", { enumerable: true, get: function () { return knownJwk_1.isJwkAsymmetric; } });
var assertSupported_1 = require("./assertSupported");
Object.defineProperty(exports, "assertSupportedKeyAgreementAlgorithm", { enumerable: true, get: function () { return assertSupported_1.assertSupportedKeyAgreementAlgorithm; } });
Object.defineProperty(exports, "assertSupportedEncryptionAlgorithm", { enumerable: true, get: function () { return assertSupported_1.assertSupportedEncryptionAlgorithm; } });
var kty_1 = require("./kty");
Object.defineProperty(exports, "Ed25519PublicJwk", { enumerable: true, get: function () { return kty_1.Ed25519PublicJwk; } });
Object.defineProperty(exports, "P256PublicJwk", { enumerable: true, get: function () { return kty_1.P256PublicJwk; } });
Object.defineProperty(exports, "P384PublicJwk", { enumerable: true, get: function () { return kty_1.P384PublicJwk; } });
Object.defineProperty(exports, "P521PublicJwk", { enumerable: true, get: function () { return kty_1.P521PublicJwk; } });
Object.defineProperty(exports, "RsaPublicJwk", { enumerable: true, get: function () { return kty_1.RsaPublicJwk; } });
Object.defineProperty(exports, "X25519PublicJwk", { enumerable: true, get: function () { return kty_1.X25519PublicJwk; } });
Object.defineProperty(exports, "Secp256k1PublicJwk", { enumerable: true, get: function () { return kty_1.Secp256k1PublicJwk; } });
Object.defineProperty(exports, "derEcSignatureToRaw", { enumerable: true, get: function () { return kty_1.derEcSignatureToRaw; } });
Object.defineProperty(exports, "rawEcSignatureToDer", { enumerable: true, get: function () { return kty_1.rawEcSignatureToDer; } });
var keyOps_1 = require("./keyOps");
Object.defineProperty(exports, "keyAllowsSign", { enumerable: true, get: function () { return keyOps_1.keyAllowsSign; } });
Object.defineProperty(exports, "keyAllowsVerify", { enumerable: true, get: function () { return keyOps_1.keyAllowsVerify; } });
Object.defineProperty(exports, "assertKeyAllowsSign", { enumerable: true, get: function () { return keyOps_1.assertKeyAllowsSign; } });
Object.defineProperty(exports, "assertKeyAllowsVerify", { enumerable: true, get: function () { return keyOps_1.assertKeyAllowsVerify; } });
Object.defineProperty(exports, "keyAllowsEncrypt", { enumerable: true, get: function () { return keyOps_1.keyAllowsEncrypt; } });
Object.defineProperty(exports, "assertKeyAllowsEncrypt", { enumerable: true, get: function () { return keyOps_1.assertKeyAllowsEncrypt; } });
Object.defineProperty(exports, "keyAllowsDecrypt", { enumerable: true, get: function () { return keyOps_1.keyAllowsDecrypt; } });
Object.defineProperty(exports, "assertKeyAllowsDecrypt", { enumerable: true, get: function () { return keyOps_1.assertKeyAllowsDecrypt; } });
Object.defineProperty(exports, "assertKeyAllowsDerive", { enumerable: true, get: function () { return keyOps_1.assertKeyAllowsDerive; } });
__exportStar(require("./alg"), exports);
var humanDescription_1 = require("./humanDescription");
Object.defineProperty(exports, "getJwkHumanDescription", { enumerable: true, get: function () { return humanDescription_1.getJwkHumanDescription; } });
var equals_1 = require("./equals");
Object.defineProperty(exports, "assymetricJwkKeyTypeMatches", { enumerable: true, get: function () { return equals_1.assymetricJwkKeyTypeMatches; } });
Object.defineProperty(exports, "assymetricPublicJwkMatches", { enumerable: true, get: function () { return equals_1.assymetricPublicJwkMatches; } });
Object.defineProperty(exports, "assertAsymmetricJwkKeyTypeMatches", { enumerable: true, get: function () { return equals_1.assertAsymmetricJwkKeyTypeMatches; } });
var PublicJwk_1 = require("./PublicJwk");
Object.defineProperty(exports, "PublicJwk", { enumerable: true, get: function () { return PublicJwk_1.PublicJwk; } });
//# sourceMappingURL=index.js.map