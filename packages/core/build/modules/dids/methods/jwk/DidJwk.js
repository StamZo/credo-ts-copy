"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidJwk = void 0;
const utils_1 = require("../../../../utils");
const kms_1 = require("../../../kms");
const parse_1 = require("../../domain/parse");
const didJwkDidDocument_1 = require("./didJwkDidDocument");
class DidJwk {
    constructor(did, publicJwk) {
        this.did = did;
        this.publicJwk = publicJwk;
    }
    get allowsEncrypting() {
        return this.publicJwk.toJson().use === 'enc' || this.publicJwk.supportdEncryptionKeyAgreementAlgorithms.length > 0;
    }
    get allowsSigning() {
        return this.publicJwk.toJson().use === 'sig' || this.publicJwk.supportedSignatureAlgorithms.length > 0;
    }
    static fromDid(did) {
        const parsed = (0, parse_1.parseDid)(did);
        const jwkJson = utils_1.JsonEncoder.fromBase64(parsed.id);
        // This validates the jwk
        const publicJwk = kms_1.PublicJwk.fromUnknown(jwkJson);
        return new DidJwk(did, publicJwk);
    }
    /**
     * A did:jwk DID can only have one verification method, and the verification method
     * id will always be `<did>#0`.
     */
    get verificationMethodId() {
        return `${this.did}#0`;
    }
    static fromPublicJwk(publicJwk) {
        const did = `did:jwk:${utils_1.JsonEncoder.toBase64URL(publicJwk.toJson({ includeKid: false }))}`;
        return new DidJwk(did, publicJwk);
    }
    get jwkJson() {
        return this.publicJwk.toJson();
    }
    get didDocument() {
        return (0, didJwkDidDocument_1.getDidJwkDocument)(this);
    }
}
exports.DidJwk = DidJwk;
//# sourceMappingURL=DidJwk.js.map