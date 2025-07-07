"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodeKeyManagementService_storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeKeyManagementService = void 0;
const node_crypto_1 = require("node:crypto");
const core_1 = require("@credo-ts/core");
const createKey_1 = require("./crypto/createKey");
const decrypt_1 = require("./crypto/decrypt");
const deriveKey_1 = require("./crypto/deriveKey");
const encrypt_1 = require("./crypto/encrypt");
const sign_1 = require("./crypto/sign");
const verify_1 = require("./crypto/verify");
class NodeKeyManagementService {
    constructor(storage) {
        this.backend = 'node';
        _NodeKeyManagementService_storage.set(this, void 0);
        __classPrivateFieldSet(this, _NodeKeyManagementService_storage, storage, "f");
    }
    isOperationSupported(_agentContext, operation) {
        if (operation.operation === 'deleteKey')
            return true;
        if (operation.operation === 'randomBytes')
            return true;
        if (operation.operation === 'createKey') {
            // TODO: probably clean to split the assert methods so we don't need try/catch here
            try {
                if (operation.type.kty === 'RSA') {
                    return true;
                }
                if (operation.type.kty === 'EC') {
                    (0, createKey_1.assertNodeSupportedEcCrv)(operation.type);
                    return true;
                }
                if (operation.type.kty === 'OKP') {
                    (0, createKey_1.assertNodeSupportedOkpCrv)(operation.type);
                    return true;
                }
                if (operation.type.kty === 'oct') {
                    (0, createKey_1.assertNodeSupportedOctAlgorithm)(operation.type);
                    return true;
                }
            }
            catch {
                return false;
            }
            return false;
        }
        if (operation.operation === 'importKey') {
            try {
                if (operation.privateJwk.kty === 'RSA' || operation.privateJwk.kty === 'oct') {
                    return true;
                }
                if (operation.privateJwk.kty === 'EC') {
                    (0, createKey_1.assertNodeSupportedEcCrv)({ kty: operation.privateJwk.kty, crv: operation.privateJwk.crv });
                    return true;
                }
                if (operation.privateJwk.kty === 'OKP') {
                    (0, createKey_1.assertNodeSupportedOkpCrv)({ kty: operation.privateJwk.kty, crv: operation.privateJwk.crv });
                    return true;
                }
            }
            catch {
                return false;
            }
        }
        if (operation.operation === 'sign' || operation.operation === 'verify') {
            return sign_1.nodeSupportedJwaAlgorithm.includes(operation.algorithm);
        }
        if (operation.operation === 'encrypt') {
            const isSupportedEncryptionAlgorithm = encrypt_1.nodeSupportedEncryptionAlgorithms.includes(operation.encryption.algorithm);
            if (!isSupportedEncryptionAlgorithm)
                return false;
            if (!operation.keyAgreement)
                return true;
            return deriveKey_1.nodeSupportedKeyAgreementAlgorithms.includes(operation.keyAgreement.algorithm);
        }
        if (operation.operation === 'decrypt') {
            const isSupportedEncryptionAlgorithm = encrypt_1.nodeSupportedEncryptionAlgorithms.includes(operation.decryption.algorithm);
            if (!isSupportedEncryptionAlgorithm)
                return false;
            if (!operation.keyAgreement)
                return true;
            return deriveKey_1.nodeSupportedKeyAgreementAlgorithms.includes(operation.keyAgreement.algorithm);
        }
        return false;
    }
    randomBytes(_agentContext, options) {
        return (0, node_crypto_1.randomBytes)(options.length);
    }
    async getPublicKey(agentContext, keyId) {
        const privateJwk = await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").get(agentContext, keyId);
        if (!privateJwk)
            return null;
        return core_1.Kms.publicJwkFromPrivateJwk(privateJwk);
    }
    async importKey(agentContext, options) {
        const { kid } = options.privateJwk;
        if (kid)
            await this.assertKeyNotExists(agentContext, kid);
        const privateJwk = {
            ...options.privateJwk,
            kid: kid ?? (0, node_crypto_1.randomUUID)(),
        };
        try {
            if (privateJwk.kty === 'oct') {
                // Just check if we can create a secret key instance
                (0, node_crypto_1.createSecretKey)(core_1.TypedArrayEncoder.fromBase64(privateJwk.k)).export({ format: 'jwk' });
            }
            else if (privateJwk.kty === 'EC') {
                (0, createKey_1.assertNodeSupportedEcCrv)({ kty: privateJwk.kty, crv: privateJwk.crv });
                // This validates the JWK
                (0, node_crypto_1.createPrivateKey)({
                    format: 'jwk',
                    key: privateJwk,
                });
            }
            else if (privateJwk.kty === 'OKP') {
                (0, createKey_1.assertNodeSupportedOkpCrv)({ kty: privateJwk.kty, crv: privateJwk.crv });
                // This validates the JWK
                (0, node_crypto_1.createPrivateKey)({
                    format: 'jwk',
                    key: privateJwk,
                });
            }
            else if (privateJwk.kty === 'RSA') {
                // This validates the JWK
                (0, node_crypto_1.createPrivateKey)({
                    format: 'jwk',
                    key: privateJwk,
                });
            }
            else {
                // All kty values supported for now, but can change in the future
                // @ts-expect-error
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${privateJwk.kty}'`, this.backend);
            }
            await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").set(agentContext, privateJwk.kid, privateJwk);
            const publicJwk = core_1.Kms.publicJwkFromPrivateJwk(privateJwk);
            return {
                keyId: privateJwk.kid,
                publicJwk: {
                    ...publicJwk,
                    kid: privateJwk.kid,
                },
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error importing key', { cause: error });
        }
    }
    async deleteKey(agentContext, options) {
        return await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").delete(agentContext, options.keyId);
    }
    async createKey(agentContext, options) {
        const { type, keyId } = options;
        if (keyId)
            await this.assertKeyNotExists(agentContext, keyId);
        try {
            let jwks;
            if (type.kty === 'EC') {
                (0, createKey_1.assertNodeSupportedEcCrv)(type);
                jwks = await (0, createKey_1.createEcKey)(type);
            }
            else if (type.kty === 'OKP') {
                (0, createKey_1.assertNodeSupportedOkpCrv)(type);
                jwks = await (0, createKey_1.createOkpKey)(type);
            }
            else if (type.kty === 'RSA') {
                jwks = await (0, createKey_1.createRsaKey)(type);
            }
            else if (type.kty === 'oct') {
                (0, createKey_1.assertNodeSupportedOctAlgorithm)(type);
                jwks = await (0, createKey_1.createOctKey)(type);
            }
            else {
                // @ts-expect-error
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${type.kty}'`, this.backend);
            }
            jwks.privateJwk.kid = keyId ?? (0, node_crypto_1.randomUUID)();
            jwks.publicJwk.kid = jwks.privateJwk.kid;
            await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").set(agentContext, jwks.privateJwk.kid, jwks.privateJwk);
            return {
                publicJwk: jwks.publicJwk,
                keyId: jwks.publicJwk.kid,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error creating key', { cause: error });
        }
    }
    async sign(agentContext, options) {
        const { keyId, algorithm, data } = options;
        // 1. Retrieve the key
        const key = await this.getKeyAsserted(agentContext, keyId);
        try {
            // 2. Validate alg and use for key
            core_1.Kms.assertAllowedSigningAlgForKey(key, algorithm);
            core_1.Kms.assertKeyAllowsSign(key);
            // 3. Perform the signing operation
            const signature = await (0, sign_1.performSign)(key, algorithm, data);
            return {
                signature,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error signing with key', { cause: error });
        }
    }
    async verify(agentContext, options) {
        const { algorithm, data, signature } = options;
        try {
            let key;
            if (options.key.keyId) {
                key = await this.getKeyAsserted(agentContext, options.key.keyId);
            }
            else if (options.key.publicJwk?.kty === 'EC') {
                (0, createKey_1.assertNodeSupportedEcCrv)(options.key.publicJwk);
                key = options.key.publicJwk;
            }
            else if (options.key.publicJwk?.kty === 'OKP') {
                (0, createKey_1.assertNodeSupportedOkpCrv)(options.key.publicJwk);
                key = options.key.publicJwk;
            }
            else if (options.key.publicJwk?.kty === 'RSA') {
                key = options.key.publicJwk;
            }
            else {
                // @ts-expect-error
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty ${options.key.kty}`, this.backend);
            }
            // 2. Validate alg and use for key
            core_1.Kms.assertAllowedSigningAlgForKey(key, algorithm);
            core_1.Kms.assertKeyAllowsVerify(key);
            // 3. Perform the verify operation
            const verified = await (0, verify_1.performVerify)(key, algorithm, data, signature);
            if (verified) {
                return {
                    verified: true,
                    publicJwk: core_1.Kms.publicJwkFromPrivateJwk(key),
                };
            }
            return {
                verified: false,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error verifying with key', { cause: error });
        }
    }
    async encrypt(agentContext, options) {
        const { data, encryption, key } = options;
        core_1.Kms.assertSupportedEncryptionAlgorithm(encryption, encrypt_1.nodeSupportedEncryptionAlgorithms, this.backend);
        let encryptionKey;
        let encryptedKey = undefined;
        if (key.keyId) {
            encryptionKey = await this.getKeyAsserted(agentContext, key.keyId);
        }
        else if (key.privateJwk) {
            encryptionKey = key.privateJwk;
        }
        else if (key.keyAgreement) {
            core_1.Kms.assertAllowedKeyDerivationAlgForKey(key.keyAgreement.externalPublicJwk, key.keyAgreement.algorithm);
            core_1.Kms.assertKeyAllowsDerive(key.keyAgreement.externalPublicJwk);
            core_1.Kms.assertSupportedKeyAgreementAlgorithm(key.keyAgreement, deriveKey_1.nodeSupportedKeyAgreementAlgorithms, this.backend);
            const privateJwk = await this.getKeyAsserted(agentContext, key.keyAgreement.keyId);
            core_1.Kms.assertJwkAsymmetric(privateJwk, key.keyAgreement.keyId);
            core_1.Kms.assertAllowedKeyDerivationAlgForKey(privateJwk, key.keyAgreement.algorithm);
            core_1.Kms.assertKeyAllowsDerive(privateJwk);
            core_1.Kms.assertAsymmetricJwkKeyTypeMatches(privateJwk, key.keyAgreement.externalPublicJwk);
            const { contentEncryptionKey, encryptedContentEncryptionKey } = await (0, deriveKey_1.deriveEncryptionKey)({
                keyAgreement: key.keyAgreement,
                encryption,
                privateJwk,
            });
            encryptionKey = contentEncryptionKey;
            encryptedKey = encryptedContentEncryptionKey;
        }
        else {
            throw new core_1.Kms.KeyManagementError('Unexpected key parameter for encrypt');
        }
        if (encryptionKey.kty !== 'oct') {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${encryptionKey.kty} for content encryption'`, this.backend);
        }
        try {
            // 2. Validate alg and use for key
            core_1.Kms.assertAllowedEncryptionAlgForKey(encryptionKey, encryption.algorithm);
            core_1.Kms.assertKeyAllowsEncrypt(encryptionKey);
            // 3. Perform the encryption operation
            const encrypted = await (0, encrypt_1.performEncrypt)(encryptionKey, options.encryption, data);
            return {
                ...encrypted,
                encryptedKey,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error encrypting', { cause: error });
        }
    }
    async decrypt(agentContext, options) {
        const { decryption, encrypted, key } = options;
        core_1.Kms.assertSupportedEncryptionAlgorithm(decryption, encrypt_1.nodeSupportedEncryptionAlgorithms, this.backend);
        let decryptionKey;
        if (key.keyId) {
            decryptionKey = await this.getKeyAsserted(agentContext, key.keyId);
        }
        else if (key.privateJwk) {
            decryptionKey = key.privateJwk;
        }
        else if (key.keyAgreement) {
            core_1.Kms.assertSupportedKeyAgreementAlgorithm(key.keyAgreement, deriveKey_1.nodeSupportedKeyAgreementAlgorithms, this.backend);
            core_1.Kms.assertAllowedKeyDerivationAlgForKey(key.keyAgreement.externalPublicJwk, key.keyAgreement.algorithm);
            core_1.Kms.assertKeyAllowsDerive(key.keyAgreement.externalPublicJwk);
            const privateJwk = await this.getKeyAsserted(agentContext, key.keyAgreement.keyId);
            core_1.Kms.assertJwkAsymmetric(privateJwk, key.keyAgreement.keyId);
            core_1.Kms.assertAllowedKeyDerivationAlgForKey(privateJwk, key.keyAgreement.algorithm);
            core_1.Kms.assertKeyAllowsDerive(privateJwk);
            core_1.Kms.assertAsymmetricJwkKeyTypeMatches(privateJwk, key.keyAgreement.externalPublicJwk);
            const { contentEncryptionKey } = await (0, deriveKey_1.deriveDecryptionKey)({
                keyAgreement: key.keyAgreement,
                decryption,
                privateJwk,
            });
            decryptionKey = contentEncryptionKey;
        }
        else {
            throw new core_1.Kms.KeyManagementError('Unexpected key parameter for decrypt');
        }
        if (decryptionKey.kty !== 'oct') {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${decryptionKey.kty}' for content encryption`, this.backend);
        }
        try {
            // 2. Validate alg and use for key
            core_1.Kms.assertAllowedEncryptionAlgForKey(decryptionKey, decryption.algorithm);
            core_1.Kms.assertKeyAllowsEncrypt(decryptionKey);
            // 3. Perform the decryption operation
            return await (0, decrypt_1.performDecrypt)(decryptionKey, decryption, encrypted);
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error decrypting', { cause: error });
        }
    }
    async getKeyAsserted(agentContext, keyId) {
        const storageKey = await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").get(agentContext, keyId);
        if (!storageKey) {
            throw new core_1.Kms.KeyManagementKeyNotFoundError(keyId, this.backend);
        }
        return storageKey;
    }
    async assertKeyNotExists(agentContext, keyId) {
        const storageKey = await __classPrivateFieldGet(this, _NodeKeyManagementService_storage, "f").get(agentContext, keyId);
        if (storageKey) {
            throw new core_1.Kms.KeyManagementKeyExistsError(keyId, this.backend);
        }
    }
}
exports.NodeKeyManagementService = NodeKeyManagementService;
_NodeKeyManagementService_storage = new WeakMap();
//# sourceMappingURL=NodeKeyManagementService.js.map