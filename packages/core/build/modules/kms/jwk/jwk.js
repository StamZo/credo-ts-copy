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
exports.vJwk = exports.vJwkCommon = void 0;
const z = __importStar(require("../../../utils/zod"));
const keyOps_1 = require("./keyOps");
exports.vJwkCommon = z
    .object({
    kty: z.string(),
    kid: z.optional(z.string()),
    alg: z.optional(z.string()),
    key_ops: z.optional(keyOps_1.zJwkKeyOps),
    use: z.optional(keyOps_1.zJwkUse),
    ext: z.optional(z.boolean()),
    x5c: z.optional(z.array(z.string())),
    x5t: z.optional(z.string()),
    'x5t#S256': z.optional(z.string()),
    x5u: z.optional(z.string()),
})
    .passthrough();
// This can be used to verify the general structure matches
// without verifying any key type specific combinations (just
// that if e.g. x is present it should be a string)
exports.vJwk = z
    .object({
    ...exports.vJwkCommon.shape,
    // EC/OKP
    crv: z.optional(z.string()),
    x: z.optional(z.string()),
    d: z.optional(z.string()),
    // EC
    y: z.optional(z.string()),
    // oct
    k: z.optional(z.string()),
    // RSA
    e: z.optional(z.string()),
    n: z.optional(z.string()),
    dp: z.optional(z.string()),
    dq: z.optional(z.string()),
    oth: z.optional(z.array(z
        .object({
        d: z.optional(z.string()),
        r: z.optional(z.string()),
        t: z.optional(z.string()),
    })
        .passthrough())),
    p: z.optional(z.string()),
    q: z.optional(z.string()),
    qi: z.optional(z.string()),
})
    .passthrough();
//# sourceMappingURL=jwk.js.map