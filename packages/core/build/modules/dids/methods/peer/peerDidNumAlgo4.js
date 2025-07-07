"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLongFormDidPeer4 = exports.isShortFormDidPeer4 = void 0;
exports.getAlternativeDidsForNumAlgo4Did = getAlternativeDidsForNumAlgo4Did;
exports.didToNumAlgo4DidDocument = didToNumAlgo4DidDocument;
exports.didDocumentToNumAlgo4Did = didDocumentToNumAlgo4Did;
const error_1 = require("../../../../error");
const utils_1 = require("../../../../utils");
const buffer_1 = require("../../../../utils/buffer");
const domain_1 = require("../../domain");
const parse_1 = require("../../domain/parse");
const LONG_RE = /^did:peer:4(z[1-9a-km-zA-HJ-NP-Z]{46}):(z[1-9a-km-zA-HJ-NP-Z]{6,})$/;
const SHORT_RE = /^did:peer:4(z[1-9a-km-zA-HJ-NP-Z]{46})$/;
const JSON_MULTICODEC_VARINT = 0x0200;
const isShortFormDidPeer4 = (did) => SHORT_RE.test(did);
exports.isShortFormDidPeer4 = isShortFormDidPeer4;
const isLongFormDidPeer4 = (did) => LONG_RE.test(did);
exports.isLongFormDidPeer4 = isLongFormDidPeer4;
const hashEncodedDocument = (encodedDocument) => utils_1.MultiBaseEncoder.encode(utils_1.MultiHashEncoder.encode(utils_1.TypedArrayEncoder.fromString(encodedDocument), 'sha-256'), 'base58btc');
function getAlternativeDidsForNumAlgo4Did(did) {
    const match = did.match(LONG_RE);
    if (!match)
        return;
    const [, hash] = match;
    return [`did:peer:4${hash}`];
}
function didToNumAlgo4DidDocument(did) {
    const parsed = (0, parse_1.parseDid)(did);
    const match = parsed.did.match(LONG_RE);
    if (!match) {
        throw new error_1.CredoError(`Invalid long form algo 4 did:peer: ${parsed.did}`);
    }
    const [, hash, encodedDocument] = match;
    if (hash !== hashEncodedDocument(encodedDocument)) {
        throw new error_1.CredoError(`Hash is invalid for did: ${did}`);
    }
    const { data } = utils_1.MultiBaseEncoder.decode(encodedDocument);
    const [multiCodecValue] = utils_1.VarintEncoder.decode(data.subarray(0, 2));
    if (multiCodecValue !== JSON_MULTICODEC_VARINT) {
        throw new error_1.CredoError('Not a JSON multicodec data');
    }
    const didDocumentJson = utils_1.JsonEncoder.fromBuffer(data.subarray(2));
    didDocumentJson.id = parsed.did;
    didDocumentJson.alsoKnownAs = [parsed.did.slice(0, did.lastIndexOf(':'))];
    // Populate all verification methods without controller
    const addControllerIfNotPresent = (item) => {
        if (Array.isArray(item))
            item.forEach(addControllerIfNotPresent);
        if (item && typeof item === 'object' && item.controller === undefined) {
            ;
            item.controller = parsed.did;
        }
    };
    addControllerIfNotPresent(didDocumentJson.verificationMethod);
    addControllerIfNotPresent(didDocumentJson.authentication);
    addControllerIfNotPresent(didDocumentJson.assertionMethod);
    addControllerIfNotPresent(didDocumentJson.keyAgreement);
    addControllerIfNotPresent(didDocumentJson.capabilityDelegation);
    addControllerIfNotPresent(didDocumentJson.capabilityInvocation);
    const didDocument = utils_1.JsonTransformer.fromJSON(didDocumentJson, domain_1.DidDocument);
    return didDocument;
}
function didDocumentToNumAlgo4Did(didDocument) {
    const didDocumentJson = didDocument.toJSON();
    // Build input document based on did document, without any
    // reference to controller
    const deleteControllerIfPresent = (item) => {
        if (Array.isArray(item)) {
            for (const method of item) {
                if (method.controller === '#id' || method.controller === didDocument.id)
                    method.controller = undefined;
            }
        }
    };
    didDocumentJson.id = undefined;
    didDocumentJson.alsoKnownAs = undefined;
    deleteControllerIfPresent(didDocumentJson.verificationMethod);
    deleteControllerIfPresent(didDocumentJson.authentication);
    deleteControllerIfPresent(didDocumentJson.assertionMethod);
    deleteControllerIfPresent(didDocumentJson.keyAgreement);
    deleteControllerIfPresent(didDocumentJson.capabilityDelegation);
    deleteControllerIfPresent(didDocumentJson.capabilityInvocation);
    // Construct encoded document by prefixing did document with multicodec prefix for JSON
    const buffer = buffer_1.Buffer.concat([
        utils_1.VarintEncoder.encode(JSON_MULTICODEC_VARINT),
        buffer_1.Buffer.from(JSON.stringify(didDocumentJson)),
    ]);
    const encodedDocument = utils_1.MultiBaseEncoder.encode(buffer, 'base58btc');
    const shortFormDid = `did:peer:4${hashEncodedDocument(encodedDocument)}`;
    const longFormDid = `${shortFormDid}:${encodedDocument}`;
    return { shortFormDid, longFormDid };
}
//# sourceMappingURL=peerDidNumAlgo4.js.map