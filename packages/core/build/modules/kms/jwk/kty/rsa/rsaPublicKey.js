"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsaPublicJwkToPublicKey = rsaPublicJwkToPublicKey;
exports.rsaPublicKeyToPublicJwk = rsaPublicKeyToPublicJwk;
const utils_1 = require("../../../../../utils");
function rsaPublicJwkToPublicKey(publicJwk) {
    const modulus = Uint8Array.from(utils_1.TypedArrayEncoder.fromBase64(publicJwk.n));
    const exponent = Uint8Array.from(utils_1.TypedArrayEncoder.fromBase64(publicJwk.e));
    return {
        modulus,
        exponent,
    };
}
function rsaPublicKeyToPublicJwk(options) {
    const jwk = {
        kty: 'RSA',
        n: utils_1.TypedArrayEncoder.toBase64URL(options.modulus),
        e: utils_1.TypedArrayEncoder.toBase64URL(options.exponent),
    };
    return jwk;
}
//# sourceMappingURL=rsaPublicKey.js.map