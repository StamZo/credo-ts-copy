"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicMessageRecord = void 0;
const core_1 = require("@credo-ts/core");
class BasicMessageRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = BasicMessageRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.content = props.content;
            this.sentTime = props.sentTime;
            this.connectionId = props.connectionId;
            this._tags = props.tags ?? {};
            this.role = props.role;
            this.threadId = props.threadId;
            this.parentThreadId = props.parentThreadId;
        }
    }
    getTags() {
        return {
            ...this._tags,
            connectionId: this.connectionId,
            role: this.role,
            threadId: this.threadId,
            parentThreadId: this.parentThreadId,
        };
    }
}
exports.BasicMessageRecord = BasicMessageRecord;
BasicMessageRecord.type = 'BasicMessageRecord';
//# sourceMappingURL=BasicMessageRecord.js.map