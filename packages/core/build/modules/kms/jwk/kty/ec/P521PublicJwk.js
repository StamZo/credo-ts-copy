"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P521PublicJwk = void 0;
const jwa_1 = require("../../jwa");
const ecPublicKey_1 = require("./ecPublicKey");
class P521PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = P521PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = P521PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = P521PublicJwk.multicodecPrefix;
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
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(publicKey, 'P-521');
        return new P521PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(multicodec, 'P-521');
        return new P521PublicJwk(jwk);
    }
}
exports.P521PublicJwk = P521PublicJwk;
P521PublicJwk.supportedSignatureAlgorithms = [jwa_1.KnownJwaSignatureAlgorithms.ES512];
P521PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [jwa_1.KnownJwaKeyAgreementAlgorithms.ECDH_ES];
P521PublicJwk.multicodecPrefix = 4610;
//# sourceMappingURL=P521PublicJwk.js.map