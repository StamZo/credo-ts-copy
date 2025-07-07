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
exports.zKmsKeyAgreementDecryptOptions = void 0;
const z = __importStar(require("../../../utils/zod"));
const okpJwk_1 = require("../jwk/kty/okp/okpJwk");
const KmsEncryptOptions_1 = require("./KmsEncryptOptions");
const KmsKeyAgreementEncryptOptions_1 = require("./KmsKeyAgreementEncryptOptions");
const common_1 = require("./common");
const zKmsKeyAgreementDecryptEcdhEsKw = z.object({
    /**
     * The key id pointing to the ephemeral public key.
     *
     * The key type MUST match with the externalPublicJwk
     */
    keyId: common_1.zKmsKeyId,
    algorithm: z.enum(['ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']),
    externalPublicJwk: KmsKeyAgreementEncryptOptions_1.zKmsJwkPublicEcdh,
    /**
     * The encrypted content encryption key (cek)
     */
    encryptedKey: KmsEncryptOptions_1.zKmsEncryptedKey,
    apu: z.optional(z.instanceof(Uint8Array)),
    apv: z.optional(z.instanceof(Uint8Array)),
});
const zKmsKeyAgreementDecryptEcdhHsalsa20 = z.object({
    /**
     * The key id to use for decrypting the content encryption key.
     */
    keyId: common_1.zKmsKeyId,
    /**
     * Perform key agreement based on the HSALSA20 as used in Libsodium's
     * Cryptobox. This is not based on an official JWA algorithm, but is
     * used primarily for DIDComm v1 messaging.
     */
    algorithm: z.literal('ECDH-HSALSA20'),
    /**
     * Can be undefined for anonymous encryption
     */
    externalPublicJwk: okpJwk_1.zKmsJwkPublicOkp.extend({ crv: okpJwk_1.zKmsJwkPublicOkp.shape.crv.extract(['X25519']) }).optional(),
});
exports.zKmsKeyAgreementDecryptOptions = z
    .discriminatedUnion('algorithm', [
    KmsKeyAgreementEncryptOptions_1.zKmsKeyAgreementEcdhEs,
    zKmsKeyAgreementDecryptEcdhEsKw,
    zKmsKeyAgreementDecryptEcdhHsalsa20,
])
    .describe('Options for key agreement based on an assymetric key.');
//# sourceMappingURL=KmsKeyAgreementDecryptOptions.js.map