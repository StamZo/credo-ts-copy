"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementKeyExistsError = void 0;
const KeyManagementError_1 = require("./KeyManagementError");
class KeyManagementKeyExistsError extends KeyManagementError_1.KeyManagementError {
    constructor(keyId, backend) {
        super(`A key with key id '${keyId}' already exists in backend '${backend}'`);
    }
}
exports.KeyManagementKeyExistsError = KeyManagementKeyExistsError;
//# sourceMappingURL=KeyManagementKeyExistsError.js.map