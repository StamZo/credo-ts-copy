"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedSigningAlgsForSigningKey = allowedSigningAlgsForSigningKey;
exports.assertAllowedSigningAlgForKey = assertAllowedSigningAlgForKey;
exports.supportedSigningAlgsForKey = supportedSigningAlgsForKey;
exports.createKeyTypeForSigningAlgorithm = createKeyTypeForSigningAlgorithm;
const utils_1 = require("../../../../utils");
const KeyManagementError_1 = require("../../error/KeyManagementError");
const humanDescription_1 = require("../humanDescription");
/**
 * Get the allowed algs for a signing key. If takes all the known supported
 * algs and will filter these based on the optional `alg` key in the JWK.
 *
 * This does not handle the intended key `use` and `key_ops`.
 */
function allowedSigningAlgsForSigningKey(jwk) {
    const supportedAlgs = supportedSigningAlgsForKey(jwk);
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
function assertAllowedSigningAlgForKey(jwk, algorithm) {
    const allowedAlgs = allowedSigningAlgsForSigningKey(jwk);
    if (!allowedAlgs.includes(algorithm)) {
        const allowedAlgsText = allowedAlgs.length > 0 ? ` Allowed algs are ${allowedAlgs.map((alg) => `'${alg}'`).join(', ')}` : '';
        throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(jwk)} cannot be used with algorithm '${algorithm}' for signature creation or verification.${allowedAlgsText}`);
    }
}
// NOTE: this should be replaced by the PublicJwk class
// but it woun't work for oct keys
function supportedSigningAlgsForKey(jwk) {
    if (jwk.kty === 'EC' || jwk.kty === 'OKP') {
        switch (jwk.crv) {
            case 'secp256k1':
                return ['ES256K'];
            case 'P-256':
                return ['ES256'];
            case 'P-384':
                return ['ES384'];
            case 'P-521':
                return ['ES512'];
            case 'Ed25519':
                return ['EdDSA'];
            // X25519
            default:
                return [];
        }
    }
    if (jwk.kty === 'RSA') {
        const keyBits = utils_1.TypedArrayEncoder.fromBase64(jwk.n).length * 8;
        // RSA needs minimum bit lengths for each algorithm
        const minBits2048 = ['PS256', 'RS256'];
        const minBits3072 = [...minBits2048, 'RS384', 'PS384'];
        const minBits4096 = [...minBits3072, 'RS512', 'PS512'];
        return keyBits >= 4096 ? minBits4096 : keyBits >= 3072 ? minBits3072 : keyBits >= 2048 ? minBits2048 : [];
    }
    // On other layers we need to filter for alg types, as you don't want any `oct` key with enough length to used for hmac purposes
    if (jwk.kty === 'oct') {
        const keyBits = utils_1.TypedArrayEncoder.fromBase64(jwk.k).length * 8;
        // hmac needs minimum bit lengths for each algorithm
        const minBits256 = ['HS256'];
        const minBits384 = [...minBits256, 'HS384'];
        const minBits512 = [...minBits384, 'HS512'];
        return keyBits >= 512 ? minBits512 : keyBits >= 384 ? minBits384 : keyBits >= 256 ? minBits256 : [];
    }
    return [];
}
// TODO: Can we move this to the JWK classes?
function createKeyTypeForSigningAlgorithm(algorithm) {
    // On JWK class we can have
    if (algorithm === 'ES256') {
        return {
            kty: 'EC',
            crv: 'P-256',
        };
    }
    if (algorithm === 'ES384') {
        return {
            kty: 'EC',
            crv: 'P-384',
        };
    }
    if (algorithm === 'ES512') {
        return {
            kty: 'EC',
            crv: 'P-521',
        };
    }
    if (algorithm === 'ES256K') {
        return {
            kty: 'EC',
            crv: 'secp256k1',
        };
    }
    if (algorithm === 'EdDSA') {
        return {
            kty: 'OKP',
            crv: 'Ed25519',
        };
    }
    if (algorithm === 'HS256') {
        return {
            kty: 'oct',
            algorithm: 'hmac',
            length: 256,
        };
    }
    if (algorithm === 'HS384') {
        return {
            kty: 'oct',
            algorithm: 'hmac',
            length: 384,
        };
    }
    if (algorithm === 'HS512') {
        return {
            kty: 'oct',
            algorithm: 'hmac',
            length: 512,
        };
    }
    if (algorithm === 'PS256' || algorithm === 'RS256') {
        return {
            kty: 'RSA',
            modulusLength: 2048,
        };
    }
    if (algorithm === 'PS384' || algorithm === 'RS384') {
        return {
            kty: 'RSA',
            modulusLength: 3072,
        };
    }
    if (algorithm === 'PS512' || algorithm === 'RS512') {
        return {
            kty: 'RSA',
            modulusLength: 4096,
        };
    }
    throw new KeyManagementError_1.KeyManagementError(`unknown signature algorithm '${algorithm}' for creating key `);
}
//# sourceMappingURL=signing.js.map