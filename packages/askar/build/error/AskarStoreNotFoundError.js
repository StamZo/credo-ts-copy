"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreNotFoundError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreNotFoundError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreNotFoundError = AskarStoreNotFoundError;
//# sourceMappingURL=AskarStoreNotFoundError.js.map