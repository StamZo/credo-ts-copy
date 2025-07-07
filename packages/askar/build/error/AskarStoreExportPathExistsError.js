"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreExportPathExistsError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreExportPathExistsError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreExportPathExistsError = AskarStoreExportPathExistsError;
//# sourceMappingURL=AskarStoreExportPathExistsError.js.map