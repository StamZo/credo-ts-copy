"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P256PublicJwk = void 0;
const jwa_1 = require("../../jwa");
const ecPublicKey_1 = require("./ecPublicKey");
class P256PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = P256PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = P256PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = P256PublicJwk.multicodecPrefix;
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
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(publicKey, 'P-256');
        return new P256PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(multicodec, 'P-256');
        return new P256PublicJwk(jwk);
    }
}
exports.P256PublicJwk = P256PublicJwk;
P256PublicJwk.supportedSignatureAlgorithms = [jwa_1.KnownJwaSignatureAlgorithms.ES256];
P256PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [jwa_1.KnownJwaKeyAgreementAlgorithms.ECDH_ES];
P256PublicJwk.multicodecPrefix = 4608;
//# sourceMappingURL=P256PublicJwk.js.map