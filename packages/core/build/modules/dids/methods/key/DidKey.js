"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidKey = void 0;
const kms_1 = require("../../../kms");
const keyDidDocument_1 = require("../../domain/keyDidDocument");
const parse_1 = require("../../domain/parse");
class DidKey {
    constructor(publicJwk) {
        this.publicJwk = publicJwk;
    }
    static fromDid(did) {
        const parsed = (0, parse_1.parseDid)(did);
        const publicJwk = kms_1.PublicJwk.fromFingerprint(parsed.id);
        return new DidKey(publicJwk);
    }
    get did() {
        return `did:key:${this.publicJwk.fingerprint}`;
    }
    get didDocument() {
        return (0, keyDidDocument_1.getDidDocumentForPublicJwk)(this.did, this.publicJwk);
    }
}
exports.DidKey = DidKey;
//# sourceMappingURL=DidKey.js.map