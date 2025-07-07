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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.zKmsJwkPrivateAsymmetric = exports.zKmsJwkPrivate = exports.zKmsJwkPrivateCrv = exports.zKmsJwkPublic = exports.zKmsJwkPublicCrv = exports.zKmsJwkPublicAsymmetric = void 0;
exports.isJwkAsymmetric = isJwkAsymmetric;
exports.assertJwkAsymmetric = assertJwkAsymmetric;
exports.publicJwkFromPrivateJwk = publicJwkFromPrivateJwk;
const z = __importStar(require("../../../utils/zod"));
const KeyManagementError_1 = require("../error/KeyManagementError");
const ecJwk_1 = require("./kty/ec/ecJwk");
const octJwk_1 = require("./kty/oct/octJwk");
const okpJwk_1 = require("./kty/okp/okpJwk");
const rsaJwk_1 = require("./kty/rsa/rsaJwk");
exports.zKmsJwkPublicAsymmetric = z.discriminatedUnion('kty', [
    ecJwk_1.zKmsJwkPublicEc,
    rsaJwk_1.zKmsJwkPublicRsa,
    okpJwk_1.zKmsJwkPublicOkp,
]);
function isJwkAsymmetric(jwk) {
    return jwk.kty !== 'oct';
}
function assertJwkAsymmetric(jwk, keyId) {
    if (!isJwkAsymmetric(jwk)) {
        if (keyId) {
            throw new KeyManagementError_1.KeyManagementError(`Expected jwk with keyId ${keyId} to be an assymetric jwk, but found kty 'oct'`);
        }
        throw new KeyManagementError_1.KeyManagementError("Expected jwk to be an assymetric jwk, but found kty 'oct'");
    }
}
exports.zKmsJwkPublicCrv = z.discriminatedUnion('kty', [ecJwk_1.zKmsJwkPublicEc, okpJwk_1.zKmsJwkPublicOkp]);
exports.zKmsJwkPublic = z.discriminatedUnion('kty', [
    ecJwk_1.zKmsJwkPublicEc,
    rsaJwk_1.zKmsJwkPublicRsa,
    octJwk_1.zKmsJwkPublicOct,
    okpJwk_1.zKmsJwkPublicOkp,
]);
const zKmsJwkPrivateToPublic = z
    .discriminatedUnion('kty', [
    ecJwk_1.zKmsJwkPrivateToPublicEc,
    rsaJwk_1.zKmsJwkPrivateToPublicRsa,
    octJwk_1.zKmsJwkPrivateToPublicOct,
    okpJwk_1.zKmsJwkPrivateToPublicOkp,
])
    // Mdoc library does not work well with undefined values. It should not be needed
    // but for now it's the easiest approach
    .transform((jwk) => Object.fromEntries(Object.entries(jwk).filter(([, value]) => value !== undefined)));
exports.zKmsJwkPrivateCrv = z.discriminatedUnion('kty', [ecJwk_1.zKmsJwkPrivateEc, okpJwk_1.zKmsJwkPrivateOkp]);
exports.zKmsJwkPrivate = z.discriminatedUnion('kty', [
    ecJwk_1.zKmsJwkPrivateEc,
    rsaJwk_1.zKmsJwkPrivateRsa,
    octJwk_1.zKmsJwkPrivateOct,
    okpJwk_1.zKmsJwkPrivateOkp,
]);
exports.zKmsJwkPrivateAsymmetric = z.discriminatedUnion('kty', [
    ecJwk_1.zKmsJwkPrivateEc,
    rsaJwk_1.zKmsJwkPrivateRsa,
    okpJwk_1.zKmsJwkPrivateOkp,
]);
function publicJwkFromPrivateJwk(privateJwk) {
    // This will remove any private properties
    return z.parseWithErrorHandling(zKmsJwkPrivateToPublic, privateJwk);
}
//# sourceMappingURL=knownJwk.js.map