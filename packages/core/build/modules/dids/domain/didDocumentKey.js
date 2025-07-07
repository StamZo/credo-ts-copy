"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKmsKeyIdForVerifiacationMethod = getKmsKeyIdForVerifiacationMethod;
function getKmsKeyIdForVerifiacationMethod(verificationMethod, keys) {
    return keys?.find(({ didDocumentRelativeKeyId }) => verificationMethod.id.endsWith(didDocumentRelativeKeyId))
        ?.kmsKeyId;
}
//# sourceMappingURL=didDocumentKey.js.map