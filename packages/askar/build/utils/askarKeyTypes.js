"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwkEncToAskarAlg = exports.jwkCrvToAskarAlg = void 0;
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
exports.jwkCrvToAskarAlg = {
    // EC
    secp256k1: askar_shared_1.KeyAlgorithm.EcSecp256k1,
    'P-256': askar_shared_1.KeyAlgorithm.EcSecp256r1,
    'P-384': askar_shared_1.KeyAlgorithm.EcSecp384r1,
    // OKP
    X25519: askar_shared_1.KeyAlgorithm.X25519,
    Ed25519: askar_shared_1.KeyAlgorithm.Ed25519,
};
exports.jwkEncToAskarAlg = {
    'A128CBC-HS256': askar_shared_1.KeyAlgorithm.AesA128CbcHs256,
    A128GCM: askar_shared_1.KeyAlgorithm.AesA128Gcm,
    'A256CBC-HS512': askar_shared_1.KeyAlgorithm.AesA256CbcHs512,
    A256GCM: askar_shared_1.KeyAlgorithm.AesA256Gcm,
    C20P: askar_shared_1.KeyAlgorithm.Chacha20C20P,
    XC20P: askar_shared_1.KeyAlgorithm.Chacha20XC20P,
    A128KW: askar_shared_1.KeyAlgorithm.AesA128Kw,
    A256KW: askar_shared_1.KeyAlgorithm.AesA256Kw,
};
//# sourceMappingURL=askarKeyTypes.js.map