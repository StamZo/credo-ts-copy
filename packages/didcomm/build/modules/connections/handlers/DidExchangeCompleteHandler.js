"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidExchangeCompleteHandler = void 0;
const core_1 = require("@credo-ts/core");
const messages_1 = require("../messages");
const models_1 = require("../models");
class DidExchangeCompleteHandler {
    constructor(didExchangeProtocol, outOfBandService) {
        this.supportedMessages = [messages_1.DidExchangeCompleteMessage];
        this.didExchangeProtocol = didExchangeProtocol;
        this.outOfBandService = outOfBandService;
    }
    async handle(messageContext) {
        const { connection: connectionRecord } = messageContext;
        if (!connectionRecord) {
            throw new core_1.CredoError('Connection is missing in message context');
        }
        const { protocol } = connectionRecord;
        if (protocol !== models_1.HandshakeProtocol.DidExchange) {
            throw new core_1.CredoError(`Connection record protocol is ${protocol} but handler supports only ${models_1.HandshakeProtocol.DidExchange}.`);
        }
        const { message } = messageContext;
        const parentThreadId = message.thread?.parentThreadId;
        if (!parentThreadId) {
            throw new core_1.CredoError('Message does not contain pthid attribute');
        }
        const outOfBandRecord = await this.outOfBandService.findByCreatedInvitationId(messageContext.agentContext, parentThreadId, (0, core_1.tryParseDid)(parentThreadId) ? message.threadId : undefined);
        if (!outOfBandRecord) {
            throw new core_1.CredoError(`OutOfBand record for message ID ${message.thread?.parentThreadId} not found!`);
        }
        await this.didExchangeProtocol.processComplete(messageContext, outOfBandRecord);
        return undefined;
    }
}
exports.DidExchangeCompleteHandler = DidExchangeCompleteHandler;
//# sourceMappingURL=DidExchangeCompleteHandler.js.map