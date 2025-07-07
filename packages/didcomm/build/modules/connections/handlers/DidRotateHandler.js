"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidRotateHandler = void 0;
const core_1 = require("@credo-ts/core");
const messages_1 = require("../messages");
class DidRotateHandler {
    constructor(didRotateService, connectionService) {
        this.supportedMessages = [messages_1.DidRotateMessage];
        this.didRotateService = didRotateService;
        this.connectionService = connectionService;
    }
    async handle(messageContext) {
        const { connection, recipientKey } = messageContext;
        if (!connection) {
            throw new core_1.CredoError(`Connection for verkey ${recipientKey?.fingerprint} not found!`);
        }
        return this.didRotateService.processRotate(messageContext);
    }
}
exports.DidRotateHandler = DidRotateHandler;
//# sourceMappingURL=DidRotateHandler.js.map