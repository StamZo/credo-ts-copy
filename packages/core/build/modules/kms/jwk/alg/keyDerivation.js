"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedKeyDerivationAlgsForKey = supportedKeyDerivationAlgsForKey;
exports.allowedKeyDerivationAlgsForKey = allowedKeyDerivationAlgsForKey;
exports.assertAllowedKeyDerivationAlgForKey = assertAllowedKeyDerivationAlgForKey;
const KeyManagementError_1 = require("../../error/KeyManagementError");
const humanDescription_1 = require("../humanDescription");
function isCrvJwk(jwk) {
    return jwk.kty === 'EC' || jwk.kty === 'OKP';
}
function supportedKeyDerivationAlgsForKey(jwk) {
    const algs = [];
    const allowedCurves = ['P-256', 'P-384', 'P-521', 'X25519', 'secp256k1'];
    if (isCrvJwk(jwk) && allowedCurves.includes(jwk.crv)) {
        algs.push('ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW');
    }
    // Special case where we allow Ed25519 for X25519 based operation, since that is
    // how DIDComm v1 works.
    if (jwk.kty === 'OKP' && (jwk.crv === 'X25519' || jwk.crv === 'Ed25519')) {
        algs.push('ECDH-HSALSA20');
    }
    return algs;
}
/**
 * Get the allowed key derivation algs for a key. If takes all the known supported
 * algs and will filter these based on the optional `alg` key in the JWK.
 *
 * This does not handle the intended key `use` and `key_ops`.
 */
function allowedKeyDerivationAlgsForKey(jwk) {
    const supportedAlgs = supportedKeyDerivationAlgsForKey(jwk);
    const allowedAlg = jwk.alg;
    return !allowedAlg
        ? // If no `alg` specified on jwk, return all supported algs
            supportedAlgs
        : // If `alg` is specified and supported, return the allowed alg
            allowedAlg && supportedAlgs.includes(allowedAlg)
                ? [allowedAlg]
                : // Otherwise nothing is allowed (`alg` is specified but not supported)
                    [];
}
function assertAllowedKeyDerivationAlgForKey(jwk, algorithm) {
    const allowedAlgs = allowedKeyDerivationAlgsForKey(jwk);
    if (!allowedAlgs.includes(algorithm)) {
        const allowedAlgsText = allowedAlgs.length > 0 ? ` Allowed algs are ${allowedAlgs.map((alg) => `'${alg}'`).join(', ')}` : '';
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} cannot be used with algorithm '${algorithm}' for key derivation.${allowedAlgsText}`);
    }
}
//# sourceMappingURL=keyDerivation.js.map