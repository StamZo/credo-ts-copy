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
exports.zKmsDecryptOptions = void 0;
const z = __importStar(require("../../../utils/zod"));
const jwa_1 = require("../jwk/jwa");
const octJwk_1 = require("../jwk/kty/oct/octJwk");
const KmsKeyAgreementDecryptOptions_1 = require("./KmsKeyAgreementDecryptOptions");
const common_1 = require("./common");
const zKmsDecryptDataDecryptionAesGcm = z.object({
    // AES-GCM Content Decryption
    algorithm: z.enum([
        jwa_1.KnownJwaContentEncryptionAlgorithms.A128GCM,
        jwa_1.KnownJwaContentEncryptionAlgorithms.A192GCM,
        jwa_1.KnownJwaContentEncryptionAlgorithms.A256GCM,
    ]),
    iv: z.instanceof(Uint8Array).refine((iv) => iv.length === 12, 'iv must be 12 bytes for AES GCM'),
    aad: z.optional(z.instanceof(Uint8Array)),
    tag: z.instanceof(Uint8Array),
});
// AES-CBC Content Decryption
const zKmsDecryptDataDecryptionAesCbc = z.object({
    algorithm: z.enum([jwa_1.KnownJwaContentEncryptionAlgorithms.A128CBC, jwa_1.KnownJwaContentEncryptionAlgorithms.A256CBC]),
    iv: z.instanceof(Uint8Array).refine((iv) => iv.length === 16, 'iv must be 16 bytes for AES CBC'),
});
// AES-CBC Content Decryption
const zKmsDecryptDataDecryptionAesCbcHmac = z.object({
    algorithm: z.enum([
        jwa_1.KnownJwaContentEncryptionAlgorithms.A128CBC_HS256,
        jwa_1.KnownJwaContentEncryptionAlgorithms.A192CBC_HS384,
        jwa_1.KnownJwaContentEncryptionAlgorithms.A256CBC_HS512,
    ]),
    iv: z.instanceof(Uint8Array).refine((iv) => iv.length === 16, 'iv must be 16 bytes for AES CBC with HMAC'),
    aad: z.optional(z.instanceof(Uint8Array)),
    tag: z.instanceof(Uint8Array),
});
// XSalsa20-Poly1305 Content Decryption
const zKmsDecryptDataDecryptionSalsa = z.object({
    algorithm: z.enum([jwa_1.KnownJwaContentEncryptionAlgorithms['XSALSA20-POLY1305']]),
    iv: z.instanceof(Uint8Array).optional(),
});
// ChaCha20-Poly1305 Content Decryption
const zKmsDecryptDataDecryptionC20p = z.object({
    algorithm: z.enum([jwa_1.KnownJwaContentEncryptionAlgorithms.C20P, jwa_1.KnownJwaContentEncryptionAlgorithms.XC20P]),
    iv: z.instanceof(Uint8Array),
    aad: z.optional(z.instanceof(Uint8Array)),
    tag: z.instanceof(Uint8Array),
});
const zKmsDecryptDataDecryption = z.discriminatedUnion('algorithm', [
    zKmsDecryptDataDecryptionAesCbc,
    zKmsDecryptDataDecryptionAesCbcHmac,
    zKmsDecryptDataDecryptionAesGcm,
    zKmsDecryptDataDecryptionC20p,
    zKmsDecryptDataDecryptionSalsa,
]);
exports.zKmsDecryptOptions = z.object({
    /**
     * The key to use for decrypting. There are three possible formats:
     * - a key id, pointing to a symmetric (oct) jwk that can be used directly for decryption
     * - a private symmetric (oct) jwk object that can be used directly for decryption
     * - an object configuring key agreement, based on an existing assymetric key
     */
    key: z.union([
        z.object({
            keyId: common_1.zKmsKeyId,
            // never helps with type narrowing
            privateJwk: z.never().optional(),
            keyAgreement: z.never().optional(),
        }),
        z.object({
            privateJwk: octJwk_1.zKmsJwkPrivateOct.describe('A private oct (symmetric) jwk'),
            // never helps with type narrowing
            keyId: z.never().optional(),
            keyAgreement: z.never().optional(),
        }),
        z.object({
            keyAgreement: KmsKeyAgreementDecryptOptions_1.zKmsKeyAgreementDecryptOptions,
            // never helps with type narrowing
            keyId: z.never().optional(),
            privateJwk: z.never().optional(),
        }),
    ]),
    /**
     * The decryption algorithm used to decrypt the data/content.
     * In JWE this parameter is referred to as "enc".
     */
    decryption: zKmsDecryptDataDecryption.describe('Options related to the decryption algorithm to use for decrypting the data'),
    /**
     * The encrypted data to decrypt
     */
    encrypted: z.instanceof(Uint8Array).describe('The encrypted data to decrypt'),
});
//# sourceMappingURL=KmsDecryptOptions.js.map