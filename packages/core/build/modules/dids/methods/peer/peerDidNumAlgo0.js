"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicJwkToNumAlgo0DidDocument = publicJwkToNumAlgo0DidDocument;
exports.didToNumAlgo0DidDocument = didToNumAlgo0DidDocument;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
const keyDidDocument_1 = require("../../domain/keyDidDocument");
const parse_1 = require("../../domain/parse");
const didPeer_1 = require("./didPeer");
function publicJwkToNumAlgo0DidDocument(publicJwk) {
    const did = `did:peer:0${publicJwk.fingerprint}`;
    return (0, keyDidDocument_1.getDidDocumentForPublicJwk)(did, publicJwk);
}
function didToNumAlgo0DidDocument(did) {
    const parsed = (0, parse_1.parseDid)(did);
    const numAlgo = (0, didPeer_1.getNumAlgoFromPeerDid)(did);
    if (!(0, didPeer_1.isValidPeerDid)(did)) {
        throw new error_1.CredoError(`Invalid peer did '${did}'`);
    }
    if (numAlgo !== didPeer_1.PeerDidNumAlgo.InceptionKeyWithoutDoc) {
        throw new error_1.CredoError(`Invalid numAlgo ${numAlgo}, expected ${didPeer_1.PeerDidNumAlgo.InceptionKeyWithoutDoc}`);
    }
    const publicJwk = kms_1.PublicJwk.fromFingerprint(parsed.id.substring(1));
    return (0, keyDidDocument_1.getDidDocumentForPublicJwk)(did, publicJwk);
}
//# sourceMappingURL=peerDidNumAlgo0.js.map