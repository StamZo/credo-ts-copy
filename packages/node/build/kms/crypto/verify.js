"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performVerify = performVerify;
const core_1 = require("@credo-ts/core");
const node_buffer_1 = require("node:buffer");
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const core_2 = require("@credo-ts/core");
const sign_1 = require("./sign");
const verify = (0, node_util_1.promisify)(node_crypto_1.verify);
function performVerify(key, algorithm, data, signature) {
    const nodeAlgorithm = (0, sign_1.mapJwaSignatureAlgorithmToNode)(algorithm);
    const nodeKey = key.kty === 'oct' ? (0, node_crypto_1.createSecretKey)(core_2.TypedArrayEncoder.fromBase64(key.k)) : (0, node_crypto_1.createPublicKey)({ format: 'jwk', key });
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
            return verify(nodeAlgorithm, data, nodeKeyInput, signature);
        }
        case 'EC': {
            // Node expects DER encoded signature, but we input raw
            return verify(nodeAlgorithm, data, nodeKey, core_1.Kms.rawEcSignatureToDer(signature, key.crv));
        }
        case 'oct': {
            const expectedHmac = (0, node_crypto_1.createHmac)(nodeAlgorithm, nodeKey)
                .update(data)
                .digest();
            // eslint-disable-next-line no-restricted-globals
            return (0, node_crypto_1.timingSafeEqual)(expectedHmac, node_buffer_1.Buffer.from(signature));
        }
        default:
            // @ts-expect-error
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${key.kty}'`, 'node');
    }
}
//# sourceMappingURL=verify.js.map