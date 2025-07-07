"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTxCode = generateTxCode;
const core_1 = require("@credo-ts/core");
function generateTxCode(agentContext, txCode) {
    const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
    const length = txCode.length ?? 4;
    const inputMode = txCode.input_mode ?? 'numeric';
    const numbers = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const characters = inputMode === 'numeric' ? numbers : numbers + letters;
    const random = kms.randomBytes({ length });
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[random[i] % characters.length];
    }
    return result;
}
//# sourceMappingURL=txCode.js.map