"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionProblemReportError = void 0;
const errors_1 = require("../../../errors");
const messages_1 = require("../messages");
class ConnectionProblemReportError extends errors_1.ProblemReportError {
    constructor(message, { problemCode }) {
        super(message, { problemCode });
        this.message = message;
        this.problemReport = new messages_1.ConnectionProblemReportMessage({
            description: {
                en: message,
                code: problemCode,
            },
        });
    }
}
exports.ConnectionProblemReportError = ConnectionProblemReportError;
//# sourceMappingURL=ConnectionProblemReportError.js.map