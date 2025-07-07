"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementKeyNotFoundError = void 0;
const KeyManagementError_1 = require("./KeyManagementError");
class KeyManagementKeyNotFoundError extends KeyManagementError_1.KeyManagementError {
    constructor(keyId, backend) {
        super(`Key with key id '${keyId}' not found in backend '${backend}'`);
    }
}
exports.KeyManagementKeyNotFoundError = KeyManagementKeyNotFoundError;
//# sourceMappingURL=KeyManagementKeyNotFoundError.js.map