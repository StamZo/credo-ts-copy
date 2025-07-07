"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNodeSupportedEcCrv = assertNodeSupportedEcCrv;
exports.createEcKey = createEcKey;
exports.createRsaKey = createRsaKey;
exports.assertNodeSupportedOkpCrv = assertNodeSupportedOkpCrv;
exports.createOkpKey = createOkpKey;
exports.assertNodeSupportedOctAlgorithm = assertNodeSupportedOctAlgorithm;
exports.createOctKey = createOctKey;
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const core_1 = require("@credo-ts/core");
const generateKeyPair = (0, node_util_1.promisify)(node_crypto_1.generateKeyPair);
const nodeSupportedEcCrvs = ['P-256', 'P-384', 'P-521', 'secp256k1'];
function assertNodeSupportedEcCrv(options) {
    if (!nodeSupportedEcCrvs.includes(options.crv)) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`crv '${options.crv}' for kty '${options.kty}'`, 'node');
    }
}
async function createEcKey({ crv }) {
    const { publicKey, privateKey } = await generateKeyPair('ec', {
        namedCurve: crv,
    });
    const privateJwk = privateKey.export({
        format: 'jwk',
    });
    const publicJwk = publicKey.export({
        format: 'jwk',
    });
    return {
        privateJwk: privateJwk,
        publicJwk: publicJwk,
    };
}
async function createRsaKey({ modulusLength }) {
    const { publicKey, privateKey } = await generateKeyPair('rsa', {
        modulusLength,
    });
    const privateJwk = privateKey.export({
        format: 'jwk',
    });
    const publicJwk = publicKey.export({
        format: 'jwk',
    });
    return {
        privateJwk: privateJwk,
        publicJwk: publicJwk,
    };
}
const nodeSupportedOkpCrvs = ['Ed25519', 'X25519'];
function assertNodeSupportedOkpCrv(options) {
    if (!nodeSupportedOkpCrvs.includes(options.crv)) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`crv '${options.crv}' for kty '${options.kty}'`, 'node');
    }
}
async function createOkpKey({ crv }) {
    const { publicKey, privateKey } = crv === 'Ed25519' ? await generateKeyPair('ed25519') : await generateKeyPair('x25519');
    const privateJwk = privateKey.export({
        format: 'jwk',
    });
    const publicJwk = publicKey.export({
        format: 'jwk',
    });
    return {
        privateJwk: privateJwk,
        publicJwk: publicJwk,
    };
}
const nodeSupportedOctAlgorithms = ['aes', 'hmac'];
function assertNodeSupportedOctAlgorithm(options) {
    if (!nodeSupportedOctAlgorithms.includes(options.algorithm)) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`algorithm '${options.algorithm}' for kty '${options.kty}'`, 'node');
    }
}
async function createOctKey(options) {
    const secretBytes = (0, node_crypto_1.randomBytes)(options.length >> 3);
    const privateJwk = {
        kty: 'oct',
        k: secretBytes.toString('base64url'),
    };
    const { k, ...publicJwk } = privateJwk;
    return {
        privateJwk: privateJwk,
        publicJwk: publicJwk,
    };
}
//# sourceMappingURL=createKey.js.map