"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2PresentationProblemReportError = void 0;
const errors_1 = require("../../../../../errors");
const messages_1 = require("../messages");
class V2PresentationProblemReportError extends errors_1.ProblemReportError {
    constructor(message, { problemCode }) {
        super(message, { problemCode });
        this.message = message;
        this.problemReport = new messages_1.V2PresentationProblemReportMessage({
            description: {
                en: message,
                code: problemCode,
            },
        });
    }
}
exports.V2PresentationProblemReportError = V2PresentationProblemReportError;
//# sourceMappingURL=V2PresentationProblemReportError.js.map