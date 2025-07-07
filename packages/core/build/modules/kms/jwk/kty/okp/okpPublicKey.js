"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.okpPublicJwkToPublicKey = okpPublicJwkToPublicKey;
exports.okpPublicKeyToPublicJwk = okpPublicKeyToPublicJwk;
const utils_1 = require("../../../../../utils");
function okpPublicJwkToPublicKey(publicJwk) {
    const publicKey = Uint8Array.from(utils_1.TypedArrayEncoder.fromBase64(publicJwk.x));
    return publicKey;
}
function okpPublicKeyToPublicJwk(publicKey, crv) {
    const jwk = {
        kty: 'OKP',
        crv,
        x: utils_1.TypedArrayEncoder.toBase64URL(publicKey),
    };
    return jwk;
}
//# sourceMappingURL=okpPublicKey.js.map