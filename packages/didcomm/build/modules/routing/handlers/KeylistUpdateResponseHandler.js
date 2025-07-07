"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeylistUpdateResponseHandler = void 0;
const messages_1 = require("../messages");
class KeylistUpdateResponseHandler {
    constructor(mediationRecipientService) {
        this.supportedMessages = [messages_1.KeylistUpdateResponseMessage];
        this.mediationRecipientService = mediationRecipientService;
    }
    async handle(messageContext) {
        messageContext.assertReadyConnection();
        await this.mediationRecipientService.processKeylistUpdateResults(messageContext);
        return undefined;
    }
}
exports.KeylistUpdateResponseHandler = KeylistUpdateResponseHandler;
//# sourceMappingURL=KeylistUpdateResponseHandler.js.map