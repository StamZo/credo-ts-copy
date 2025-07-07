"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarKeyManagementService = void 0;
const core_1 = require("@credo-ts/core");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const AskarStoreManager_1 = require("../AskarStoreManager");
const utils_1 = require("../utils");
const decrypt_1 = require("./crypto/decrypt");
const deriveKey_1 = require("./crypto/deriveKey");
const encrypt_1 = require("./crypto/encrypt");
const randomBytes_1 = require("./crypto/randomBytes");
const askarSupportedEncryptionAlgorithms = [
    ...Object.keys(utils_1.jwkEncToAskarAlg),
    'XSALSA20-POLY1305',
];
class AskarKeyManagementService {
    constructor() {
        this.backend = AskarKeyManagementService.backend;
    }
    withSession(agentContext, callback) {
        return agentContext.dependencyManager.resolve(AskarStoreManager_1.AskarStoreManager).withSession(agentContext, callback);
    }
    isOperationSupported(_agentContext, operation) {
        if (operation.operation === 'deleteKey')
            return true;
        if (operation.operation === 'randomBytes')
            return true;
        if (operation.operation === 'importKey') {
            if (operation.privateJwk.kty === 'EC' || operation.privateJwk.kty === 'OKP') {
                return utils_1.jwkCrvToAskarAlg[operation.privateJwk.crv] !== undefined;
            }
            // RSA/oct not supported
            return false;
        }
        if (operation.operation === 'createKey') {
            if (operation.type.kty === 'EC' || operation.type.kty === 'OKP') {
                return utils_1.jwkCrvToAskarAlg[operation.type.crv] !== undefined;
            }
            if (operation.type.kty === 'oct') {
                if (operation.type.algorithm === 'C20P')
                    return true;
                // TODO: sync with the createKey code
                if (operation.type.algorithm === 'aes') {
                    return [128, 256].includes(operation.type.length);
                }
            }
            return false;
        }
        if (operation.operation === 'sign' || operation.operation === 'verify') {
            return AskarKeyManagementService.algToSigType[operation.algorithm] !== undefined;
        }
        if (operation.operation === 'encrypt') {
            const isSupportedEncryptionAlgorithm = askarSupportedEncryptionAlgorithms.includes(operation.encryption.algorithm);
            if (!isSupportedEncryptionAlgorithm)
                return false;
            if (!operation.keyAgreement)
                return true;
            return deriveKey_1.askarSupportedKeyAgreementAlgorithms.includes(operation.keyAgreement.algorithm);
        }
        if (operation.operation === 'decrypt') {
            const isSupportedEncryptionAlgorithm = askarSupportedEncryptionAlgorithms.includes(operation.decryption.algorithm);
            if (!isSupportedEncryptionAlgorithm)
                return false;
            if (!operation.keyAgreement)
                return true;
            return deriveKey_1.askarSupportedKeyAgreementAlgorithms.includes(operation.keyAgreement.algorithm);
        }
        return false;
    }
    randomBytes(_agentContext, options) {
        return (0, randomBytes_1.randomBytes)(options.length);
    }
    async getPublicKey(agentContext, keyId) {
        const key = await this.fetchAskarKey(agentContext, keyId);
        if (!key)
            return null;
        return this.publicJwkFromKey(key.key, { kid: keyId });
    }
    async importKey(agentContext, options) {
        const { kid } = options.privateJwk;
        const privateJwk = {
            ...options.privateJwk,
            kid: kid ?? core_1.utils.uuid(),
        };
        let key = undefined;
        try {
            if (privateJwk.kty === 'oct') {
                // TODO: we need to look at how to import symmetric keys, as we need the alg
                // Should we do the same as we do for createKey?
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`importing keys with kty '${privateJwk.kty}'`, this.backend);
            }
            if (privateJwk.kty === 'EC' || privateJwk.kty === 'OKP') {
                // Throws error if not supported
                this.assertAskarAlgForJwkCrv(privateJwk.kty, privateJwk.crv);
                key = askar_shared_1.Key.fromJwk({ jwk: askar_shared_1.Jwk.fromJson(privateJwk) });
            }
            const _key = key;
            if (!_key) {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${privateJwk.kty}'`, this.backend);
            }
            await this.withSession(agentContext, (session) => session.insertKey({ name: privateJwk.kid, key: _key }));
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
            // Handle case where key already exists
            if ((0, utils_1.isAskarError)(error, utils_1.AskarErrorCode.Duplicate)) {
                throw new core_1.Kms.KeyManagementKeyExistsError(privateJwk.kid, this.backend);
            }
            throw new core_1.Kms.KeyManagementError('Error importing key', { cause: error });
        }
        finally {
            key?.handle.free();
        }
    }
    async deleteKey(agentContext, options) {
        try {
            await this.withSession(agentContext, (session) => session.removeKey({ name: options.keyId }));
            return true;
        }
        catch (error) {
            // Handle case where key does not exist
            if ((0, utils_1.isAskarError)(error, utils_1.AskarErrorCode.NotFound)) {
                return false;
            }
            throw new core_1.Kms.KeyManagementError(`Error deleting key with id '${options.keyId}'`, { cause: error });
        }
    }
    async createKey(agentContext, options) {
        const { type, keyId } = options;
        // FIXME: we should maybe keep the default keyId as publicKeyBase58 for a while for now, so it doesn't break
        // Or we need a way to query a key based on the public key?
        const kid = keyId ?? core_1.utils.uuid();
        let askarKey = undefined;
        try {
            if (type.kty === 'EC' || type.kty === 'OKP') {
                const keyAlg = this.assertAskarAlgForJwkCrv(type.kty, type.crv);
                askarKey = askar_shared_1.Key.generate(keyAlg);
            }
            else if (type.kty === 'oct') {
                // NOTE: askar is more specific in the intended use of the key at time of generation.
                // We either need to allow for this on a higher level (should be possible using `alg`)
                // but as the keys are the same it's ok to just always pick one and if used for another
                // purpose we can see them as the same.
                if (type.algorithm === 'aes') {
                    const lengthToKeyAlg = {
                        128: askar_shared_1.KeyAlgorithm.AesA128Gcm,
                        256: askar_shared_1.KeyAlgorithm.AesA256Gcm,
                        512: askar_shared_1.KeyAlgorithm.AesA256CbcHs512,
                    };
                    const keyAlg = lengthToKeyAlg[type.length];
                    if (!keyAlg) {
                        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`length '${type.length}' for kty '${type.kty}' with algorithm '${type.algorithm}'. Supported length values are ${Object.keys(lengthToKeyAlg).join(', ')}`, this.backend);
                    }
                    askarKey = askar_shared_1.Key.generate(keyAlg);
                }
                else if (type.algorithm === 'C20P') {
                    // Both X and non-X variant can be used with the same key
                    askarKey = askar_shared_1.Key.generate(askar_shared_1.KeyAlgorithm.Chacha20C20P);
                }
                else {
                    throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`algorithm '${type.algorithm}' for kty '${type.kty}'`, this.backend);
                }
            }
            const _key = askarKey;
            if (!_key) {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty '${type.kty}'`, this.backend);
            }
            const publicJwk = this.publicJwkFromKey(_key, { kid });
            await this.withSession(agentContext, (session) => session.insertKey({ name: kid, key: _key }));
            return {
                publicJwk,
                keyId: kid,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            // Handle case where key already exists
            if ((0, utils_1.isAskarError)(error, utils_1.AskarErrorCode.Duplicate)) {
                throw new core_1.Kms.KeyManagementKeyExistsError(kid, this.backend);
            }
            throw new core_1.Kms.KeyManagementError('Error creating key', { cause: error });
        }
        finally {
            askarKey?.handle.free();
        }
    }
    async sign(agentContext, options) {
        const { keyId, algorithm, data } = options;
        // 1. Retrieve the key
        const key = await this.getKeyAsserted(agentContext, keyId);
        try {
            const sigType = this.assertedSigTypeForAlg(algorithm);
            // Askar has a bug with loading symmetric keys, but we shouldn't get here as I don't think askar
            // support signing with symmetric keys, and we don't support it (it will be caught by assertedSigTypeForAlg)
            if (!key.key) {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`algorithm ${algorithm}`, this.backend);
            }
            // TODO: we should extend this with metadata properties (e.g. use, key_ops)
            const publicJwk = this.publicJwkFromKey(key.key, { kid: keyId });
            const privateJwk = this.privateJwkFromKey(key.key, { kid: keyId });
            // 2. Validate alg and use for key
            core_1.Kms.assertAllowedSigningAlgForKey(privateJwk, algorithm);
            core_1.Kms.assertKeyAllowsSign(publicJwk);
            // 3. Perform the signing operation
            const signature = key.key.signMessage({
                message: data,
                sigType,
            });
            return {
                signature,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error signing with key', { cause: error });
        }
        finally {
            key.key?.handle.free();
        }
    }
    async verify(agentContext, options) {
        const { algorithm, data, signature, key: keyInput } = options;
        // Get askar sig type (and handles unsupported alg)
        const sigType = this.assertedSigTypeForAlg(algorithm);
        // Retrieve the key
        let askarKey = undefined;
        try {
            if (keyInput.keyId) {
                askarKey = (await this.getKeyAsserted(agentContext, keyInput.keyId)).key;
            }
            else if (keyInput.publicJwk?.kty === 'EC' || keyInput.publicJwk?.kty === 'OKP') {
                // Throws error if not supported
                this.assertAskarAlgForJwkCrv(keyInput.publicJwk.kty, keyInput.publicJwk.crv);
                askarKey = askar_shared_1.Key.fromJwk({ jwk: askar_shared_1.Jwk.fromJson(keyInput.publicJwk) });
            }
            else {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty ${keyInput.publicJwk?.kty}`, this.backend);
            }
            // Askar has a bug with loading symmetric keys, but we shouldn't get here as I don't think askar
            // support signing with symmetric keys, and we don't support it (it will be caught by assertedSigTypeForAlg)
            if (!askarKey) {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`algorithm ${algorithm}`, this.backend);
            }
            const keyId = keyInput.keyId ?? keyInput.publicJwk?.kid;
            const publicJwk = this.publicJwkFromKey(askarKey, { kid: keyId });
            // For symmetric verificdation we need the private key
            if (publicJwk.kty === 'oct') {
                const privateJwk = this.privateJwkFromKey(askarKey, { kid: keyId });
                // 2. Validate alg and use for key
                core_1.Kms.assertAllowedSigningAlgForKey(privateJwk, algorithm);
                core_1.Kms.assertKeyAllowsVerify(publicJwk);
            }
            else {
                // 2. Validate alg and use for key
                core_1.Kms.assertAllowedSigningAlgForKey(publicJwk, algorithm);
                core_1.Kms.assertKeyAllowsVerify(publicJwk);
            }
            // 4. Perform the verify operation
            const verified = askarKey.verifySignature({ message: data, signature, sigType });
            if (verified) {
                return {
                    verified: true,
                    publicJwk: keyInput.keyId
                        ? this.publicJwkFromKey(askarKey, { kid: keyId })
                        : keyInput.publicJwk,
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
        finally {
            if (askarKey)
                askarKey.handle.free();
        }
    }
    async encrypt(agentContext, options) {
        const { data, encryption, key } = options;
        core_1.Kms.assertSupportedEncryptionAlgorithm(encryption, askarSupportedEncryptionAlgorithms, this.backend);
        const keysToFree = [];
        try {
            let encryptionKey = undefined;
            let encryptedKey = undefined;
            // TODO: we should check if the key allows this operation
            if (key.keyId) {
                encryptionKey = (await this.getKeyAsserted(agentContext, key.keyId)).key;
                keysToFree.push(encryptionKey);
            }
            else if (key.privateJwk) {
                if (encryption.algorithm === 'XSALSA20-POLY1305') {
                    throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`encryption algorithm '${encryption.algorithm}' is only supported in combination with key agreement algorithm '${core_1.Kms.KnownJwaKeyAgreementAlgorithms.ECDH_HSALSA20}'`, this.backend);
                }
                encryptionKey = this.keyFromSecretBytesAndEncryptionAlgorithm(core_1.TypedArrayEncoder.fromBase64(key.privateJwk.k), encryption.algorithm);
                keysToFree.push(encryptionKey);
            }
            else if (key.keyAgreement) {
                core_1.Kms.assertAllowedKeyDerivationAlgForKey(key.keyAgreement.externalPublicJwk, key.keyAgreement.algorithm);
                core_1.Kms.assertKeyAllowsDerive(key.keyAgreement.externalPublicJwk);
                core_1.Kms.assertSupportedKeyAgreementAlgorithm(key.keyAgreement, deriveKey_1.askarSupportedKeyAgreementAlgorithms, this.backend);
                let privateKey = key.keyAgreement.keyId
                    ? (await this.getKeyAsserted(agentContext, key.keyAgreement.keyId)).key
                    : undefined;
                if (privateKey)
                    keysToFree.push(privateKey);
                const privateJwk = privateKey ? this.privateJwkFromKey(privateKey) : undefined;
                if (privateJwk) {
                    core_1.Kms.assertJwkAsymmetric(privateJwk, key.keyAgreement.keyId);
                    core_1.Kms.assertAllowedKeyDerivationAlgForKey(privateJwk, key.keyAgreement.algorithm);
                    core_1.Kms.assertKeyAllowsDerive(privateJwk);
                    // Special case, for DIDComm v1 we often use an X25519 for the external key
                    // but we use an Ed25519 for our key
                    if (key.keyAgreement.algorithm !== 'ECDH-HSALSA20') {
                        core_1.Kms.assertAsymmetricJwkKeyTypeMatches(privateJwk, key.keyAgreement.externalPublicJwk);
                    }
                }
                const recipientKey = this.keyFromJwk(key.keyAgreement.externalPublicJwk);
                keysToFree.push(recipientKey);
                // Special case to support DIDComm v1
                if (key.keyAgreement.algorithm === 'ECDH-HSALSA20' || encryption.algorithm === 'XSALSA20-POLY1305') {
                    if (encryption.algorithm !== 'XSALSA20-POLY1305' || key.keyAgreement.algorithm !== 'ECDH-HSALSA20') {
                        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`key agreement algorithm '${key.keyAgreement.algorithm}' with encryption algorithm '${encryption.algorithm}'`, this.backend);
                    }
                    // anonymous encryption
                    if (!privateKey) {
                        return {
                            encrypted: askar_shared_1.CryptoBox.seal({
                                recipientKey,
                                message: data,
                            }),
                        };
                    }
                    // Special case. For DIDComm v1 we basically use the Ed25519 key also
                    // for X25519 operations.
                    if (privateKey.algorithm === askar_shared_1.KeyAlgorithm.Ed25519) {
                        privateKey = privateKey.convertkey({ algorithm: askar_shared_1.KeyAlgorithm.X25519 });
                        keysToFree.push(privateKey);
                    }
                    const nonce = askar_shared_1.CryptoBox.randomNonce();
                    const encrypted = askar_shared_1.CryptoBox.cryptoBox({
                        recipientKey,
                        senderKey: privateKey,
                        message: data,
                        nonce,
                    });
                    return {
                        encrypted,
                        iv: nonce,
                    };
                }
                // This should not happen, but for TS
                if (!privateKey) {
                    throw new core_1.Kms.KeyManagementError('sender key is required for ECDH-ES key derivation.');
                }
                const { contentEncryptionKey, encryptedContentEncryptionKey } = (0, deriveKey_1.deriveEncryptionKey)({
                    encryption,
                    keyAgreement: key.keyAgreement,
                    recipientKey,
                    senderKey: privateKey,
                });
                encryptionKey = contentEncryptionKey;
                keysToFree.push(contentEncryptionKey);
                encryptedKey = encryptedContentEncryptionKey;
            }
            else {
                throw new core_1.Kms.KeyManagementError('Unexpected key parameter for encrypt');
            }
            if (encryption.algorithm === 'XSALSA20-POLY1305') {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`encryption algorithm '${encryption.algorithm}' can only be used with key agreement algorithm ECDH-HSALSA20`, this.backend);
            }
            const privateJwk = this.privateJwkFromKey(encryptionKey);
            core_1.Kms.assertKeyAllowsDerive(privateJwk);
            core_1.Kms.assertAllowedEncryptionAlgForKey(privateJwk, encryption.algorithm);
            core_1.Kms.assertKeyAllowsEncrypt(privateJwk);
            const encrypted = (0, encrypt_1.aeadEncrypt)({
                key: encryptionKey,
                data,
                encryption,
            });
            return {
                ...encrypted,
                encryptedKey,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error encrypting with key', { cause: error });
        }
        finally {
            // Clear all keys
            for (const key of keysToFree) {
                key.handle.free();
            }
        }
    }
    async decrypt(agentContext, options) {
        const { encrypted, decryption, key } = options;
        core_1.Kms.assertSupportedEncryptionAlgorithm(decryption, askarSupportedEncryptionAlgorithms, this.backend);
        const keysToFree = [];
        try {
            let decryptionKey = undefined;
            if (key.keyId) {
                decryptionKey = (await this.getKeyAsserted(agentContext, key.keyId)).key;
                keysToFree.push(decryptionKey);
            }
            else if (key.privateJwk) {
                if (decryption.algorithm === 'XSALSA20-POLY1305') {
                    throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`decryption algorithm '${decryption.algorithm}' is only supported in combination with key agreement algorithm '${core_1.Kms.KnownJwaKeyAgreementAlgorithms.ECDH_HSALSA20}'`, this.backend);
                }
                decryptionKey = this.keyFromSecretBytesAndEncryptionAlgorithm(core_1.TypedArrayEncoder.fromBase64(key.privateJwk.k), decryption.algorithm);
                keysToFree.push(decryptionKey);
            }
            else if (key.keyAgreement) {
                if (key.keyAgreement.externalPublicJwk) {
                    core_1.Kms.assertAllowedKeyDerivationAlgForKey(key.keyAgreement.externalPublicJwk, key.keyAgreement.algorithm);
                    core_1.Kms.assertKeyAllowsDerive(key.keyAgreement.externalPublicJwk);
                }
                core_1.Kms.assertSupportedKeyAgreementAlgorithm(key.keyAgreement, deriveKey_1.askarSupportedKeyAgreementAlgorithms, this.backend);
                let privateKey = (await this.getKeyAsserted(agentContext, key.keyAgreement.keyId)).key;
                keysToFree.push(privateKey);
                const privateJwk = this.privateJwkFromKey(privateKey);
                core_1.Kms.assertJwkAsymmetric(privateJwk, key.keyAgreement.keyId);
                core_1.Kms.assertAllowedKeyDerivationAlgForKey(privateJwk, key.keyAgreement.algorithm);
                core_1.Kms.assertKeyAllowsDerive(privateJwk);
                // Special case for ECDH-HSALSA as we can have mismatch between keys because of DIDComm v1
                if (key.keyAgreement.externalPublicJwk && key.keyAgreement.algorithm !== 'ECDH-HSALSA20') {
                    core_1.Kms.assertAsymmetricJwkKeyTypeMatches(privateJwk, key.keyAgreement.externalPublicJwk);
                }
                const senderKey = key.keyAgreement.externalPublicJwk
                    ? this.keyFromJwk(key.keyAgreement.externalPublicJwk)
                    : undefined;
                if (senderKey)
                    keysToFree.push(senderKey);
                // Special case to support DIDComm v1
                if (key.keyAgreement.algorithm === 'ECDH-HSALSA20' || decryption.algorithm === 'XSALSA20-POLY1305') {
                    if (decryption.algorithm !== 'XSALSA20-POLY1305' || key.keyAgreement.algorithm !== 'ECDH-HSALSA20') {
                        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`key agreement algorithm '${key.keyAgreement.algorithm}' with encryption algorithm '${decryption.algorithm}'`, this.backend);
                    }
                    // Special case. For DIDComm v1 we basically use the Ed25519 key also
                    // for X25519 operations.
                    if (privateKey.algorithm === askar_shared_1.KeyAlgorithm.Ed25519) {
                        privateKey = privateKey.convertkey({ algorithm: askar_shared_1.KeyAlgorithm.X25519 });
                        keysToFree.push(privateKey);
                    }
                    if (!senderKey) {
                        // anonymous encryption
                        return {
                            data: askar_shared_1.CryptoBox.sealOpen({
                                recipientKey: privateKey,
                                ciphertext: encrypted,
                            }),
                        };
                    }
                    if (!decryption.iv) {
                        throw new core_1.Kms.KeyManagementError(`Missing required 'iv' for key agreement algorithm ${key.keyAgreement.algorithm} and encryption algorithm ${decryption.algorithm} with sender key defined.`);
                    }
                    const decrypted = askar_shared_1.CryptoBox.open({
                        recipientKey: privateKey,
                        senderKey: senderKey,
                        message: encrypted,
                        nonce: decryption.iv,
                    });
                    return {
                        data: decrypted,
                    };
                }
                // This should not happen, but for TS
                if (!senderKey) {
                    throw new core_1.Kms.KeyManagementError('sender key is required for ECDH-ES key derivation.');
                }
                const { contentEncryptionKey } = (0, deriveKey_1.deriveDecryptionKey)({
                    decryption,
                    keyAgreement: key.keyAgreement,
                    recipientKey: privateKey,
                    senderKey,
                });
                decryptionKey = contentEncryptionKey;
                keysToFree.push(contentEncryptionKey);
            }
            else {
                throw new core_1.Kms.KeyManagementError('Unexpected key parameter for decrypt');
            }
            if (decryption.algorithm === 'XSALSA20-POLY1305') {
                throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`encryption algorithm '${decryption.algorithm}' can only be used with key agreement algorithm ECDH-HSALSA20`, this.backend);
            }
            const privateJwk = this.privateJwkFromKey(decryptionKey);
            core_1.Kms.assertKeyAllowsDerive(privateJwk);
            core_1.Kms.assertAllowedEncryptionAlgForKey(privateJwk, decryption.algorithm);
            core_1.Kms.assertKeyAllowsEncrypt(privateJwk);
            const decrypted = (0, decrypt_1.aeadDecrypt)({
                key: decryptionKey,
                encrypted,
                decryption,
            });
            return {
                data: decrypted,
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            throw new core_1.Kms.KeyManagementError('Error decrypting with key', { cause: error });
        }
        finally {
            // Clear all keys
            for (const key of keysToFree) {
                key.handle.free();
            }
        }
    }
    assertedSigTypeForAlg(algorithm) {
        const sigType = AskarKeyManagementService.algToSigType[algorithm];
        if (!sigType) {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`signing and verification with algorithm '${algorithm}'`, this.backend);
        }
        return sigType;
    }
    assertAskarAlgForJwkCrv(kty, crv) {
        const keyAlg = utils_1.jwkCrvToAskarAlg[crv];
        if (!keyAlg) {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`crv '${crv}' for kty '${kty}'`, this.backend);
        }
        return keyAlg;
    }
    keyFromJwk(jwk) {
        const key = new askar_shared_1.Key(askar_shared_1.askar.keyFromJwk({
            // TODO: the JWK class in JS Askar wrapper is too limiting
            // so we use this method directly. should update it
            jwk: core_1.JsonEncoder.toBuffer(jwk),
        }));
        return key;
    }
    keyFromSecretBytesAndEncryptionAlgorithm(secretBytes, algorithm) {
        const askarEncryptionAlgorithm = utils_1.jwkEncToAskarAlg[algorithm];
        if (!askarEncryptionAlgorithm) {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`JWA encryption algorithm '${algorithm}'`, 'askar');
        }
        return askar_shared_1.Key.fromSecretBytes({
            algorithm: askarEncryptionAlgorithm,
            secretKey: secretBytes,
        });
    }
    publicJwkFromKey(key, partialJwkPublic) {
        return core_1.Kms.publicJwkFromPrivateJwk(this.privateJwkFromKey(key, partialJwkPublic));
    }
    privateJwkFromKey(key, partialJwkPrivate) {
        // TODO: once we support additional params we should add these here
        // TODO: the JWK class in JS Askar wrapper is too limiting
        // so we use this method directly. should update it
        // We extract alg, as Askar doesn't always use the same algs
        const { alg, ...jwkSecret } = core_1.JsonEncoder.fromBuffer(askar_shared_1.askar.keyGetJwkSecret({
            localKeyHandle: key.handle,
        }));
        return {
            ...partialJwkPrivate,
            ...jwkSecret,
        };
    }
    async fetchAskarKey(agentContext, keyId) {
        return await this.withSession(agentContext, async (session) => {
            if (!session.handle)
                throw Error('Cannot fetch a key with a closed session');
            // Fetch the key from the session
            const handle = await askar_shared_1.askar.sessionFetchKey({ forUpdate: false, name: keyId, sessionHandle: session.handle });
            if (!handle)
                return null;
            // Get the key entry
            const keyEntryList = new askar_shared_1.KeyEntryList({ handle });
            const keyEntry = keyEntryList.getEntryByIndex(0);
            const keyEntryObject = keyEntry.toJson();
            keyEntryList.handle.free();
            return keyEntryObject;
        });
    }
    async getKeyAsserted(agentContext, keyId) {
        const storageKey = await this.fetchAskarKey(agentContext, keyId);
        if (!storageKey) {
            throw new core_1.Kms.KeyManagementKeyNotFoundError(keyId, this.backend);
        }
        return storageKey;
    }
}
exports.AskarKeyManagementService = AskarKeyManagementService;
AskarKeyManagementService.backend = 'askar';
AskarKeyManagementService.algToSigType = {
    EdDSA: askar_shared_1.SignatureAlgorithm.EdDSA,
    ES256K: askar_shared_1.SignatureAlgorithm.ES256K,
    ES256: askar_shared_1.SignatureAlgorithm.ES256,
    ES384: askar_shared_1.SignatureAlgorithm.ES384,
};
//# sourceMappingURL=AskarKeyManagementService.js.map