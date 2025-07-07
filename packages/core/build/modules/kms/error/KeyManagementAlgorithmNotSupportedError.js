"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementAlgorithmNotSupportedError = void 0;
const KeyManagementError_1 = require("./KeyManagementError");
class KeyManagementAlgorithmNotSupportedError extends KeyManagementError_1.KeyManagementError {
    constructor(notSupported, backend) {
        super(`${backend} backend does not support ${notSupported}.`);
        this.backend = backend;
    }
}
exports.KeyManagementAlgorithmNotSupportedError = KeyManagementAlgorithmNotSupportedError;
//# sourceMappingURL=KeyManagementAlgorithmNotSupportedError.js.map