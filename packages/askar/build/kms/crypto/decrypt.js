"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeadDecrypt = aeadDecrypt;
const core_1 = require("@credo-ts/core");
const utils_1 = require("../../utils");
function aeadDecrypt(options) {
    const { key, decryption, encrypted } = options;
    const askarEncryptionAlgorithm = utils_1.jwkEncToAskarAlg[decryption.algorithm];
    if (!askarEncryptionAlgorithm) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`JWA decryption algorithm '${decryption.algorithm}'`, 'askar');
    }
    const decrypted = key.aeadDecrypt({
        ciphertext: encrypted,
        tag: decryption.tag,
        aad: decryption.aad,
        nonce: decryption.iv,
    });
    return decrypted;
}
//# sourceMappingURL=decrypt.js.map