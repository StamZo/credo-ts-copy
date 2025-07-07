"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1CredentialProblemReportError = void 0;
const didcomm_1 = require("@credo-ts/didcomm");
const messages_1 = require("../messages");
class V1CredentialProblemReportError extends didcomm_1.ProblemReportError {
    constructor(message, { problemCode }) {
        super(message, { problemCode });
        this.problemReport = new messages_1.V1CredentialProblemReportMessage({
            description: {
                en: message,
                code: problemCode,
            },
        });
    }
}
exports.V1CredentialProblemReportError = V1CredentialProblemReportError;
//# sourceMappingURL=V1CredentialProblemReportError.js.map