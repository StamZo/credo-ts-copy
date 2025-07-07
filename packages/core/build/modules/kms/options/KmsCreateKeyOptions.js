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
exports.zKmsCreateKeyForSignatureAlgorithmOptions = exports.zKmsCreateKeyOptions = exports.zKmsCreateKeyType = exports.zKmsCreateKeyTypeAssymetric = exports.zKmsCreateKeyTypeOct = void 0;
const z = __importStar(require("../../../utils/zod"));
const jwa_1 = require("../jwk/jwa");
const ecJwk_1 = require("../jwk/kty/ec/ecJwk");
const octJwk_1 = require("../jwk/kty/oct/octJwk");
const okpJwk_1 = require("../jwk/kty/okp/okpJwk");
const rsaJwk_1 = require("../jwk/kty/rsa/rsaJwk");
const common_1 = require("./common");
const zKmsCreateKeyTypeEc = ecJwk_1.zKmsJwkPublicEc.pick({ kty: true, crv: true });
/**
 * Octer key pair, commonly used for Ed25519 and X25519 key types
 */
const zKmsCreateKeyTypeOkp = okpJwk_1.zKmsJwkPublicOkp.pick({ kty: true, crv: true });
/**
 * RSA key pair.
 */
const zKmsCreateKeyTypeRsa = rsaJwk_1.zKmsJwkPublicRsa.pick({ kty: true }).extend({
    modulusLength: z.union([z.literal(2048), z.literal(3072), z.literal(4096)]),
});
/**
 * Represents an octect sequence for symmetric keys
 */
exports.zKmsCreateKeyTypeOct = z.discriminatedUnion('algorithm', [
    z.object({
        kty: octJwk_1.zKmsJwkPublicOct.shape.kty,
        algorithm: z.literal('aes'),
        length: z.union([
            z.literal(128),
            z.literal(192),
            z.literal(256),
            z
                .number()
                .int()
                .refine((length) => length % 8 === 0, 'aes key length must be multiple of 8'),
        ]),
    }),
    z.object({
        kty: octJwk_1.zKmsJwkPublicOct.shape.kty,
        algorithm: z.literal('hmac').describe('For usage with HS256, HS384 and HS512'),
        length: z.union([z.literal(256), z.literal(384), z.literal(512)]),
    }),
    z.object({
        kty: octJwk_1.zKmsJwkPublicOct.shape.kty,
        /**
         * For usage with ChaCha20-Poly1305 and XChaCha20-Poly1305
         */
        algorithm: z.literal('C20P').describe('For usage with ChaCha20-Poly1305 and XChaCha20-Poly1305'),
    }),
]);
exports.zKmsCreateKeyTypeAssymetric = z.union([zKmsCreateKeyTypeEc, zKmsCreateKeyTypeOkp, zKmsCreateKeyTypeRsa]);
// TOOD: see if we can use nested discriminated union with zod?
exports.zKmsCreateKeyType = z.union([
    zKmsCreateKeyTypeEc,
    zKmsCreateKeyTypeOkp,
    zKmsCreateKeyTypeRsa,
    exports.zKmsCreateKeyTypeOct,
]);
exports.zKmsCreateKeyOptions = z.object({
    keyId: z.optional(common_1.zKmsKeyId),
    type: exports.zKmsCreateKeyType,
});
exports.zKmsCreateKeyForSignatureAlgorithmOptions = z.object({
    keyId: z.optional(common_1.zKmsKeyId),
    algorithm: jwa_1.zKnownJwaSignatureAlgorithm,
});
//# sourceMappingURL=KmsCreateKeyOptions.js.map