"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureEnvironmentKeyManagementService = void 0;
const core_1 = require("@credo-ts/core");
const secureEnvironment_1 = require("./secureEnvironment");
class SecureEnvironmentKeyManagementService {
    constructor() {
        this.backend = 'secureEnvironment';
        this.secureEnvironment = (0, secureEnvironment_1.importSecureEnvironment)();
    }
    isOperationSupported(_agentContext, operation) {
        if (operation.operation === 'createKey') {
            return operation.type.kty === 'EC' && operation.type.crv === 'P-256';
        }
        if (operation.operation === 'sign') {
            return operation.algorithm === 'ES256';
        }
        if (operation.operation === 'deleteKey') {
            return true;
        }
        return false;
    }
    randomBytes(_agentContext, _options) {
        throw new core_1.Kms.KeyManagementError(`Generating random bytes is not supported for backend '${this.backend}'`);
    }
    async getPublicKey(_agentContext, keyId) {
        try {
            return await this.getKeyAsserted(keyId);
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementKeyNotFoundError)
                return null;
            throw error;
        }
    }
    async importKey() {
        throw new core_1.Kms.KeyManagementError(`Importing a key is not supported for backend '${this.backend}'`);
    }
    async deleteKey(_agentContext, options) {
        try {
            await this.secureEnvironment.deleteKey(options.keyId);
            return true;
        }
        catch (error) {
            if (error instanceof this.secureEnvironment.KeyNotFoundError) {
                return false;
            }
            throw new core_1.Kms.KeyManagementError(`Error deleting key with id '${options.keyId}' in backend '${this.backend}'`, {
                cause: error,
            });
        }
    }
    async encrypt() {
        throw new core_1.Kms.KeyManagementError(`Encryption is not supported for backend '${this.backend}'`);
    }
    async decrypt() {
        throw new core_1.Kms.KeyManagementError(`Decryption is not supported for backend '${this.backend}'`);
    }
    async createKey(_agentContext, options) {
        if (options.type.kty !== 'EC') {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty ${options.type.kty}. Only EC P-256 supported.`, this.backend);
        }
        if (options.type.crv !== 'P-256') {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`kty ${options.type.kty} with crv ${options.type.crv}. Only EC P-256 supported.`, this.backend);
        }
        const keyId = options.keyId ?? core_1.utils.uuid();
        try {
            await this.secureEnvironment.generateKeypair(keyId);
            return {
                keyId,
                publicJwk: await this.getKeyAsserted(keyId),
            };
        }
        catch (error) {
            if (error instanceof core_1.Kms.KeyManagementError)
                throw error;
            if (error instanceof this.secureEnvironment.KeyAlreadyExistsError) {
                throw new core_1.Kms.KeyManagementKeyExistsError(keyId, this.backend);
            }
            throw new core_1.Kms.KeyManagementError('Error creating key', { cause: error });
        }
    }
    async sign(_agentContext, options) {
        if (options.algorithm !== 'ES256') {
            throw new core_1.Kms.KeyManagementAlgorithmNotSupportedError(`algorithm '${options.algorithm}'. Only 'ES256' supported.`, this.backend);
        }
        try {
            // TODO: can we store something like 'use' for the key in secure environment?
            // Kms.assertKeyAllowsSign(publicJwk)
            // Perform the signing operation
            const signature = await this.secureEnvironment.sign(options.keyId, options.data);
            return {
                signature,
            };
        }
        catch (error) {
            if (error instanceof this.secureEnvironment.KeyNotFoundError) {
                throw new core_1.Kms.KeyManagementKeyNotFoundError(options.keyId, this.backend);
            }
            throw new core_1.Kms.KeyManagementError('Error signing with key', { cause: error });
        }
    }
    async verify() {
        throw new core_1.Kms.KeyManagementError(`verification of signatures is not supported for backend '${this.backend}'`);
    }
    publicJwkFromPublicKeyBytes(key, keyId) {
        const publicJwk = core_1.Kms.PublicJwk.fromPublicKey({
            kty: 'EC',
            crv: 'P-256',
            publicKey: key,
        }).toJson();
        return {
            ...publicJwk,
            kid: keyId,
        };
    }
    async getKeyAsserted(keyId) {
        try {
            const publicKeyBytes = await this.secureEnvironment.getPublicBytesForKeyId(keyId);
            return this.publicJwkFromPublicKeyBytes(publicKeyBytes, keyId);
        }
        catch (error) {
            if (error instanceof this.secureEnvironment.KeyNotFoundError) {
                throw new core_1.Kms.KeyManagementKeyNotFoundError(keyId, this.backend);
            }
            throw new core_1.Kms.KeyManagementError(`Error retrieving key with id '${keyId}' from backend ${this.backend}`, {
                cause: error,
            });
        }
    }
}
exports.SecureEnvironmentKeyManagementService = SecureEnvironmentKeyManagementService;
//# sourceMappingURL=SecureEnvironmentKeyManagementService.js.map