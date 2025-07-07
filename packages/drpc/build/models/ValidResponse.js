"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidDrpcResponse = IsValidDrpcResponse;
exports.isValidDrpcResponse = isValidDrpcResponse;
const class_validator_1 = require("class-validator");
function IsValidDrpcResponse(validationOptions) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return (target, propertyKey) => {
        (0, class_validator_1.ValidateBy)({
            name: 'isValidDrpcResponse',
            validator: {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                validate: (value) => {
                    // Check if value is a valid DrpcResponseObject, an array of DrpcResponseObject (possibly mixed with empty objects), or an empty object
                    let isValid = false;
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            isValid = value.every(isValidDrpcResponse);
                        }
                    }
                    else {
                        isValid = isValidDrpcResponse(value);
                    }
                    if (!isValid) {
                        throw new class_validator_1.ValidationError();
                    }
                    return isValid;
                },
                defaultMessage: (0, class_validator_1.buildMessage)((eachPrefix) => `${eachPrefix}$property is not a valid DrpcResponse`, validationOptions),
            },
        }, validationOptions)(target, propertyKey);
    };
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isValidDrpcResponse(value) {
    // Check if value is an object
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    // Check if it's an empty object
    if (Object.keys(value).length === 0) {
        return true;
    }
    // Check if it's a valid DrpcResponseObject
    if ('jsonrpc' in value && 'id' in value) {
        // Check if 'result' and 'error' are valid
        if ('result' in value && typeof value.result === 'undefined') {
            return false;
        }
        if ('error' in value && !isValidDrpcResponseError(value.error)) {
            return false;
        }
        return true;
    }
    return false;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isValidDrpcResponseError(error) {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}
//# sourceMappingURL=ValidResponse.js.map