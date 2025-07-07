"use strict";
/*
 *
 * Based on: https://www.w3.org/TR/WebCryptoAPI/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyParamsToJwaAlgorithm = keyParamsToJwaAlgorithm;
const kms_1 = require("../../modules/kms");
const CredoWebCryptoError_1 = require("./CredoWebCryptoError");
/**
 * Derives the JWA algorithm name from KeySignParams or KeyVerifyParams
 * @param params - The signing or verification parameters
 * @returns The corresponding JWA algorithm string
 */
function keyParamsToJwaAlgorithm(params, key) {
    if (params.name === 'Ed25519') {
        if (!key.publicJwk.is(kms_1.Ed25519PublicJwk)) {
            throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported key for algorithm for Ed25519: ${key.publicJwk.jwkTypehumanDescription}`);
        }
        return 'EdDSA';
    }
    if (params.name === 'ECDSA') {
        // Normalize hash parameter
        const hashName = typeof params.hash === 'string' ? params.hash : params.hash.name;
        if (key.publicJwk.is(kms_1.Secp256k1PublicJwk)) {
            // Map ECDSA with different hash algorithms to JWA names
            switch (hashName) {
                case 'SHA-256':
                    return 'ES256K';
                default:
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for ECDSA with Secp255K1: ${hashName}`);
            }
        }
        // Map ECDSA with different hash algorithms to JWA names
        if (key.publicJwk.is(kms_1.P256PublicJwk)) {
            switch (hashName) {
                case 'SHA-256':
                    return 'ES256';
                default:
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for ECDSA with P256: ${hashName}`);
            }
        }
        // Map ECDSA with different hash algorithms to JWA names
        if (key.publicJwk.is(kms_1.P384PublicJwk)) {
            switch (hashName) {
                case 'SHA-384':
                    return 'ES384';
                default:
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for ECDSA with P384: ${hashName}`);
            }
        }
        // Map ECDSA with different hash algorithms to JWA names
        if (key.publicJwk.is(kms_1.P521PublicJwk)) {
            switch (hashName) {
                case 'SHA-512':
                    return 'ES512';
                default:
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for ECDSA with P521: ${hashName}`);
            }
        }
        throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported key ${key.publicJwk.jwkTypehumanDescription} or hash algorithm '${hashName}' for ECDSA`);
    }
    if (params.name === 'RSASSA-PKCS1-v1_5') {
        // Normalize hash parameter
        const hashName = typeof params.hash === 'string' ? params.hash : params.hash.name;
        if (!key.publicJwk.is(kms_1.RsaPublicJwk)) {
            throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported key for algorithm for RSASSA-PKCS1-v1_5: ${key.publicJwk.jwkTypehumanDescription}`);
        }
        // Map RSA-PKCS1 with different hash algorithms to JWA names
        switch (hashName) {
            case 'SHA-256':
                return 'RS256';
            case 'SHA-384':
                return 'RS384';
            case 'SHA-512':
                return 'RS512';
            default:
                throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for RSASSA-PKCS1-v1_5: ${hashName}`);
        }
    }
    if (params.name === 'RSA-PSS') {
        // Normalize hash parameter
        const hashName = typeof params.hash === 'string' ? params.hash : params.hash.name;
        if (!key.publicJwk.is(kms_1.RsaPublicJwk)) {
            throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported key for algorithm for RSA-PSS: ${key.publicJwk.jwkTypehumanDescription}`);
        }
        // Map RSA-PSS with different hash algorithms to JWA names
        switch (hashName) {
            case 'SHA-256':
                return 'PS256';
            case 'SHA-384':
                return 'PS384';
            case 'SHA-512':
                return 'PS512';
            default:
                throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported hash algorithm for RSA-PSS: ${hashName}`);
        }
    }
    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported algorithm: ${params.name}`);
}
//# sourceMappingURL=types.js.map