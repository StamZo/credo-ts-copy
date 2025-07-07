"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionProblemReportHandler = void 0;
const messages_1 = require("../messages");
class ConnectionProblemReportHandler {
    constructor(connectionService) {
        this.supportedMessages = [messages_1.ConnectionProblemReportMessage];
        this.connectionService = connectionService;
    }
    async handle(messageContext) {
        await this.connectionService.processProblemReport(messageContext);
        return undefined;
    }
}
exports.ConnectionProblemReportHandler = ConnectionProblemReportHandler;
//# sourceMappingURL=ConnectionProblemReportHandler.js.map