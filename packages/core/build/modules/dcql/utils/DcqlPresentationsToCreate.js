"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dcqlGetPresentationsToCreate = dcqlGetPresentationsToCreate;
const vc_1 = require("../../vc");
function dcqlGetPresentationsToCreate(credentialsForInputDescriptor) {
    const presentationsToCreate = {};
    for (const [credentialQueryId, match] of Object.entries(credentialsForInputDescriptor)) {
        if (match.claimFormat === vc_1.ClaimFormat.SdJwtVc) {
            presentationsToCreate[credentialQueryId] = {
                claimFormat: vc_1.ClaimFormat.SdJwtVc,
                subjectIds: [],
                credentialRecord: match.credentialRecord,
                disclosedPayload: match.disclosedPayload,
                additionalPayload: match.additionalPayload,
            };
        }
        else if (match.claimFormat === vc_1.ClaimFormat.MsoMdoc) {
            presentationsToCreate[credentialQueryId] = {
                claimFormat: vc_1.ClaimFormat.MsoMdoc,
                subjectIds: [],
                credentialRecord: match.credentialRecord,
                disclosedPayload: match.disclosedPayload,
            };
        }
        else {
            presentationsToCreate[credentialQueryId] = {
                claimFormat: match.credentialRecord.credential.claimFormat === vc_1.ClaimFormat.JwtVc ? vc_1.ClaimFormat.JwtVp : vc_1.ClaimFormat.LdpVp,
                subjectIds: [match.credentialRecord.credential.credentialSubjectIds[0]],
                credentialRecord: match.credentialRecord,
                disclosedPayload: match.disclosedPayload,
            };
        }
    }
    return presentationsToCreate;
}
//# sourceMappingURL=DcqlPresentationsToCreate.js.map