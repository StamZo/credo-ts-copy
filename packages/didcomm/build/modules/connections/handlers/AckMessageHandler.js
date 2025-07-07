"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AckMessageHandler = void 0;
const messages_1 = require("../../../messages");
class AckMessageHandler {
    constructor(connectionService) {
        this.supportedMessages = [messages_1.AckMessage];
        this.connectionService = connectionService;
    }
    async handle(inboundMessage) {
        await this.connectionService.processAck(inboundMessage);
        return undefined;
    }
}
exports.AckMessageHandler = AckMessageHandler;
//# sourceMappingURL=AckMessageHandler.js.map