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
exports.zKmsJwkPrivateRsa = exports.zKmsJwkPrivateToPublicRsa = exports.zKmsJwkPublicRsa = void 0;
const z = __importStar(require("../../../../../utils/zod"));
const jwk_1 = require("../../jwk");
const zKmsJwkPrivateRsaOth = z.array(z
    .object({
    d: z.optional(z.base64Url),
    r: z.optional(z.base64Url),
    t: z.optional(z.base64Url),
})
    .passthrough());
exports.zKmsJwkPublicRsa = z.object({
    ...jwk_1.vJwkCommon.shape,
    kty: z.literal('RSA'),
    // Public
    n: z.base64Url, // Modulus
    e: z.base64Url, // Public exponent
    // Private
    d: z.optional(z.undefined()), // Private exponent
    p: z.optional(z.undefined()), // First prime factor
    q: z.optional(z.undefined()), // Second prime factor
    dp: z.optional(z.undefined()), // First factor CRT exponent
    dq: z.optional(z.undefined()), // Second factor CRT exponent
    qi: z.optional(z.undefined()), // First CRT coefficient
    oth: z.optional(z.undefined()),
});
exports.zKmsJwkPrivateToPublicRsa = z.object({
    ...exports.zKmsJwkPublicRsa.shape,
    d: z.optionalToUndefined(z.base64Url), // Private exponent
    p: z.optionalToUndefined(z.base64Url), // First prime factor
    q: z.optionalToUndefined(z.base64Url), // Second prime factor
    dp: z.optionalToUndefined(z.base64Url), // First factor CRT exponent
    dq: z.optionalToUndefined(z.base64Url), // Second factor CRT exponent
    qi: z.optionalToUndefined(z.base64Url), // First CRT coefficient
    oth: z.optionalToUndefined(zKmsJwkPrivateRsaOth),
});
exports.zKmsJwkPrivateRsa = z.object({
    ...exports.zKmsJwkPublicRsa.shape,
    // Private
    d: z.base64Url, // Private exponent
    p: z.base64Url, // First prime factor
    q: z.base64Url, // Second prime factor
    dp: z.base64Url, // First factor CRT exponent
    dq: z.base64Url, // Second factor CRT exponent
    qi: z.base64Url, // First CRT coefficient
    oth: z.optional(zKmsJwkPrivateRsaOth),
});
//# sourceMappingURL=rsaJwk.js.map