"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredoWalletWebCrypto = void 0;
const types_1 = require("./types");
const p384_1 = require("@noble/curves/p384");
const sha2_1 = require("@noble/hashes/sha2");
const asn1_schema_1 = require("@peculiar/asn1-schema");
const asn1_x509_1 = require("@peculiar/asn1-x509");
const p256_1 = require("@noble/curves/p256");
const kms_1 = require("../../modules/kms");
const CredoWebCryptoError_1 = require("./CredoWebCryptoError");
const CredoWebCryptoKey_1 = require("./CredoWebCryptoKey");
const utils_1 = require("./utils");
class CredoWalletWebCrypto {
    constructor(agentContext) {
        this.agentContext = agentContext;
        this.kms = agentContext.resolve(kms_1.KeyManagementApi);
    }
    generateRandomValues(array) {
        if (!array)
            return array;
        return this.kms.randomBytes({ length: array.byteLength });
    }
    async sign(key, message, algorithm) {
        const jwaAlgorithm = (0, types_1.keyParamsToJwaAlgorithm)(algorithm, key);
        const keyId = key.publicJwk.keyId;
        const { signature } = await this.kms.sign({
            keyId,
            data: message,
            algorithm: jwaAlgorithm,
        });
        return signature;
    }
    async verify(key, algorithm, message, signature) {
        const publicKey = key.publicJwk.publicKey;
        // TODO: with new KMS api we can now define custom algorithms
        // such as ES256-SHA384 to support these non-standard JWA combinatiosn
        // or we can do something like ES256-ph (pre-hashed for more generic)
        if (algorithm.name === 'ECDSA') {
            const hashAlg = typeof algorithm.hash === 'string' ? algorithm.hash : algorithm.hash.name;
            if (publicKey.kty === 'EC' && publicKey.crv === 'P-256' && hashAlg !== 'SHA-256') {
                if (hashAlg !== 'SHA-384') {
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Hash Alg: ${hashAlg} is not supported with key type ${publicKey.crv} currently`);
                }
                return p256_1.p256.verify(signature, (0, sha2_1.sha384)(message), publicKey.publicKey);
            }
            if (publicKey.kty === 'EC' && publicKey.crv === 'P-384' && hashAlg !== 'SHA-384') {
                if (hashAlg !== 'SHA-256') {
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Hash Alg: ${hashAlg} is not supported with key type ${publicKey.crv} currently`);
                }
                return p384_1.p384.verify(signature, (0, sha2_1.sha256)(message), publicKey.publicKey);
            }
        }
        const jwaAlgorithm = (0, types_1.keyParamsToJwaAlgorithm)(algorithm, key);
        const { verified } = await this.kms.verify({
            key: {
                publicJwk: key.publicJwk.toJson(),
            },
            algorithm: jwaAlgorithm,
            signature,
            data: message,
        });
        return verified;
    }
    async generate(algorithm) {
        const key = await this.kms.createKey({
            type: (0, utils_1.cryptoKeyAlgorithmToCreateKeyOptions)(algorithm),
        });
        return key;
    }
    async importKey(format, keyData, algorithm, extractable, keyUsages) {
        if (format === 'jwk' && keyData instanceof Uint8Array) {
            throw new Error('JWK format is only allowed with a jwk as key data');
        }
        if (format !== 'jwk' && !(keyData instanceof Uint8Array)) {
            throw new Error('non-jwk formats are only allowed with a uint8array as key data');
        }
        switch (format.toLowerCase()) {
            case 'jwk': {
                const publicJwk = kms_1.PublicJwk.fromUnknown(keyData);
                return new CredoWebCryptoKey_1.CredoWebCryptoKey(publicJwk, algorithm, extractable, 'public', keyUsages);
            }
            case 'spki': {
                const subjectPublicKey = asn1_schema_1.AsnParser.parse(keyData, asn1_x509_1.SubjectPublicKeyInfo);
                const publicJwk = (0, utils_1.spkiToPublicJwk)(subjectPublicKey);
                return new CredoWebCryptoKey_1.CredoWebCryptoKey(publicJwk, algorithm, extractable, 'public', keyUsages);
            }
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    async exportKey(format, key) {
        switch (format.toLowerCase()) {
            case 'jwk': {
                return key.publicJwk.toJson();
            }
            case 'spki': {
                const publicKeyInfo = (0, utils_1.publicJwkToSpki)(key.publicJwk);
                const derEncoded = asn1_schema_1.AsnConvert.serialize(publicKeyInfo);
                return new Uint8Array(derEncoded);
            }
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
}
exports.CredoWalletWebCrypto = CredoWalletWebCrypto;
//# sourceMappingURL=CredoWalletWebCrypto.js.map