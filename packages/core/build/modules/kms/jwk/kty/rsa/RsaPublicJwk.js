"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsaPublicJwk = void 0;
const utils_1 = require("../../../../../utils");
const KeyManagementError_1 = require("../../../error/KeyManagementError");
const rsaPublicKey_1 = require("./rsaPublicKey");
class RsaPublicJwk {
    get supportedSignatureAlgorithms() {
        const keyBits = utils_1.TypedArrayEncoder.fromBase64(this.jwk.n).length * 8;
        // RSA needs minimum bit lengths for each algorithm
        const minBits2048 = ['PS256', 'RS256'];
        const minBits3072 = [...minBits2048, 'RS384', 'PS384'];
        const minBits4096 = [...minBits3072, 'RS512', 'PS512'];
        return keyBits >= 4096 ? minBits4096 : keyBits >= 3072 ? minBits3072 : keyBits >= 2048 ? minBits2048 : [];
    }
    constructor(jwk) {
        this.jwk = jwk;
        this.multicodecPrefix = RsaPublicJwk.multicodecPrefix;
        this.supportdEncryptionKeyAgreementAlgorithms = RsaPublicJwk.supportdEncryptionKeyAgreementAlgorithms;
    }
    get publicKey() {
        return {
            kty: this.jwk.kty,
            ...(0, rsaPublicKey_1.rsaPublicJwkToPublicKey)(this.jwk),
        };
    }
    get multicodec() {
        throw new KeyManagementError_1.KeyManagementError('multicodec not supported for RsaPublicJwk');
    }
    static fromPublicKey(publicKey) {
        return new RsaPublicJwk((0, rsaPublicKey_1.rsaPublicKeyToPublicJwk)(publicKey));
    }
    static fromMulticodec(_multicodec) {
        throw new KeyManagementError_1.KeyManagementError('fromMulticodec not supported for RsaPublicJwk');
    }
}
exports.RsaPublicJwk = RsaPublicJwk;
RsaPublicJwk.supportdEncryptionKeyAgreementAlgorithms = [];
RsaPublicJwk.supportedSignatureAlgorithms = [
    'PS256',
    'RS256',
    'RS384',
    'PS384',
    'RS512',
    'PS512',
];
RsaPublicJwk.multicodecPrefix = 4613;
//# sourceMappingURL=RsaPublicJwk.js.map