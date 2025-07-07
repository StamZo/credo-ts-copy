"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2MessagePickupProtocol = void 0;
const core_1 = require("@credo-ts/core");
const Events_1 = require("../../../../Events");
const Attachment_1 = require("../../../../decorators/attachment/Attachment");
const errors_1 = require("../../../../errors");
const models_1 = require("../../../../models");
const error_1 = require("../../../routing/error");
const MessagePickupEvents_1 = require("../../MessagePickupEvents");
const MessagePickupModuleConfig_1 = require("../../MessagePickupModuleConfig");
const MessagePickupSession_1 = require("../../MessagePickupSession");
const services_1 = require("../../services");
const BaseMessagePickupProtocol_1 = require("../BaseMessagePickupProtocol");
const DidCommModuleConfig_1 = require("../../../../DidCommModuleConfig");
const handlers_1 = require("./handlers");
const messages_1 = require("./messages");
let V2MessagePickupProtocol = class V2MessagePickupProtocol extends BaseMessagePickupProtocol_1.BaseMessagePickupProtocol {
    constructor() {
        super(...arguments);
        /**
         * The version of the message pickup protocol this class supports
         */
        this.version = 'v2';
    }
    /**
     * Registers the protocol implementation (handlers, feature registry) on the agent.
     */
    register(messageHandlerRegistry, featureRegistry) {
        messageHandlerRegistry.registerMessageHandlers([
            new handlers_1.V2StatusRequestHandler(this),
            new handlers_1.V2DeliveryRequestHandler(this),
            new handlers_1.V2MessagesReceivedHandler(this),
            new handlers_1.V2StatusHandler(this),
            new handlers_1.V2MessageDeliveryHandler(this),
            new handlers_1.V2LiveDeliveryChangeHandler(this),
        ]);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/messagepickup/2.0',
            roles: ['mediator', 'recipient'],
        }));
    }
    async createPickupMessage(_agentContext, options) {
        const { connectionRecord, recipientDid: recipientKey } = options;
        connectionRecord.assertReady();
        const message = new messages_1.V2StatusRequestMessage({
            recipientKey,
        });
        return { message };
    }
    async createDeliveryMessage(agentContext, options) {
        const { connectionRecord, recipientKey, messages } = options;
        connectionRecord.assertReady();
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        // Get available messages from queue, but don't delete them
        const messagesToDeliver = messages ??
            (await queueTransportRepository.takeFromQueue(agentContext, {
                connectionId: connectionRecord.id,
                recipientDid: recipientKey,
                limit: 10, // TODO: Define as config parameter
            }));
        if (messagesToDeliver.length === 0) {
            return;
        }
        const attachments = messagesToDeliver.map((msg) => new Attachment_1.Attachment({
            id: msg.id,
            lastmodTime: msg.receivedAt,
            data: {
                json: msg.encryptedMessage,
            },
        }));
        return {
            message: new messages_1.V2MessageDeliveryMessage({
                attachments,
            }),
        };
    }
    async setLiveDeliveryMode(_agentContext, options) {
        const { connectionRecord, liveDelivery } = options;
        connectionRecord.assertReady();
        return {
            message: new messages_1.V2LiveDeliveryChangeMessage({
                liveDelivery,
            }),
        };
    }
    async processStatusRequest(messageContext) {
        // Assert ready connection
        const connection = messageContext.assertReadyConnection();
        const recipientKey = messageContext.message.recipientKey;
        const agentContext = messageContext.agentContext;
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        const statusMessage = new messages_1.V2StatusMessage({
            threadId: messageContext.message.threadId,
            recipientKey,
            messageCount: await queueTransportRepository.getAvailableMessageCount(agentContext, {
                connectionId: connection.id,
                recipientDid: recipientKey ? (0, core_1.verkeyToDidKey)(recipientKey) : undefined,
            }),
        });
        return new models_1.OutboundMessageContext(statusMessage, {
            agentContext: messageContext.agentContext,
            connection,
        });
    }
    async processDeliveryRequest(messageContext) {
        // Assert ready connection
        const connection = messageContext.assertReadyConnection();
        const recipientKey = messageContext.message.recipientKey;
        const { agentContext, message } = messageContext;
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        // Get available messages from queue, but don't delete them
        const messages = await queueTransportRepository.takeFromQueue(agentContext, {
            connectionId: connection.id,
            recipientDid: recipientKey ? (0, core_1.verkeyToDidKey)(recipientKey) : undefined,
            limit: message.limit,
        });
        const attachments = messages.map((msg) => new Attachment_1.Attachment({
            id: msg.id,
            lastmodTime: msg.receivedAt,
            data: {
                json: msg.encryptedMessage,
            },
        }));
        const outboundMessageContext = messages.length > 0
            ? new messages_1.V2MessageDeliveryMessage({
                threadId: messageContext.message.threadId,
                recipientKey,
                attachments,
            })
            : new messages_1.V2StatusMessage({
                threadId: messageContext.message.threadId,
                recipientKey,
                messageCount: 0,
            });
        return new models_1.OutboundMessageContext(outboundMessageContext, {
            agentContext: messageContext.agentContext,
            connection,
        });
    }
    async processMessagesReceived(messageContext) {
        // Assert ready connection
        const connection = messageContext.assertReadyConnection();
        const { agentContext, message } = messageContext;
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        if (message.messageIdList.length) {
            await queueTransportRepository.removeMessages(agentContext, {
                connectionId: connection.id,
                messageIds: message.messageIdList,
            });
        }
        const statusMessage = new messages_1.V2StatusMessage({
            threadId: messageContext.message.threadId,
            messageCount: await queueTransportRepository.getAvailableMessageCount(agentContext, {
                connectionId: connection.id,
            }),
        });
        return new models_1.OutboundMessageContext(statusMessage, {
            agentContext: messageContext.agentContext,
            connection,
        });
    }
    async processStatus(messageContext) {
        const { message: statusMessage } = messageContext;
        const { messageCount, recipientKey } = statusMessage;
        const connection = messageContext.assertReadyConnection();
        const messagePickupModuleConfig = messageContext.agentContext.dependencyManager.resolve(MessagePickupModuleConfig_1.MessagePickupModuleConfig);
        const eventEmitter = messageContext.agentContext.dependencyManager.resolve(core_1.EventEmitter);
        //No messages to be retrieved: message pick-up is completed
        if (messageCount === 0) {
            eventEmitter.emit(messageContext.agentContext, {
                type: MessagePickupEvents_1.MessagePickupEventTypes.MessagePickupCompleted,
                payload: {
                    connection,
                    threadId: statusMessage.threadId,
                },
            });
            return null;
        }
        const { maximumBatchSize: maximumMessagePickup } = messagePickupModuleConfig;
        const limit = messageCount < maximumMessagePickup ? messageCount : maximumMessagePickup;
        const deliveryRequestMessage = new messages_1.V2DeliveryRequestMessage({
            limit,
            recipientKey,
        });
        return deliveryRequestMessage;
    }
    async processLiveDeliveryChange(messageContext) {
        const { agentContext, message } = messageContext;
        const connection = messageContext.assertReadyConnection();
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        const sessionService = messageContext.agentContext.dependencyManager.resolve(services_1.MessagePickupSessionService);
        if (message.liveDelivery) {
            sessionService.saveLiveSession(agentContext, {
                connectionId: connection.id,
                protocolVersion: 'v2',
                role: MessagePickupSession_1.MessagePickupSessionRole.MessageHolder,
            });
        }
        else {
            sessionService.removeLiveSession(agentContext, { connectionId: connection.id });
        }
        const statusMessage = new messages_1.V2StatusMessage({
            threadId: message.threadId,
            liveDelivery: message.liveDelivery,
            messageCount: await queueTransportRepository.getAvailableMessageCount(agentContext, {
                connectionId: connection.id,
            }),
        });
        return new models_1.OutboundMessageContext(statusMessage, { agentContext: messageContext.agentContext, connection });
    }
    async processDelivery(messageContext) {
        messageContext.assertReadyConnection();
        const { appendedAttachments } = messageContext.message;
        const eventEmitter = messageContext.agentContext.dependencyManager.resolve(core_1.EventEmitter);
        if (!appendedAttachments)
            throw new errors_1.ProblemReportError('Error processing attachments', {
                problemCode: error_1.RoutingProblemReportReason.ErrorProcessingAttachments,
            });
        const ids = [];
        for (const attachment of appendedAttachments) {
            ids.push(attachment.id);
            eventEmitter.emit(messageContext.agentContext, {
                type: Events_1.AgentEventTypes.AgentMessageReceived,
                payload: {
                    message: attachment.getDataAsJson(),
                    contextCorrelationId: messageContext.agentContext.contextCorrelationId,
                    receivedAt: attachment.lastmodTime,
                },
            });
        }
        return new messages_1.V2MessagesReceivedMessage({
            messageIdList: ids,
        });
    }
};
exports.V2MessagePickupProtocol = V2MessagePickupProtocol;
exports.V2MessagePickupProtocol = V2MessagePickupProtocol = __decorate([
    (0, core_1.injectable)()
], V2MessagePickupProtocol);
//# sourceMappingURL=V2MessagePickupProtocol.js.map