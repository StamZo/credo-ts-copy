"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeCredentialAutoAccept = composeCredentialAutoAccept;
exports.composeProofAutoAccept = composeProofAutoAccept;
const didcomm_1 = require("@credo-ts/didcomm");
/**
 * Returns the credential auto accept config based on priority:
 *	- The record config takes first priority
 *	- Otherwise the agent config
 *	- Otherwise {@link AutoAcceptCredential.Never} is returned
 */
function composeCredentialAutoAccept(recordConfig, agentConfig) {
    return recordConfig ?? agentConfig ?? didcomm_1.AutoAcceptCredential.Never;
}
/**
 * Returns the proof auto accept config based on priority:
 *	- The record config takes first priority
 *	- Otherwise the agent config
 *	- Otherwise {@link AutoAcceptProof.Never} is returned
 */
function composeProofAutoAccept(recordConfig, agentConfig) {
    return recordConfig ?? agentConfig ?? didcomm_1.AutoAcceptProof.Never;
}
//# sourceMappingURL=composeAutoAccept.js.map