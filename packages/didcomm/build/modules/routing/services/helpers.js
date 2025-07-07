"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediationRecordForDidDocument = getMediationRecordForDidDocument;
const core_1 = require("@credo-ts/core");
const MediationRecipientService_1 = require("./MediationRecipientService");
async function getMediationRecordForDidDocument(agentContext, didDocument) {
    const [mediatorRecord] = await agentContext.resolve(MediationRecipientService_1.MediationRecipientService).findAllMediatorsByQuery(agentContext, {
        recipientKeys: didDocument.recipientKeys.map((key) => core_1.TypedArrayEncoder.toBase58(key.publicKey.publicKey)),
    });
    return mediatorRecord;
}
//# sourceMappingURL=helpers.js.map