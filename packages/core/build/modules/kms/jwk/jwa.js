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
exports.KnownJwaKeyAgreementAlgorithms = exports.KnownJwaKeyEncryptionAlgorithms = exports.zKnownJwaContentEncryptionAlgorithm = exports.KnownJwaContentEncryptionAlgorithms = exports.zKnownJwaSignatureAlgorithm = exports.KnownJwaSignatureAlgorithms = void 0;
exports.isKnownJwaSignatureAlgorithm = isKnownJwaSignatureAlgorithm;
const z = __importStar(require("../../../utils/zod"));
function recordToUnion(record) {
    return Object.values(record);
}
exports.KnownJwaSignatureAlgorithms = {
    HS256: 'HS256',
    HS384: 'HS384',
    HS512: 'HS512',
    RS256: 'RS256',
    RS384: 'RS384',
    RS512: 'RS512',
    ES256: 'ES256',
    ES384: 'ES384',
    ES512: 'ES512',
    PS256: 'PS256',
    PS384: 'PS384',
    PS512: 'PS512',
    EdDSA: 'EdDSA',
    ES256K: 'ES256K',
};
exports.zKnownJwaSignatureAlgorithm = z.enum(recordToUnion(exports.KnownJwaSignatureAlgorithms));
function isKnownJwaSignatureAlgorithm(alg) {
    return Object.values(exports.KnownJwaSignatureAlgorithms).includes(alg);
}
// Content encryption algorithms ("enc" parameter)
exports.KnownJwaContentEncryptionAlgorithms = {
    // AES-GCM Content Encryption
    A128GCM: 'A128GCM',
    A192GCM: 'A192GCM',
    A256GCM: 'A256GCM',
    // AES-CBC Content Encryption
    A128CBC: 'A128CBC',
    A256CBC: 'A256CBC',
    // (X)ChaCha20-Poly1305
    C20P: 'C20P',
    XC20P: 'XC20P',
    /**
     * As is used in DIDComm v1
     */
    'XSALSA20-POLY1305': 'XSALSA20-POLY1305',
    A128CBC_HS256: 'A128CBC-HS256',
    A192CBC_HS384: 'A192CBC-HS384',
    A256CBC_HS512: 'A256CBC-HS512',
};
exports.zKnownJwaContentEncryptionAlgorithm = z.enum(recordToUnion(exports.KnownJwaContentEncryptionAlgorithms));
exports.KnownJwaKeyEncryptionAlgorithms = {
    // AES Key Wrapping
    A128KW: 'A128KW',
    A192KW: 'A192KW',
    A256KW: 'A256KW',
};
const zKnownJwaKeyEncryptionAlgorithm = z.enum(recordToUnion(exports.KnownJwaKeyEncryptionAlgorithms));
// Key derivation / wrapping algorithms ("alg" parameter)
exports.KnownJwaKeyAgreementAlgorithms = {
    // ECDH-ES with P-256/P-384/P-521
    ECDH_ES: 'ECDH-ES',
    ECDH_ES_A128KW: 'ECDH-ES+A128KW',
    ECDH_ES_A192KW: 'ECDH-ES+A192KW',
    ECDH_ES_A256KW: 'ECDH-ES+A256KW',
    ECDH_HSALSA20: 'ECDH-HSALSA20',
};
const zKnownJwaKeyAgreementAlgorithm = z.enum(recordToUnion(exports.KnownJwaKeyAgreementAlgorithms));
//# sourceMappingURL=jwa.js.map