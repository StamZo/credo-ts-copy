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
exports.zKmsJwkPrivateOkp = exports.zKmsJwkPrivateToPublicOkp = exports.zKmsJwkPublicOkp = void 0;
const z = __importStar(require("../../../../../utils/zod"));
const jwk_1 = require("../../jwk");
// TODO: we should probably create a separate Jwk type for each crv, so we
// can use the type in Credo if we need a specific key
exports.zKmsJwkPublicOkp = z.object({
    ...jwk_1.vJwkCommon.shape,
    kty: z.literal('OKP'),
    crv: z.enum(['X25519', 'Ed25519']),
    // Public
    x: z.base64Url,
    // Private
    d: z.optional(z.base64Url),
});
exports.zKmsJwkPrivateToPublicOkp = z.object({
    ...exports.zKmsJwkPublicOkp.shape,
    d: z.optionalToUndefined(z.base64Url),
});
exports.zKmsJwkPrivateOkp = z.object({
    ...exports.zKmsJwkPublicOkp.shape,
    // Private
    d: z.base64Url,
});
//# sourceMappingURL=okpJwk.js.map