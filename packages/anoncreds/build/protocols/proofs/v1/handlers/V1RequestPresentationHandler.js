"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1RequestPresentationHandler = void 0;
const didcomm_1 = require("@credo-ts/didcomm");
const messages_1 = require("../messages");
class V1RequestPresentationHandler {
    constructor(proofProtocol) {
        this.supportedMessages = [messages_1.V1RequestPresentationMessage];
        this.proofProtocol = proofProtocol;
    }
    async handle(messageContext) {
        const proofRecord = await this.proofProtocol.processRequest(messageContext);
        const shouldAutoRespond = await this.proofProtocol.shouldAutoRespondToRequest(messageContext.agentContext, {
            proofRecord,
            requestMessage: messageContext.message,
        });
        if (shouldAutoRespond) {
            return await this.acceptRequest(proofRecord, messageContext);
        }
    }
    async acceptRequest(proofRecord, messageContext) {
        messageContext.agentContext.config.logger.info('Automatically sending presentation with autoAccept on');
        const { message } = await this.proofProtocol.acceptRequest(messageContext.agentContext, {
            proofRecord,
        });
        return (0, didcomm_1.getOutboundMessageContext)(messageContext.agentContext, {
            message,
            lastReceivedMessage: messageContext.message,
            associatedRecord: proofRecord,
            connectionRecord: messageContext.connection,
        });
    }
}
exports.V1RequestPresentationHandler = V1RequestPresentationHandler;
//# sourceMappingURL=V1RequestPresentationHandler.js.map