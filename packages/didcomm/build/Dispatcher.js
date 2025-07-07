"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
const core_1 = require("@credo-ts/core");
const Events_1 = require("./Events");
const MessageHandlerRegistry_1 = require("./MessageHandlerRegistry");
const MessageSender_1 = require("./MessageSender");
const problem_reports_1 = require("./errors/problem-reports");
const handlers_1 = require("./handlers");
const messages_1 = require("./messages");
const models_1 = require("./models");
const problem_reports_2 = require("./models/problem-reports");
const messageType_1 = require("./util/messageType");
let Dispatcher = class Dispatcher {
    constructor(messageSender, eventEmitter, messageHandlerRegistry, logger) {
        this.defaultHandlerMiddleware = async (inboundMessageContext, next) => {
            let messageHandler = inboundMessageContext.messageHandler;
            const fallbackMessageHandler = inboundMessageContext.agentContext.dependencyManager.resolve(MessageHandlerRegistry_1.MessageHandlerRegistry).fallbackMessageHandler;
            if (!messageHandler && fallbackMessageHandler) {
                messageHandler = {
                    supportedMessages: [],
                    handle: fallbackMessageHandler,
                };
            }
            if (!messageHandler) {
                throw new problem_reports_1.ProblemReportError(`Error handling message ${inboundMessageContext.message.id} with type ${inboundMessageContext.message.type}. The message type is not supported`, {
                    problemCode: problem_reports_2.ProblemReportReason.MessageParseFailure,
                });
            }
            const outboundMessage = await messageHandler.handle(inboundMessageContext);
            if (outboundMessage) {
                inboundMessageContext.setResponseMessage(outboundMessage);
            }
            await next();
        };
        this.messageSender = messageSender;
        this.eventEmitter = eventEmitter;
        this.messageHandlerRegistry = messageHandlerRegistry;
        this.logger = logger;
    }
    async dispatch(messageContext) {
        const { agentContext, connection, senderKey, recipientKey, message, encryptedMessage } = messageContext;
        // Set default handler if available, middleware can still override the message handler
        const messageHandler = this.messageHandlerRegistry.getHandlerForMessageType(message.type);
        if (messageHandler) {
            messageContext.setMessageHandler(messageHandler);
        }
        let outboundMessage;
        try {
            const messageHandlerMiddlewares = agentContext.dependencyManager.resolve(MessageHandlerRegistry_1.MessageHandlerRegistry).messageHandlerMiddlewares;
            const middlewares = [...messageHandlerMiddlewares, this.defaultHandlerMiddleware];
            await handlers_1.MessageHandlerMiddlewareRunner.run(middlewares, messageContext);
            outboundMessage = messageContext.responseMessage;
        }
        catch (error) {
            const problemReportMessage = error.problemReport;
            if (problemReportMessage instanceof messages_1.ProblemReportMessage && messageContext.connection) {
                const messageType = (0, messageType_1.parseMessageType)(messageContext.message.type);
                if ((0, messageType_1.canHandleMessageType)(messages_1.ProblemReportMessage, messageType)) {
                    throw new core_1.CredoError(`Not sending problem report in response to problem report: ${message}`);
                }
                const { protocolUri: problemReportProtocolUri } = (0, messageType_1.parseMessageType)(problemReportMessage.type);
                const { protocolUri: inboundProtocolUri } = (0, messageType_1.parseMessageType)(messageContext.message.type);
                // If the inbound protocol uri is the same as the problem report protocol uri, we can see the interaction as the same thread
                // However if it is no the same we should see it as a new thread, where the inbound message `@id` is the parentThreadId
                if (inboundProtocolUri === problemReportProtocolUri) {
                    problemReportMessage.setThread({
                        threadId: message.threadId,
                    });
                }
                else {
                    problemReportMessage.setThread({
                        parentThreadId: message.id,
                    });
                }
                outboundMessage = new models_1.OutboundMessageContext(problemReportMessage, {
                    agentContext,
                    connection: messageContext.connection,
                    inboundMessageContext: messageContext,
                });
            }
            else {
                this.logger.error(`Error handling message with type ${message.type}`, {
                    message: message.toJSON(),
                    error,
                    senderKey: senderKey?.fingerprint,
                    recipientKey: recipientKey?.fingerprint,
                    connectionId: connection?.id,
                });
                throw error;
            }
        }
        if (outboundMessage) {
            // set the inbound message context, if not already defined
            if (!outboundMessage.inboundMessageContext) {
                outboundMessage.inboundMessageContext = messageContext;
            }
            await this.messageSender.sendMessage(outboundMessage);
        }
        // Emit event that allows to hook into received messages
        this.eventEmitter.emit(agentContext, {
            type: Events_1.AgentEventTypes.AgentMessageProcessed,
            payload: {
                message,
                connection,
                receivedAt: messageContext.receivedAt,
                encryptedMessage,
            },
        });
    }
};
exports.Dispatcher = Dispatcher;
exports.Dispatcher = Dispatcher = __decorate([
    (0, core_1.injectable)(),
    __param(3, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [MessageSender_1.MessageSender,
        core_1.EventEmitter,
        MessageHandlerRegistry_1.MessageHandlerRegistry, Object])
], Dispatcher);
//# sourceMappingURL=Dispatcher.js.map