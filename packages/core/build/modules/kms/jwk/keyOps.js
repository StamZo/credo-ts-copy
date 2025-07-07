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
exports.zJwkKeyOps = exports.zKnownJwkKeyOps = exports.zJwkUse = exports.zKnownJwkUse = void 0;
exports.keyAllowsDerive = keyAllowsDerive;
exports.assertKeyAllowsDerive = assertKeyAllowsDerive;
exports.keyAllowsVerify = keyAllowsVerify;
exports.assertKeyAllowsVerify = assertKeyAllowsVerify;
exports.keyAllowsSign = keyAllowsSign;
exports.assertKeyAllowsSign = assertKeyAllowsSign;
exports.keyAllowsEncrypt = keyAllowsEncrypt;
exports.assertKeyAllowsEncrypt = assertKeyAllowsEncrypt;
exports.keyAllowsDecrypt = keyAllowsDecrypt;
exports.assertKeyAllowsDecrypt = assertKeyAllowsDecrypt;
const z = __importStar(require("../../../utils/zod"));
const KeyManagementError_1 = require("../error/KeyManagementError");
const humanDescription_1 = require("./humanDescription");
exports.zKnownJwkUse = z.union([z.literal('sig').describe('signature'), z.literal('enc').describe('encryption')]);
exports.zJwkUse = z.union([exports.zKnownJwkUse, z.string()]);
exports.zKnownJwkKeyOps = z.union([
    z.literal('sign').describe('compute digital signature or MAC'),
    z.literal('verify').describe('verify digital signature or MAC'),
    z.literal('encrypt').describe('encrypt content'),
    z.literal('decrypt').describe('decrypt content and validate decryption, if applicable'),
    z.literal('wrapKey').describe('encrypt key'),
    z.literal('unwrapKey').describe('decrypt key and validate decryption, if applicable'),
    z.literal('deriveKey').describe('derive key'),
    z.literal('deriveBits').describe('derive bits not to be used as a key'),
]);
exports.zJwkKeyOps = z.uniqueArray(z.union([exports.zKnownJwkKeyOps, z.string()]));
function keyAllowsDerive(key) {
    // Check if key has use/key_ops restrictions
    if (key.use && key.use !== 'enc') {
        return false;
    }
    if (key.key_ops && !key.key_ops.includes('deriveKey')) {
        return false;
    }
    return true;
}
function assertKeyAllowsDerive(jwk) {
    if (!keyAllowsDerive(jwk)) {
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} usage does not allow key derivation operations`);
    }
}
function keyAllowsVerify(key) {
    // Check if key has use/key_ops restrictions
    if (key.use && key.use !== 'sig') {
        return false;
    }
    if (key.key_ops && !key.key_ops.includes('verify')) {
        return false;
    }
    return true;
}
function assertKeyAllowsVerify(jwk) {
    if (!keyAllowsVerify(jwk)) {
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} usage does not allow verification operations`);
    }
}
function keyAllowsSign(key) {
    // Check if key has use/key_ops restrictions
    if (key.use && key.use !== 'sig') {
        return false;
    }
    if (key.key_ops && !key.key_ops.includes('sign')) {
        return false;
    }
    return true;
}
function assertKeyAllowsSign(jwk) {
    if (!keyAllowsSign(jwk)) {
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} usage does not allow signing operations`);
    }
}
function keyAllowsEncrypt(key) {
    // Check if key has use/key_ops restrictions
    if (key.use && key.use !== 'enc') {
        return false;
    }
    if (key.key_ops && !key.key_ops.includes('encrypt')) {
        return false;
    }
    return true;
}
function assertKeyAllowsEncrypt(jwk) {
    if (!keyAllowsEncrypt(jwk)) {
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} usage does not allow encryption operations`);
    }
}
function keyAllowsDecrypt(key) {
    // Check if key has use/key_ops restrictions
    if (key.use && key.use !== 'enc') {
        return false;
    }
    if (key.key_ops && !key.key_ops.includes('decrypt')) {
        return false;
    }
    return true;
}
function assertKeyAllowsDecrypt(jwk) {
    if (!keyAllowsDecrypt(jwk)) {
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} usage does not allow decryption operations`);
    }
}
//# sourceMappingURL=keyOps.js.map