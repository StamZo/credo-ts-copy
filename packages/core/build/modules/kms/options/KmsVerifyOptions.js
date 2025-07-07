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
exports.zKmsVerifyOptions = void 0;
const z = __importStar(require("../../../utils/zod"));
const jwa_1 = require("../jwk/jwa");
const knownJwk_1 = require("../jwk/knownJwk");
const common_1 = require("./common");
exports.zKmsVerifyOptions = z.object({
    /**
     * The key to verify with. Either a string referring to a keyId, or a `KmsJwkPublicAssymetric` for verifying with a
     * public asymmetric JWK.
     *
     * It is currently not possible to verify a signature with symmetric a
     * key that is not already present in the KMS.
     */
    key: z.union([
        z.object({
            keyId: common_1.zKmsKeyId,
            // never helps with type narrowing
            publicJwk: z.never().optional(),
        }),
        z.object({
            publicJwk: knownJwk_1.zKmsJwkPublicAsymmetric,
            // never helps with type narrowing
            keyId: z.never().optional(),
        }),
    ]),
    /**
     * The JWA signature algorithm to use for verification
     */
    algorithm: jwa_1.zKnownJwaSignatureAlgorithm.describe('The JWA signature algorithm to use for verification'),
    /**
     * The data to verify
     */
    data: z.instanceof(Uint8Array).describe('The data to verify'),
    /**
     * The signature to verify the data against
     */
    signature: z.instanceof(Uint8Array).describe('The signature on the data to verify'),
});
//# sourceMappingURL=KmsVerifyOptions.js.map