"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeadEncrypt = aeadEncrypt;
const core_1 = require("@credo-ts/core");
const utils_1 = require("../../utils");
function aeadEncrypt(options) {
    const { key, encryption, data } = options;
    const askarEncryptionAlgorithm = utils_1.jwkEncToAskarAlg[encryption.algorithm];
    if (!askarEncryptionAlgorithm) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`JWA encryption algorithm '${encryption.algorithm}'`, 'askar');
    }
    const encrypted = key.aeadEncrypt({
        message: data,
        aad: 'aad' in encryption ? encryption.aad : undefined,
        nonce: 'iv' in encryption ? encryption.iv : undefined,
    });
    return {
        encrypted: encrypted.ciphertext,
        iv: encrypted.nonce,
        tag: encrypted.tag,
    };
}
//# sourceMappingURL=encrypt.js.map