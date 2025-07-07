"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519PublicJwk = void 0;
const ed25519_1 = require("@stablelib/ed25519");
const jwa_1 = require("../../jwa");
const X25519PublicJwk_1 = require("./X25519PublicJwk");
const okpPublicKey_1 = require("./okpPublicKey");
class Ed25519PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = Ed25519PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = Ed25519PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = Ed25519PublicJwk.multicodecPrefix;
    }
    get publicKey() {
        return {
            crv: this.jwk.crv,
            kty: this.jwk.kty,
            publicKey: (0, okpPublicKey_1.okpPublicJwkToPublicKey)(this.jwk),
        };
    }
    get multicodec() {
        return (0, okpPublicKey_1.okpPublicJwkToPublicKey)(this.jwk);
    }
    static fromPublicKey(publicKey) {
        const jwk = (0, okpPublicKey_1.okpPublicKeyToPublicJwk)(publicKey, 'Ed25519');
        return new Ed25519PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, okpPublicKey_1.okpPublicKeyToPublicJwk)(multicodec, 'Ed25519');
        return new Ed25519PublicJwk(jwk);
    }
    toX25519PublicJwk() {
        return X25519PublicJwk_1.X25519PublicJwk.fromPublicKey((0, ed25519_1.convertPublicKeyToX25519)(this.publicKey.publicKey)).jwk;
    }
}
exports.Ed25519PublicJwk = Ed25519PublicJwk;
Ed25519PublicJwk.supportedSignatureAlgorithms = [jwa_1.KnownJwaSignatureAlgorithms.EdDSA];
Ed25519PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [];
Ed25519PublicJwk.multicodecPrefix = 237;
//# sourceMappingURL=Ed25519PublicJwk.js.map