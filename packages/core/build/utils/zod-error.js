"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
const zod_1 = require("zod");
/**
 * Some code comes from `zod-validation-error` package (MIT License) and
 * was slightly simplified to fit our needs.
 */
const constants = {
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: expected
    identifierRegex: /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u,
    unionSeparator: ', or ',
    issueSeparator: '\n\t- ',
};
function escapeQuotes(str) {
    return str.replace(/"/g, '\\"');
}
function joinPath(path) {
    if (path.length === 1) {
        return path[0].toString();
    }
    return path.reduce((acc, item) => {
        // handle numeric indices
        if (typeof item === 'number') {
            return `${acc}[${item.toString()}]`;
        }
        // handle quoted values
        if (item.includes('"')) {
            return `${acc}["${escapeQuotes(item)}"]`;
        }
        // handle special characters
        if (!constants.identifierRegex.test(item)) {
            return `${acc}["${item}"]`;
        }
        // handle normal values
        const separator = acc.length === 0 ? '' : '.';
        return acc + separator + item;
    }, '');
}
function getMessageFromZodIssue(issue) {
    if (issue.code === zod_1.ZodIssueCode.invalid_union) {
        return getMessageFromUnionErrors(issue.unionErrors);
    }
    if (issue.code === zod_1.ZodIssueCode.invalid_arguments) {
        return [issue.message, ...issue.argumentsError.issues.map((issue) => getMessageFromZodIssue(issue))].join(constants.issueSeparator);
    }
    if (issue.code === zod_1.ZodIssueCode.invalid_return_type) {
        return [issue.message, ...issue.returnTypeError.issues.map((issue) => getMessageFromZodIssue(issue))].join(constants.issueSeparator);
    }
    if (issue.path.length !== 0) {
        // handle array indices
        if (issue.path.length === 1) {
            const identifier = issue.path[0];
            if (typeof identifier === 'number') {
                return `${issue.message} at index ${identifier}`;
            }
        }
        return `${issue.message} at "${joinPath(issue.path)}"`;
    }
    return issue.message;
}
function getMessageFromUnionErrors(unionErrors) {
    return unionErrors
        .reduce((acc, zodError) => {
        const newIssues = zodError.issues.map((issue) => getMessageFromZodIssue(issue)).join(constants.issueSeparator);
        if (!acc.includes(newIssues))
            acc.push(newIssues);
        return acc;
    }, [])
        .join(constants.unionSeparator);
}
function formatZodError(error) {
    if (!error)
        return '';
    return `\t- ${error?.issues.map((issue) => getMessageFromZodIssue(issue)).join(constants.issueSeparator)}`;
}
//# sourceMappingURL=zod-error.js.map