"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.X25519PublicJwk = void 0;
const jwa_1 = require("../../jwa");
const okpPublicKey_1 = require("./okpPublicKey");
class X25519PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = X25519PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = X25519PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = X25519PublicJwk.multicodecPrefix;
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
        const jwk = (0, okpPublicKey_1.okpPublicKeyToPublicJwk)(publicKey, 'X25519');
        return new X25519PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, okpPublicKey_1.okpPublicKeyToPublicJwk)(multicodec, 'X25519');
        return new X25519PublicJwk(jwk);
    }
}
exports.X25519PublicJwk = X25519PublicJwk;
X25519PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [jwa_1.KnownJwaKeyAgreementAlgorithms.ECDH_HSALSA20];
X25519PublicJwk.supportedSignatureAlgorithms = [];
X25519PublicJwk.multicodecPrefix = 236;
//# sourceMappingURL=X25519PublicJwk.js.map