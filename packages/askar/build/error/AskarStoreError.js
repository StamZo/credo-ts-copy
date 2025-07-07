"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreError = void 0;
const core_1 = require("@credo-ts/core");
class AskarStoreError extends core_1.CredoError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreError = AskarStoreError;
//# sourceMappingURL=AskarStoreError.js.map