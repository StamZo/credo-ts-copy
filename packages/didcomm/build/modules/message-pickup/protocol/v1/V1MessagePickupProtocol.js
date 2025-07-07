"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1MessagePickupProtocol = void 0;
const core_1 = require("@credo-ts/core");
const Events_1 = require("../../../../Events");
const models_1 = require("../../../../models");
const MessagePickupEvents_1 = require("../../MessagePickupEvents");
const MessagePickupModuleConfig_1 = require("../../MessagePickupModuleConfig");
const BaseMessagePickupProtocol_1 = require("../BaseMessagePickupProtocol");
const DidCommModuleConfig_1 = require("../../../../DidCommModuleConfig");
const handlers_1 = require("./handlers");
const messages_1 = require("./messages");
let V1MessagePickupProtocol = class V1MessagePickupProtocol extends BaseMessagePickupProtocol_1.BaseMessagePickupProtocol {
    constructor() {
        super(...arguments);
        /**
         * The version of the message pickup protocol this class supports
         */
        this.version = 'v1';
    }
    /**
     * Registers the protocol implementation (handlers, feature registry) on the agent.
     */
    register(messageHandlerRegistry, featureRegistry) {
        messageHandlerRegistry.registerMessageHandlers([new handlers_1.V1BatchPickupHandler(this), new handlers_1.V1BatchHandler(this)]);
        featureRegistry.register(new models_1.Protocol({
            id: 'https://didcomm.org/messagepickup/1.0',
            roles: ['message_holder', 'recipient', 'batch_sender', 'batch_recipient'],
        }));
    }
    async createPickupMessage(agentContext, options) {
        const { connectionRecord, batchSize } = options;
        connectionRecord.assertReady();
        const config = agentContext.dependencyManager.resolve(MessagePickupModuleConfig_1.MessagePickupModuleConfig);
        const message = new messages_1.V1BatchPickupMessage({
            batchSize: batchSize ?? config.maximumBatchSize,
        });
        return { message };
    }
    async createDeliveryMessage(agentContext, options) {
        const { connectionRecord, batchSize, messages } = options;
        connectionRecord.assertReady();
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        const messagesToDeliver = messages ??
            (await queueTransportRepository.takeFromQueue(agentContext, {
                connectionId: connectionRecord.id,
                limit: batchSize, // TODO: Define as config parameter for message holder side
                deleteMessages: true,
            }));
        const batchMessages = messagesToDeliver.map((msg) => new messages_1.BatchMessageMessage({
            id: msg.id,
            message: msg.encryptedMessage,
        }));
        if (messagesToDeliver.length > 0) {
            const message = new messages_1.V1BatchMessage({
                messages: batchMessages,
            });
            return { message };
        }
    }
    async setLiveDeliveryMode() {
        throw new core_1.CredoError('Live Delivery mode not supported in Message Pickup V1 protocol');
    }
    async processBatchPickup(messageContext) {
        // Assert ready connection
        const connection = messageContext.assertReadyConnection();
        const { message, agentContext } = messageContext;
        const queueTransportRepository = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig).queueTransportRepository;
        const messages = await queueTransportRepository.takeFromQueue(agentContext, {
            connectionId: connection.id,
            limit: message.batchSize,
            deleteMessages: true,
        });
        const batchMessages = messages.map((msg) => new messages_1.BatchMessageMessage({
            id: msg.id,
            message: msg.encryptedMessage,
        }));
        const batchMessage = new messages_1.V1BatchMessage({
            messages: batchMessages,
            threadId: message.threadId,
        });
        return new models_1.OutboundMessageContext(batchMessage, { agentContext: messageContext.agentContext, connection });
    }
    async processBatch(messageContext) {
        const { message: batchMessage, agentContext } = messageContext;
        const { messages } = batchMessage;
        const connection = messageContext.assertReadyConnection();
        const eventEmitter = messageContext.agentContext.dependencyManager.resolve(core_1.EventEmitter);
        for (const message of messages) {
            eventEmitter.emit(messageContext.agentContext, {
                type: Events_1.AgentEventTypes.AgentMessageReceived,
                payload: {
                    message: message.message,
                    contextCorrelationId: messageContext.agentContext.contextCorrelationId,
                },
            });
        }
        // A Batch message without messages at all means that we are done with the
        // message pickup process (Note: this is not optimal since we'll always doing an extra
        // Batch Pickup. However, it is safer and should be faster than waiting an entire loop
        // interval to retrieve more messages)
        if (messages.length === 0) {
            eventEmitter.emit(messageContext.agentContext, {
                type: MessagePickupEvents_1.MessagePickupEventTypes.MessagePickupCompleted,
                payload: {
                    connection,
                    threadId: batchMessage.threadId,
                },
            });
            return null;
        }
        return (await this.createPickupMessage(agentContext, { connectionRecord: connection })).message;
    }
};
exports.V1MessagePickupProtocol = V1MessagePickupProtocol;
exports.V1MessagePickupProtocol = V1MessagePickupProtocol = __decorate([
    (0, core_1.injectable)()
], V1MessagePickupProtocol);
//# sourceMappingURL=V1MessagePickupProtocol.js.map