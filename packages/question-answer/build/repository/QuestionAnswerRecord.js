"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswerRecord = void 0;
const core_1 = require("@credo-ts/core");
class QuestionAnswerRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = QuestionAnswerRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.questionText = props.questionText;
            this.questionDetail = props.questionDetail;
            this.validResponses = props.validResponses;
            this.connectionId = props.connectionId;
            this._tags = props.tags ?? {};
            this.role = props.role;
            this.signatureRequired = props.signatureRequired;
            this.state = props.state;
            this.threadId = props.threadId;
            this.response = props.response;
        }
    }
    getTags() {
        return {
            ...this._tags,
            connectionId: this.connectionId,
            role: this.role,
            state: this.state,
            threadId: this.threadId,
        };
    }
    assertRole(expectedRole) {
        if (this.role !== expectedRole) {
            throw new core_1.CredoError(`Invalid question answer record role ${this.role}, expected is ${expectedRole}.`);
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`Question answer record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
}
exports.QuestionAnswerRecord = QuestionAnswerRecord;
QuestionAnswerRecord.type = 'QuestionAnswerRecord';
//# sourceMappingURL=QuestionAnswerRecord.js.map