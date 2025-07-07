"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSupportedKeyAgreementAlgorithm = assertSupportedKeyAgreementAlgorithm;
exports.assertSupportedEncryptionAlgorithm = assertSupportedEncryptionAlgorithm;
const KeyManagementAlgorithmNotSupportedError_1 = require("../error/KeyManagementAlgorithmNotSupportedError");
function assertSupportedKeyAgreementAlgorithm(keyAgreement, supportedAlgorithms, backend) {
    if (!supportedAlgorithms.includes(keyAgreement.algorithm)) {
        throw new KeyManagementAlgorithmNotSupportedError_1.KeyManagementAlgorithmNotSupportedError(`JWA key agreement algorithm '${keyAgreement.algorithm}'`, backend);
    }
}
function assertSupportedEncryptionAlgorithm(encryption, supportedAlgorithms, backend) {
    if (!supportedAlgorithms.includes(encryption.algorithm)) {
        throw new KeyManagementAlgorithmNotSupportedError_1.KeyManagementAlgorithmNotSupportedError(`JWA encryption algorithm '${encryption.algorithm}'`, backend);
    }
}
//# sourceMappingURL=assertSupported.js.map