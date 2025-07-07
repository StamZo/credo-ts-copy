"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidExchangeStateMachine = void 0;
const core_1 = require("@credo-ts/core");
const messageType_1 = require("../../util/messageType");
const messages_1 = require("./messages");
const models_1 = require("./models");
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class DidExchangeStateMachine {
    static assertCreateMessageState(messageType, record) {
        const rule = DidExchangeStateMachine.createMessageStateRules.find((r) => (0, messageType_1.canHandleMessageType)(r.message, messageType));
        if (!rule) {
            throw new core_1.CredoError(`Could not find create message rule for ${messageType}`);
        }
        if (rule.state !== record.state || rule.role !== record.role) {
            throw new core_1.CredoError(`Record with role ${record.role} is in invalid state ${record.state} to create ${messageType}. Expected state for role ${rule.role} is ${rule.state}.`);
        }
    }
    static assertProcessMessageState(messageType, record) {
        const rule = DidExchangeStateMachine.processMessageStateRules.find((r) => (0, messageType_1.canHandleMessageType)(r.message, messageType));
        if (!rule) {
            throw new core_1.CredoError(`Could not find create message rule for ${messageType}`);
        }
        if (rule.state !== record.state || rule.role !== record.role) {
            throw new core_1.CredoError(`Record with role ${record.role} is in invalid state ${record.state} to process ${messageType.messageTypeUri}. Expected state for role ${rule.role} is ${rule.state}.`);
        }
    }
    static nextState(messageType, record) {
        const rule = DidExchangeStateMachine.createMessageStateRules
            .concat(DidExchangeStateMachine.processMessageStateRules)
            .find((r) => (0, messageType_1.canHandleMessageType)(r.message, messageType) && r.role === record.role);
        if (!rule) {
            throw new core_1.CredoError(`Could not find create message rule for messageType ${messageType.messageTypeUri}, state ${record.state} and role ${record.role}`);
        }
        return rule.nextState;
    }
}
exports.DidExchangeStateMachine = DidExchangeStateMachine;
DidExchangeStateMachine.createMessageStateRules = [
    {
        message: messages_1.DidExchangeRequestMessage,
        state: models_1.DidExchangeState.InvitationReceived,
        role: models_1.DidExchangeRole.Requester,
        nextState: models_1.DidExchangeState.RequestSent,
    },
    {
        message: messages_1.DidExchangeResponseMessage,
        state: models_1.DidExchangeState.RequestReceived,
        role: models_1.DidExchangeRole.Responder,
        nextState: models_1.DidExchangeState.ResponseSent,
    },
    {
        message: messages_1.DidExchangeCompleteMessage,
        state: models_1.DidExchangeState.ResponseReceived,
        role: models_1.DidExchangeRole.Requester,
        nextState: models_1.DidExchangeState.Completed,
    },
];
DidExchangeStateMachine.processMessageStateRules = [
    {
        message: messages_1.DidExchangeRequestMessage,
        state: models_1.DidExchangeState.InvitationSent,
        role: models_1.DidExchangeRole.Responder,
        nextState: models_1.DidExchangeState.RequestReceived,
    },
    {
        message: messages_1.DidExchangeResponseMessage,
        state: models_1.DidExchangeState.RequestSent,
        role: models_1.DidExchangeRole.Requester,
        nextState: models_1.DidExchangeState.ResponseReceived,
    },
    {
        message: messages_1.DidExchangeCompleteMessage,
        state: models_1.DidExchangeState.ResponseSent,
        role: models_1.DidExchangeRole.Responder,
        nextState: models_1.DidExchangeState.Completed,
    },
];
//# sourceMappingURL=DidExchangeStateMachine.js.map