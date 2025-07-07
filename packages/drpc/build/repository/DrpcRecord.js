"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrpcRecord = void 0;
const core_1 = require("@credo-ts/core");
class DrpcRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = DrpcRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.request = props.request;
            this.response = props.response;
            this.connectionId = props.connectionId;
            this._tags = props.tags ?? {};
            this.role = props.role;
            this.state = props.state;
            this.threadId = props.threadId;
        }
    }
    getTags() {
        return {
            ...this._tags,
            connectionId: this.connectionId,
            threadId: this.threadId,
        };
    }
    assertRole(expectedRole) {
        if (this.role !== expectedRole) {
            throw new core_1.CredoError(`Invalid DRPC record role ${this.role}, expected is ${expectedRole}.`);
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`DRPC response record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
}
exports.DrpcRecord = DrpcRecord;
DrpcRecord.type = 'DrpcRecord';
//# sourceMappingURL=DrpcRecord.js.map