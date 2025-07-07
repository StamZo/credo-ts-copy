"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarError = void 0;
const core_1 = require("@credo-ts/core");
class AskarError extends core_1.CredoError {
    constructor(message, { cause } = {}) {
        super(message, { cause });
    }
}
exports.AskarError = AskarError;
//# sourceMappingURL=AskarError.js.map