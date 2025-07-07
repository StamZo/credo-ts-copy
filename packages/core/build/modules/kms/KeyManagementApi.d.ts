import { AgentContext } from '../../agent';
import { KeyManagementModuleConfig } from './KeyManagementModuleConfig';
import { KmsJwkPrivate } from './jwk';
import { KmsDecryptOptions, KmsDeleteKeyOptions, KmsGetPublicKeyOptions, KmsImportKeyOptions, KmsOperation, KmsRandomBytesOptions } from './options';
import { KmsCreateKeyForSignatureAlgorithmOptions, KmsCreateKeyOptions, KmsCreateKeyReturn, KmsCreateKeyType, KmsCreateKeyTypeAssymetric } from './options/KmsCreateKeyOptions';
import { KmsEncryptOptions } from './options/KmsEncryptOptions';
import { KmsImportKeyReturn } from './options/KmsImportKeyOptions';
import { KmsSignOptions } from './options/KmsSignOptions';
import { KmsVerifyOptions } from './options/KmsVerifyOptions';
import { WithBackend } from './options/backend';
export declare class KeyManagementApi {
    private keyManagementConfig;
    private agentContext;
    constructor(keyManagementConfig: KeyManagementModuleConfig, agentContext: AgentContext);
    /**
     * Whether an operation is supported.
     *
     * @returns a list of backends that support the operation. In case
     * no backends are supported it returns an empty array
     */
    supportedBackendsForOperation(operation: KmsOperation): string[];
    /**
     * Create a key.
     */
    createKey<Type extends KmsCreateKeyType>(options: WithBackend<KmsCreateKeyOptions<Type>>): Promise<KmsCreateKeyReturn<Type>>;
    /**
     * Create a key.
     */
    createKeyForSignatureAlgorithm(options: WithBackend<KmsCreateKeyForSignatureAlgorithmOptions>): Promise<KmsCreateKeyReturn<KmsCreateKeyTypeAssymetric>>;
    /**
     * Sign using a key.
     */
    sign(options: WithBackend<KmsSignOptions>): Promise<import("./options").KmsSignReturn>;
    /**
     * Verify using a key.
     */
    verify(options: WithBackend<KmsVerifyOptions>): Promise<import("./options").KmsVerifyReturn>;
    /**
     * Encrypt.
     */
    encrypt(options: WithBackend<KmsEncryptOptions>): Promise<import("./options").KmsEncryptReturn>;
    /**
     * Decrypt.
     */
    decrypt(options: WithBackend<KmsDecryptOptions>): Promise<import("./options").KmsDecryptReturn>;
    /**
     * Import a key.
     */
    importKey<Jwk extends KmsJwkPrivate>(options: WithBackend<KmsImportKeyOptions<Jwk>>): Promise<KmsImportKeyReturn<Jwk>>;
    /**
     * Get a public key.
     */
    getPublicKey(options: WithBackend<KmsGetPublicKeyOptions>): Promise<{
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        d?: string | undefined;
    } | {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        y: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        d?: undefined;
    } | {
        kty: "RSA";
        n: string;
        e: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        d?: undefined;
        p?: undefined;
        q?: undefined;
        dp?: undefined;
        dq?: undefined;
        qi?: undefined;
        oth?: undefined;
    } | {
        kty: "oct";
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        k?: undefined;
    }>;
    /**
     * Delete a key.
     */
    deleteKey(options: WithBackend<KmsDeleteKeyOptions>): Promise<boolean>;
    /**
     * Generate random bytes
     */
    randomBytes(options: WithBackend<KmsRandomBytesOptions>): import("./options").KmsRandomBytesReturn;
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
    private getKmsForOperationAndKeyId;
    /**
     * Get the kms backend for a specific operation.
     *
     * If a backend is provided, it will be checked if the backend supports
     * the operation. Otherwise the first backend that supports the operation
     * will be used.
     */
    private getKms;
}
