"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2RequestCredentialHandler = void 0;
const core_1 = require("@credo-ts/core");
const getOutboundMessageContext_1 = require("../../../../../getOutboundMessageContext");
const V2RequestCredentialMessage_1 = require("../messages/V2RequestCredentialMessage");
class V2RequestCredentialHandler {
    constructor(credentialProtocol) {
        this.supportedMessages = [V2RequestCredentialMessage_1.V2RequestCredentialMessage];
        this.credentialProtocol = credentialProtocol;
    }
    async handle(messageContext) {
        const credentialRecord = await this.credentialProtocol.processRequest(messageContext);
        const shouldAutoRespond = await this.credentialProtocol.shouldAutoRespondToRequest(messageContext.agentContext, {
            credentialRecord,
            requestMessage: messageContext.message,
        });
        if (shouldAutoRespond) {
            return await this.acceptRequest(credentialRecord, messageContext);
        }
    }
    async acceptRequest(credentialRecord, messageContext) {
        messageContext.agentContext.config.logger.info('Automatically sending credential with autoAccept');
        const offerMessage = await this.credentialProtocol.findOfferMessage(messageContext.agentContext, credentialRecord.id);
        if (!offerMessage) {
            throw new core_1.CredoError(`Could not find offer message for credential record with id ${credentialRecord.id}`);
        }
        const { message } = await this.credentialProtocol.acceptRequest(messageContext.agentContext, {
            credentialRecord,
        });
        return (0, getOutboundMessageContext_1.getOutboundMessageContext)(messageContext.agentContext, {
            connectionRecord: messageContext.connection,
            message,
            associatedRecord: credentialRecord,
            lastReceivedMessage: messageContext.message,
            lastSentMessage: offerMessage,
        });
    }
}
exports.V2RequestCredentialHandler = V2RequestCredentialHandler;
//# sourceMappingURL=V2RequestCredentialHandler.js.map