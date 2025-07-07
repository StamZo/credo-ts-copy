"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreDuplicateError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreDuplicateError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreDuplicateError = AskarStoreDuplicateError;
//# sourceMappingURL=AskarStoreDuplicateError.js.map