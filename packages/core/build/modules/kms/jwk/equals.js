"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assymetricJwkKeyTypeMatches = assymetricJwkKeyTypeMatches;
exports.assertAsymmetricJwkKeyTypeMatches = assertAsymmetricJwkKeyTypeMatches;
exports.assymetricPublicJwkMatches = assymetricPublicJwkMatches;
const KeyManagementError_1 = require("../error/KeyManagementError");
const humanDescription_1 = require("./humanDescription");
/**
 * Checks if two JWK public keys have matching key types
 * Supports EC, OKP, and RSA key types
 */
function assymetricJwkKeyTypeMatches(first, second) {
    if (first.kty !== second.kty)
        return false;
    if (first.kty === 'EC' && second.kty === 'EC') {
        return first.crv === second.crv;
    }
    if (first.kty === 'OKP' && second.kty === 'OKP') {
        return first.crv === second.crv;
    }
    if (first.kty === 'RSA' && second.kty === 'RSA') {
        // RSA doesn't have curve parameter, so key type match is sufficient
        return true;
    }
    // Unknown key type
    return false;
}
/**
 * Checks if two JWK public keys have matching key types
 * Supports EC, OKP, and RSA key types
 */
function assertAsymmetricJwkKeyTypeMatches(first, second) {
    if (!assymetricJwkKeyTypeMatches(first, second)) {
        throw new KeyManagementError_1.KeyManagementError(`Expected jwk types to match, but found ${(0, humanDescription_1.getJwkHumanDescription)(first)} and ${(0, humanDescription_1.getJwkHumanDescription)(second)}`);
    }
}
/**
 * Checks if two JWK public keys have matching key material
 * Supports EC, OKP, and RSA key types
 */
function assymetricPublicJwkMatches(first, second) {
    // First check that types match
    if (!assymetricJwkKeyTypeMatches(first, second)) {
        return false;
    }
    // For EC keys, compare x and y coordinates
    if (first.kty === 'EC' && second.kty === 'EC') {
        return first.x === second.x && first.y === second.y;
    }
    // For OKP keys, compare x coordinate (Ed25519, X25519, etc.)
    if (first.kty === 'OKP' && second.kty === 'OKP') {
        return first.x === second.x;
    }
    // For RSA keys, compare modulus (n) and exponent (e)
    if (first.kty === 'RSA' && second.kty === 'RSA') {
        return first.n === second.n && first.e === second.e;
    }
    // Unknown key type
    return false;
}
//# sourceMappingURL=equals.js.map