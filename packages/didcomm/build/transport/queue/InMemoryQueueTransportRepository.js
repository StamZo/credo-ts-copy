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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryQueueTransportRepository = void 0;
const core_1 = require("@credo-ts/core");
let InMemoryQueueTransportRepository = class InMemoryQueueTransportRepository {
    constructor() {
        this.messages = [];
    }
    getAvailableMessageCount(_agentContext, options) {
        const { connectionId, recipientDid } = options;
        const messages = this.messages.filter((msg) => msg.connectionId === connectionId &&
            (recipientDid === undefined || msg.recipientDids.includes(recipientDid)) &&
            msg.state === 'pending');
        return messages.length;
    }
    takeFromQueue(agentContext, options) {
        const { connectionId, recipientDid, limit, deleteMessages } = options;
        let messages = this.messages.filter((msg) => msg.connectionId === connectionId &&
            msg.state === 'pending' &&
            (recipientDid === undefined || msg.recipientDids.includes(recipientDid)));
        const messagesToTake = limit ?? messages.length;
        messages = messages.slice(0, messagesToTake);
        agentContext.config.logger.debug(`Taking ${messagesToTake} messages from queue for connection ${connectionId}`);
        // Mark taken messages in order to prevent them of being retrieved again
        for (const msg of messages) {
            const index = this.messages.findIndex((item) => item.id === msg.id);
            if (index !== -1)
                this.messages[index].state = 'sending';
        }
        if (deleteMessages) {
            this.removeMessages(agentContext, { connectionId, messageIds: messages.map((msg) => msg.id) });
        }
        return messages;
    }
    addMessage(_agentContext, options) {
        const { connectionId, recipientDids, payload } = options;
        const id = core_1.utils.uuid();
        this.messages.push({
            id,
            receivedAt: options.receivedAt ?? new Date(),
            connectionId,
            encryptedMessage: payload,
            recipientDids,
            state: 'pending',
        });
        return id;
    }
    removeMessages(_agentContext, options) {
        const { messageIds } = options;
        for (const messageId of messageIds) {
            const messageIndex = this.messages.findIndex((item) => item.id === messageId);
            if (messageIndex > -1)
                this.messages.splice(messageIndex, 1);
        }
    }
};
exports.InMemoryQueueTransportRepository = InMemoryQueueTransportRepository;
exports.InMemoryQueueTransportRepository = InMemoryQueueTransportRepository = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [])
], InMemoryQueueTransportRepository);
//# sourceMappingURL=InMemoryQueueTransportRepository.js.map