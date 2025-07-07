"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwkHumanDescription = getJwkHumanDescription;
const utils_1 = require("../../../utils");
/**
 * Gets text description of a key.
 *
 * - `EC key with crv '<crv>'`
 * - `RSA key with bith length <bitLength>
 * - `oct key`
 * - `'<kty>' key`
 */
function getJwkHumanDescription(jwk) {
    if (jwk.kty === 'EC' || jwk.kty === 'OKP') {
        return `${jwk.kty} key with crv '${jwk.crv}'`;
    }
    if (jwk.kty === 'RSA') {
        // n is the modulus, base64url encoded. Decode to get bit length
        const nBytes = utils_1.TypedArrayEncoder.fromBase64(jwk.n).length;
        const bitLength = nBytes * 8;
        return `RSA key with bit length ${bitLength}`;
    }
    if (jwk.kty === 'oct') {
        return 'oct key';
    }
    // @ts-expect-error
    return `'${jwk.kty}' key'`;
}
//# sourceMappingURL=humanDescription.js.map