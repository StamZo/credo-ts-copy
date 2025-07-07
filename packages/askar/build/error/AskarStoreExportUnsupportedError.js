"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarStoreExportUnsupportedError = void 0;
const AskarStoreError_1 = require("./AskarStoreError");
class AskarStoreExportUnsupportedError extends AskarStoreError_1.AskarStoreError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarStoreExportUnsupportedError = AskarStoreExportUnsupportedError;
//# sourceMappingURL=AskarStoreExportUnsupportedError.js.map