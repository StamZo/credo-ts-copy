"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSendingError = void 0;
const core_1 = require("@credo-ts/core");
class MessageSendingError extends core_1.CredoError {
    constructor(message, { outboundMessageContext, cause }) {
        super(message, { cause });
        this.outboundMessageContext = outboundMessageContext;
    }
}
exports.MessageSendingError = MessageSendingError;
//# sourceMappingURL=MessageSendingError.js.map