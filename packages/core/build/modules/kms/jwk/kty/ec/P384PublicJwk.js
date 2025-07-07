"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P384PublicJwk = void 0;
const jwa_1 = require("../../jwa");
const ecPublicKey_1 = require("./ecPublicKey");
class P384PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = P384PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = P384PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = P384PublicJwk.multicodecPrefix;
    }
    get publicKey() {
        return {
            crv: this.jwk.crv,
            kty: this.jwk.kty,
            publicKey: (0, ecPublicKey_1.ecPublicJwkToPublicKey)(this.jwk),
        };
    }
    get multicodec() {
        return (0, ecPublicKey_1.ecPublicJwkToPublicKey)(this.jwk, { compressed: true });
    }
    static fromPublicKey(publicKey) {
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(publicKey, 'P-384');
        return new P384PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(multicodec, 'P-384');
        return new P384PublicJwk(jwk);
    }
}
exports.P384PublicJwk = P384PublicJwk;
P384PublicJwk.supportedSignatureAlgorithms = [jwa_1.KnownJwaSignatureAlgorithms.ES384];
P384PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [jwa_1.KnownJwaKeyAgreementAlgorithms.ECDH_ES];
P384PublicJwk.multicodecPrefix = 4609;
//# sourceMappingURL=P384PublicJwk.js.map