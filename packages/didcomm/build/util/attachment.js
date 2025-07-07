"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeAttachment = encodeAttachment;
exports.isLinkedAttachment = isLinkedAttachment;
const core_1 = require("@credo-ts/core");
/**
 * Encodes an attachment based on the `data` property
 *
 * @param attachment The attachment that needs to be encoded
 * @param hashAlgorithm The hashing algorithm that is going to be used
 * @param baseName The base encoding name that is going to be used
 * @returns A hashlink based on the attachment data
 */
function encodeAttachment(attachment, hashAlgorithm = 'sha-256', baseName = 'base58btc') {
    if (attachment.data.sha256) {
        return `hl:${attachment.data.sha256}`;
    }
    if (attachment.data.base64) {
        return core_1.HashlinkEncoder.encode(core_1.TypedArrayEncoder.fromBase64(attachment.data.base64), hashAlgorithm, baseName);
    }
    if (attachment.data.json) {
        throw new core_1.CredoError(`Attachment: (${attachment.id}) has json encoded data. This is currently not supported`);
    }
    throw new core_1.CredoError(`Attachment: (${attachment.id}) has no data to create a link with`);
}
/**
 * Checks if an attachment is a linked Attachment
 *
 * @param attachment the attachment that has to be validated
 * @returns a boolean whether the attachment is a linkedAttachment
 */
function isLinkedAttachment(attachment) {
    return core_1.HashlinkEncoder.isValid(`hl:${attachment.id}`);
}
//# sourceMappingURL=attachment.js.map