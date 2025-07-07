"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationError = void 0;
const zod_error_1 = require("../utils/zod-error");
const CredoError_1 = require("./CredoError");
class ZodValidationError extends CredoError_1.CredoError {
    constructor(message, zodError) {
        const formattedError = (0, zod_error_1.formatZodError)(zodError);
        super(`${message}\n${formattedError}`);
        this.zodError = zodError;
    }
}
exports.ZodValidationError = ZodValidationError;
//# sourceMappingURL=ZodValidationError.js.map