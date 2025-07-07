"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askarSupportedKeyAgreementAlgorithms = void 0;
exports.deriveEncryptionKey = deriveEncryptionKey;
exports.deriveDecryptionKey = deriveDecryptionKey;
const core_1 = require("@credo-ts/core");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const utils_1 = require("../../utils");
exports.askarSupportedKeyAgreementAlgorithms = [
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A256KW',
    'ECDH-HSALSA20',
];
function deriveEncryptionKey(options) {
    const { keyAgreement, encryption, senderKey, recipientKey } = options;
    const askarEncryptionAlgorithm = utils_1.jwkEncToAskarAlg[encryption.algorithm];
    if (!askarEncryptionAlgorithm) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`encryption with algorithm '${encryption.algorithm}'`, 'askar');
    }
    // This should be handled on a higher level as we only support combined key agreemnt + encryption
    if (keyAgreement.algorithm === 'ECDH-HSALSA20') {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`derive key for algorithm '${keyAgreement.algorithm}' with encryption algorithm '${encryption.algorithm}'`, 'askar');
    }
    const askarKeyWrappingAlgorithm = keyAgreement.algorithm !== 'ECDH-ES'
        ? utils_1.jwkEncToAskarAlg[keyAgreement.algorithm.replace('ECDH-ES+', '')]
        : undefined;
    const derivedKey = new askar_shared_1.Key(askar_shared_1.askar.keyDeriveEcdhEs({
        algId: core_1.TypedArrayEncoder.fromString(keyAgreement.algorithm === 'ECDH-ES' ? encryption.algorithm : keyAgreement.algorithm),
        receive: false,
        apv: keyAgreement.apv ?? new Uint8Array([]),
        apu: keyAgreement.apu ?? new Uint8Array([]),
        algorithm: askarKeyWrappingAlgorithm ?? askarEncryptionAlgorithm,
        ephemeralKey: senderKey,
        recipientKey: recipientKey,
    }));
    let contentEncryptionKey = undefined;
    let encryptedContentEncryptionKey;
    try {
        // Key wrapping
        if (keyAgreement.algorithm !== 'ECDH-ES') {
            contentEncryptionKey = askar_shared_1.Key.generate(askarEncryptionAlgorithm);
            const wrappedKey = derivedKey.wrapKey({
                other: contentEncryptionKey,
            });
            encryptedContentEncryptionKey = {
                encrypted: wrappedKey.ciphertext,
                iv: wrappedKey.nonce,
                tag: wrappedKey.tag,
            };
        }
        return {
            contentEncryptionKey: contentEncryptionKey ?? derivedKey,
            encryptedContentEncryptionKey,
        };
    }
    catch (error) {
        if (contentEncryptionKey) {
            contentEncryptionKey.handle.free();
        }
        // We only free the derived key if there is no content encryption key
        // as in this case the derived key is already freed in the finally clause
        else {
            derivedKey.handle.free();
        }
        throw error;
    }
    finally {
        // If there is a content encryption key, it means we can free the
        // derived key
        if (contentEncryptionKey) {
            derivedKey.handle.free();
        }
    }
}
function deriveDecryptionKey(options) {
    const { keyAgreement, decryption, senderKey, recipientKey } = options;
    const askarEncryptionAlgorithm = utils_1.jwkEncToAskarAlg[decryption.algorithm];
    if (!askarEncryptionAlgorithm) {
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`decryption with algorithm '${decryption.algorithm}'`, 'askar');
    }
    if (keyAgreement.algorithm === 'ECDH-HSALSA20') {
        // This should be handled on a higher level as we only support combined key agreemnt + encryption
        throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`derive key for algorithm '${keyAgreement.algorithm}' with encryption algorithm '${decryption.algorithm}'`, 'askar');
    }
    const askarKeyWrappingAlgorithm = keyAgreement.algorithm !== 'ECDH-ES'
        ? utils_1.jwkEncToAskarAlg[keyAgreement.algorithm.replace('ECDH-ES+', '')]
        : undefined;
    const derivedKey = new askar_shared_1.Key(askar_shared_1.askar.keyDeriveEcdhEs({
        algId: core_1.TypedArrayEncoder.fromString(keyAgreement.algorithm === 'ECDH-ES' ? decryption.algorithm : keyAgreement.algorithm),
        receive: true,
        apv: keyAgreement.apv ?? new Uint8Array(),
        apu: keyAgreement.apu ?? new Uint8Array(),
        algorithm: askarKeyWrappingAlgorithm ?? askarEncryptionAlgorithm,
        ephemeralKey: senderKey,
        recipientKey: recipientKey,
    }));
    let contentEncryptionKey = undefined;
    try {
        // Key unwrapping
        if (keyAgreement.algorithm !== 'ECDH-ES') {
            contentEncryptionKey = derivedKey.unwrapKey({
                ciphertext: keyAgreement.encryptedKey.encrypted,
                algorithm: askarEncryptionAlgorithm,
                nonce: keyAgreement.encryptedKey.iv,
                tag: keyAgreement.encryptedKey.tag,
            });
        }
        return {
            contentEncryptionKey: contentEncryptionKey ?? derivedKey,
        };
    }
    catch (error) {
        if (contentEncryptionKey) {
            contentEncryptionKey.handle.free();
        }
        else {
            derivedKey.handle.free();
        }
        throw error;
    }
    finally {
        if (contentEncryptionKey) {
            derivedKey.handle.free();
        }
    }
}
//# sourceMappingURL=deriveKey.js.map