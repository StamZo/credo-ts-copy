"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidExchangeProblemReportError = void 0;
const errors_1 = require("../../../errors");
const messages_1 = require("../messages");
class DidExchangeProblemReportError extends errors_1.ProblemReportError {
    constructor(message, { problemCode }) {
        super(message, { problemCode });
        this.message = message;
        this.problemReport = new messages_1.DidExchangeProblemReportMessage({
            description: {
                en: message,
                code: problemCode,
            },
        });
    }
}
exports.DidExchangeProblemReportError = DidExchangeProblemReportError;
//# sourceMappingURL=DidExchangeProblemReportError.js.map