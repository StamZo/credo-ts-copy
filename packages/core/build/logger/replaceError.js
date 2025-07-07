"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceError = replaceError;
/*
 * The replacer parameter allows you to specify a function that replaces values with your own. We can use it to control what gets stringified.
 */
function replaceError(_, value) {
    if (value instanceof Error) {
        return value.toString();
    }
    return value;
}
//# sourceMappingURL=replaceError.js.map