"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreImportPathExistsError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreImportPathExistsError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreImportPathExistsError = AskarStoreImportPathExistsError;
//# sourceMappingURL=AskarStoreImportPathExistsError.js.map