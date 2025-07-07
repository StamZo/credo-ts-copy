"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeSupportedJwaAlgorithm = void 0;
exports.performSign = performSign;
exports.mapJwaSignatureAlgorithmToNode = mapJwaSignatureAlgorithmToNode;
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const core_1 = require("@credo-ts/core");
const sign = (0, node_util_1.promisify)(node_crypto_1.sign);
function performSign(key, algorithm, data) {
    const nodeAlgorithm = mapJwaSignatureAlgorithmToNode(algorithm);
    const nodeKey = key.kty === 'oct' ? (0, node_crypto_1.createSecretKey)(core_1.TypedArrayEncoder.fromBase64(key.k)) : (0, node_crypto_1.createPrivateKey)({ format: 'jwk', key });
    switch (key.kty) {
        case 'RSA':
        case 'OKP': {
            const nodeKeyInput = algorithm.startsWith('PS')
                ? // For RSA-PSS, we need to set padding
                    {
                        key: nodeKey,
                        padding: node_crypto_1.constants.RSA_PKCS1_PSS_PADDING,
                        saltLength: Number.parseInt(algorithm.slice(2)) / 8,
                    }
                : nodeKey;
            return sign(nodeAlgorithm, data, nodeKeyInput);
        }
        case 'EC': {
            // Node returns EC signatures as DER encoded, but we need raw
            return sign(nodeAlgorithm, data, nodeKey).then((derSignature) => core_1.Kms.derEcSignatureToRaw(derSignature, key.crv));
        }
        case 'oct': {
            return (0, node_crypto_1.createHmac)(nodeAlgorithm, nodeKey)
                .update(data)
                .digest();
        }
        default:
            // @ts-expect-error
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${key.kty}'`, 'node');
    }
}
exports.nodeSupportedJwaAlgorithm = [
    'RS256',
    'PS256',
    'HS256',
    'ES256',
    'ES256K',
    'RS384',
    'PS384',
    'HS384',
    'ES384',
    'RS512',
    'PS512',
    'HS512',
    'ES512',
    'EdDSA',
];
function mapJwaSignatureAlgorithmToNode(algorithm) {
    switch (algorithm) {
        case 'RS256':
        case 'PS256':
        case 'HS256':
        case 'ES256':
        case 'ES256K':
            return 'sha256';
        case 'RS384':
        case 'PS384':
        case 'HS384':
        case 'ES384':
            return 'sha384';
        case 'RS512':
        case 'PS512':
        case 'HS512':
        case 'ES512':
            return 'sha512';
        // For EdDSA it's derived based on the key
        case 'EdDSA':
            return undefined;
        default:
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`JWA algorithm '${algorithm}'`, 'node');
    }
}
//# sourceMappingURL=sign.js.map