"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateV0_4ToV0_5 = updateV0_4ToV0_5;
const w3cCredentialRecord_1 = require("./w3cCredentialRecord");
async function updateV0_4ToV0_5(agent) {
    await (0, w3cCredentialRecord_1.migrateW3cCredentialRecordToV0_5)(agent);
}
//# sourceMappingURL=index.js.map