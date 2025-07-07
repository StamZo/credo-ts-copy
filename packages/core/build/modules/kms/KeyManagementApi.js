"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementApi = void 0;
const tsyringe_1 = require("tsyringe");
const agent_1 = require("../../agent");
const zod_1 = require("../../utils/zod");
const KeyManagementModuleConfig_1 = require("./KeyManagementModuleConfig");
const KeyManagementError_1 = require("./error/KeyManagementError");
const KeyManagementKeyNotFoundError_1 = require("./error/KeyManagementKeyNotFoundError");
const jwk_1 = require("./jwk");
const signing_1 = require("./jwk/alg/signing");
const options_1 = require("./options");
const KmsCreateKeyOptions_1 = require("./options/KmsCreateKeyOptions");
const KmsDecryptOptions_1 = require("./options/KmsDecryptOptions");
const KmsDeleteKeyOptions_1 = require("./options/KmsDeleteKeyOptions");
const KmsEncryptOptions_1 = require("./options/KmsEncryptOptions");
const KmsGetPublicKeyOptions_1 = require("./options/KmsGetPublicKeyOptions");
const KmsImportKeyOptions_1 = require("./options/KmsImportKeyOptions");
const KmsRandomBytesOptions_1 = require("./options/KmsRandomBytesOptions");
const KmsSignOptions_1 = require("./options/KmsSignOptions");
const KmsVerifyOptions_1 = require("./options/KmsVerifyOptions");
const backend_1 = require("./options/backend");
let KeyManagementApi = class KeyManagementApi {
    constructor(keyManagementConfig, agentContext) {
        this.keyManagementConfig = keyManagementConfig;
        this.agentContext = agentContext;
    }
    /**
     * Whether an operation is supported.
     *
     * @returns a list of backends that support the operation. In case
     * no backends are supported it returns an empty array
     */
    supportedBackendsForOperation(operation) {
        const supportedBackends = [];
        for (const kms of this.keyManagementConfig.backends) {
            const isOperationSupported = kms.isOperationSupported(this.agentContext, operation);
            if (isOperationSupported) {
                supportedBackends.push(kms.backend);
            }
        }
        return supportedBackends;
    }
    /**
     * Create a key.
     */
    async createKey(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsCreateKeyOptions_1.zKmsCreateKeyOptions), options, 'Invalid options provided to createKey method');
        const kms = this.getKms(this.agentContext, backend, {
            operation: 'createKey',
            type: options.type,
        });
        const key = await kms.createKey(this.agentContext, kmsOptions);
        key.publicJwk.kid = key.keyId;
        this.agentContext.config.logger.debug(`Created key ${(0, jwk_1.getJwkHumanDescription)(key.publicJwk)} with key id '${key.keyId}'`);
        return key;
    }
    /**
     * Create a key.
     */
    async createKeyForSignatureAlgorithm(options) {
        const { backend, algorithm, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsCreateKeyOptions_1.zKmsCreateKeyForSignatureAlgorithmOptions), options, 'Invalid options provided to createKeyForSignatureAlgorithm method');
        const type = (0, signing_1.createKeyTypeForSigningAlgorithm)(options.algorithm);
        const kms = this.getKms(this.agentContext, backend, {
            operation: 'createKey',
            type,
        });
        // Ensure the kid is set to the keyId
        const key = await kms.createKey(this.agentContext, {
            ...kmsOptions,
            type,
        });
        key.publicJwk.kid = key.keyId;
        return key;
    }
    /**
     * Sign using a key.
     */
    async sign(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsSignOptions_1.zKmsSignOptions), options, 'Invalid options provided to sign method');
        const operation = {
            operation: 'sign',
            algorithm: options.algorithm,
        };
        const kms = backend
            ? this.getKms(this.agentContext, backend, operation)
            : (await this.getKmsForOperationAndKeyId(this.agentContext, options.keyId, operation)).kms;
        return await kms.sign(this.agentContext, kmsOptions);
    }
    /**
     * Verify using a key.
     */
    async verify(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsVerifyOptions_1.zKmsVerifyOptions), options, 'Invalid options provided to verify method');
        const operation = { operation: 'verify', algorithm: options.algorithm };
        const kms = backend || typeof options.key !== 'string'
            ? this.getKms(this.agentContext, backend, operation)
            : (await this.getKmsForOperationAndKeyId(this.agentContext, options.key, operation)).kms;
        return await kms.verify(this.agentContext, kmsOptions);
    }
    /**
     * Encrypt.
     */
    async encrypt(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsEncryptOptions_1.zKmsEncryptOptions), options, 'Invalid options provided to encrypt method');
        const operation = {
            operation: 'encrypt',
            encryption: options.encryption,
            keyAgreement: options.key.keyAgreement,
        };
        const kms = backend || typeof options.key !== 'string'
            ? this.getKms(this.agentContext, backend, operation)
            : (await this.getKmsForOperationAndKeyId(this.agentContext, options.key, operation)).kms;
        return await kms.encrypt(this.agentContext, kmsOptions);
    }
    /**
     * Decrypt.
     */
    async decrypt(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsDecryptOptions_1.zKmsDecryptOptions), options, 'Invalid options provided to decrypt method');
        const operation = {
            operation: 'decrypt',
            decryption: options.decryption,
            keyAgreement: options.key.keyAgreement,
        };
        const kms = backend || typeof options.key !== 'string'
            ? this.getKms(this.agentContext, backend, operation)
            : (await this.getKmsForOperationAndKeyId(this.agentContext, options.key, operation)).kms;
        return await kms.decrypt(this.agentContext, kmsOptions);
    }
    /**
     * Import a key.
     */
    async importKey(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsImportKeyOptions_1.zKmsImportKeyOptions), options, 'Invalid options provided to importKey method');
        const operation = {
            operation: 'importKey',
            privateJwk: options.privateJwk,
        };
        const kms = this.getKms(this.agentContext, backend, operation);
        const key = await kms.importKey(this.agentContext, kmsOptions);
        this.agentContext.config.logger.trace(`Imported key ${(0, jwk_1.getJwkHumanDescription)(key.publicJwk)} with key id '${key.keyId}'`);
        return key;
    }
    /**
     * Get a public key.
     */
    async getPublicKey(options) {
        const { backend, keyId } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsGetPublicKeyOptions_1.zKmsGetPublicKeyOptions), options, 'Invalid options provided to getPublicKey method');
        if (backend) {
            const kms = this.getKms(this.agentContext, backend);
            const publicKey = await kms.getPublicKey(this.agentContext, keyId);
            if (!publicKey) {
                throw new KeyManagementKeyNotFoundError_1.KeyManagementKeyNotFoundError(keyId, backend);
            }
        }
        const { publicKey } = await this.getKmsForOperationAndKeyId(this.agentContext, options.keyId);
        return publicKey;
    }
    /**
     * Delete a key.
     */
    async deleteKey(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsDeleteKeyOptions_1.zKmsDeleteKeyOptions), options, 'Invalid options provided to deleteKey method');
        const operation = {
            operation: 'deleteKey',
        };
        const kms = this.getKms(this.agentContext, backend, operation);
        return await kms.deleteKey(this.agentContext, kmsOptions);
    }
    /**
     * Generate random bytes
     */
    randomBytes(options) {
        const { backend, ...kmsOptions } = (0, zod_1.parseWithErrorHandling)((0, backend_1.zWithBackend)(KmsRandomBytesOptions_1.zKmsRandomBytesOptions), options, 'Invalid options provided to randomBytes method');
        const operation = {
            operation: 'randomBytes',
        };
        const kms = this.getKms(this.agentContext, backend, operation);
        return kms.randomBytes(this.agentContext, kmsOptions);
    }
    /**
     * Get the kms associated with a specific `keyId`.
     *
     * This uses a naive approach of fetching the key for each configured kms
     * until it finds the registered key.
     *
     * In the future this approach might be optimized based on:
     * - caching
     * - keeping a registry
     * - backend specific key prefixes
     */
    async getKmsForOperationAndKeyId(agentContext, keyId, operation) {
        for (const kms of this.keyManagementConfig.backends) {
            const isOperationSupported = operation ? kms.isOperationSupported(agentContext, operation) : true;
            if (!isOperationSupported)
                continue;
            const publicKey = await kms.getPublicKey(this.agentContext, keyId);
            if (publicKey)
                return {
                    publicKey,
                    kms,
                };
        }
        if (operation) {
            throw new KeyManagementError_1.KeyManagementError(`No key management service supports ${(0, options_1.getKmsOperationHumanDescription)(operation)} that has a key with keyId '${keyId}'`);
        }
        throw new KeyManagementError_1.KeyManagementError(`No key management service has a key with keyId '${keyId}'`);
    }
    /**
     * Get the kms backend for a specific operation.
     *
     * If a backend is provided, it will be checked if the backend supports
     * the operation. Otherwise the first backend that supports the operation
     * will be used.
     */
    getKms(agentContext, backend, operation) {
        if (backend) {
            const kms = this.keyManagementConfig.backends.find((kms) => kms.backend === backend);
            if (!kms) {
                const availableBackends = this.keyManagementConfig.backends.map((kms) => `'${kms.backend}'`);
                throw new KeyManagementError_1.KeyManagementError(`No key management service is configured for backend '${backend}'. Available backends are ${availableBackends.join(', ')}`);
            }
            const isOperationSupported = operation ? kms.isOperationSupported(agentContext, operation) : true;
            if (!isOperationSupported && operation) {
                throw new KeyManagementError_1.KeyManagementError(`Key management service backend '${backend}' does not support ${(0, options_1.getKmsOperationHumanDescription)(operation)}`);
            }
            return kms;
        }
        for (const kms of this.keyManagementConfig.backends) {
            const isOperationSupported = operation ? kms.isOperationSupported(agentContext, operation) : true;
            if (isOperationSupported)
                return kms;
        }
        if (operation) {
            throw new KeyManagementError_1.KeyManagementError(`No key management service backend found that supports ${(0, options_1.getKmsOperationHumanDescription)(operation)}`);
        }
        throw new KeyManagementError_1.KeyManagementError('No key management service backend found.');
    }
};
exports.KeyManagementApi = KeyManagementApi;
exports.KeyManagementApi = KeyManagementApi = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [KeyManagementModuleConfig_1.KeyManagementModuleConfig,
        agent_1.AgentContext])
], KeyManagementApi);
//# sourceMappingURL=KeyManagementApi.js.map