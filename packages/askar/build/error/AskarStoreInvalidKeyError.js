"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreInvalidKeyError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreInvalidKeyError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreInvalidKeyError = AskarStoreInvalidKeyError;
//# sourceMappingURL=AskarStoreInvalidKeyError.js.map