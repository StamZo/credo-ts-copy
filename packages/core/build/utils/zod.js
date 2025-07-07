"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Url = exports.optionalToUndefined = exports.uniqueArray = void 0;
exports.parseWithErrorHandling = parseWithErrorHandling;
const zod_1 = require("zod");
const error_1 = require("../error");
function parseWithErrorHandling(schema, data, customErrorMessage) {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
        throw new error_1.ZodValidationError(customErrorMessage ?? `Error validating schema with data ${JSON.stringify(data)}`, parseResult.error);
    }
    return parseResult.data;
}
const zUniqueArray = (item) => zod_1.z.array(item).refine((a) => new Set(a).size === a.length, 'Array must have unique values');
exports.uniqueArray = zUniqueArray;
const zOptionalToUndefined = (item) => zod_1.z.optional(item.transform(() => undefined));
exports.optionalToUndefined = zOptionalToUndefined;
const zBase64Url = zod_1.z.string().regex(/[a-zA-Z0-9_-]+/, 'Must be a base64url string');
exports.base64Url = zBase64Url;
__exportStar(require("zod"), exports);
//# sourceMappingURL=zod.js.map