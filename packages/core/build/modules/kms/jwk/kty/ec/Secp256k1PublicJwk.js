"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secp256k1PublicJwk = void 0;
const jwa_1 = require("../../jwa");
const ecPublicKey_1 = require("./ecPublicKey");
class Secp256k1PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
        this.supportdEncryptionKeyAgreementAlgorithms = Secp256k1PublicJwk.supportdEncryptionKeyAgreementAlgorithms;
        this.supportedSignatureAlgorithms = Secp256k1PublicJwk.supportedSignatureAlgorithms;
        this.multicodecPrefix = Secp256k1PublicJwk.multicodecPrefix;
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
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(publicKey, 'secp256k1');
        return new Secp256k1PublicJwk(jwk);
    }
    static fromMulticodec(multicodec) {
        const jwk = (0, ecPublicKey_1.ecPublicKeyToPublicJwk)(multicodec, 'secp256k1');
        return new Secp256k1PublicJwk(jwk);
    }
}
exports.Secp256k1PublicJwk = Secp256k1PublicJwk;
Secp256k1PublicJwk.supportedSignatureAlgorithms = [jwa_1.KnownJwaSignatureAlgorithms.ES256K];
Secp256k1PublicJwk.supportdEncryptionKeyAgreementAlgorithms = [jwa_1.KnownJwaKeyAgreementAlgorithms.ECDH_ES];
Secp256k1PublicJwk.multicodecPrefix = 231;
//# sourceMappingURL=Secp256k1PublicJwk.js.map