"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidCommMessageRecord = void 0;
const core_1 = require("@credo-ts/core");
const messageType_1 = require("../util/messageType");
class DidCommMessageRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = DidCommMessageRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.associatedRecordId = props.associatedRecordId;
            this.role = props.role;
            this.message = props.message;
        }
    }
    getTags() {
        const messageId = this.message['@id'];
        const messageType = this.message['@type'];
        const { protocolName, protocolMajorVersion, protocolMinorVersion, messageName } = (0, messageType_1.parseMessageType)(messageType);
        const thread = this.message['~thread'];
        let threadId = messageId;
        if ((0, core_1.isJsonObject)(thread) && typeof thread.thid === 'string') {
            threadId = thread.thid;
        }
        return {
            ...this._tags,
            role: this.role,
            associatedRecordId: this.associatedRecordId,
            // Computed properties based on message id and type
            threadId,
            protocolName,
            messageName,
            protocolMajorVersion: protocolMajorVersion.toString(),
            protocolMinorVersion: protocolMinorVersion.toString(),
            messageType,
            messageId,
        };
    }
    getMessageInstance(messageClass) {
        const messageType = (0, messageType_1.parseMessageType)(this.message['@type']);
        if (!(0, messageType_1.canHandleMessageType)(messageClass, messageType)) {
            throw new core_1.CredoError('Provided message class type does not match type of stored message');
        }
        return core_1.JsonTransformer.fromJSON(this.message, messageClass);
    }
}
exports.DidCommMessageRecord = DidCommMessageRecord;
DidCommMessageRecord.type = 'DidCommMessageRecord';
//# sourceMappingURL=DidCommMessageRecord.js.map