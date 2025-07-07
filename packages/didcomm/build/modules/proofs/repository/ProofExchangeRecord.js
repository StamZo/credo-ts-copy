"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofExchangeRecord = void 0;
const core_1 = require("@credo-ts/core");
class ProofExchangeRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = ProofExchangeRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.protocolVersion = props.protocolVersion;
            this.isVerified = props.isVerified;
            this.state = props.state;
            this.role = props.role;
            this.connectionId = props.connectionId;
            this.threadId = props.threadId;
            this.parentThreadId = props.parentThreadId;
            this.autoAcceptProof = props.autoAcceptProof;
            this._tags = props.tags ?? {};
            this.errorMessage = props.errorMessage;
        }
    }
    getTags() {
        return {
            ...this._tags,
            threadId: this.threadId,
            parentThreadId: this.parentThreadId,
            connectionId: this.connectionId,
            state: this.state,
            role: this.role,
        };
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`Proof record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
    assertProtocolVersion(version) {
        if (this.protocolVersion !== version) {
            throw new core_1.CredoError(`Proof record has invalid protocol version ${this.protocolVersion}. Expected version ${version}`);
        }
    }
    assertConnection(currentConnectionId) {
        if (!this.connectionId) {
            throw new core_1.CredoError('Proof record is not associated with any connection. This is often the case with connection-less presentation exchange');
        }
        if (this.connectionId !== currentConnectionId) {
            throw new core_1.CredoError(`Proof record is associated with connection '${this.connectionId}'. Current connection is '${currentConnectionId}'`);
        }
    }
}
exports.ProofExchangeRecord = ProofExchangeRecord;
ProofExchangeRecord.type = 'ProofRecord';
//# sourceMappingURL=ProofExchangeRecord.js.map