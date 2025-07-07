"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemReportError = void 0;
const core_1 = require("@credo-ts/core");
const ProblemReportMessage_1 = require("../../messages/problem-reports/ProblemReportMessage");
class ProblemReportError extends core_1.CredoError {
    constructor(message, { problemCode }) {
        super(message);
        this.problemReport = new ProblemReportMessage_1.ProblemReportMessage({
            description: {
                en: message,
                code: problemCode,
            },
        });
    }
}
exports.ProblemReportError = ProblemReportError;
//# sourceMappingURL=ProblemReportError.js.map