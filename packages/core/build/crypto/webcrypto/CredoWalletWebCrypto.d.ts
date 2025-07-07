import type { AgentContext } from '../../agent';
import { type JsonWebKey, type KeyFormat, type KeyGenAlgorithm, type KeyImportParams, type KeySignParams, type KeyUsage, type KeyVerifyParams } from './types';
import { CredoWebCryptoKey } from './CredoWebCryptoKey';
export declare class CredoWalletWebCrypto {
    private agentContext;
    private kms;
    constructor(agentContext: AgentContext);
    generateRandomValues<T extends ArrayBufferView | null>(array: T): T;
    sign(key: CredoWebCryptoKey, message: Uint8Array, algorithm: KeySignParams): Promise<Uint8Array>;
    verify(key: CredoWebCryptoKey, algorithm: KeyVerifyParams, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
    generate(algorithm: KeyGenAlgorithm): Promise<import("../../modules/kms").KmsCreateKeyReturn<{
        kty: "OKP";
        crv: "Ed25519";
        modulusLength?: undefined;
    } | {
        kty: "OKP";
        crv: "X25519";
        modulusLength?: undefined;
    } | {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521";
        modulusLength?: undefined;
    } | {
        kty: "EC";
        crv: "secp256k1";
        modulusLength?: undefined;
    } | {
        kty: "RSA";
        modulusLength: 4096 | 3072 | 2048;
        crv?: undefined;
    }>>;
    importKey(format: KeyFormat, keyData: Uint8Array | JsonWebKey, algorithm: KeyImportParams, extractable: boolean, keyUsages: Array<KeyUsage>): Promise<CredoWebCryptoKey>;
    exportKey(format: KeyFormat, key: CredoWebCryptoKey): Promise<Uint8Array | JsonWebKey>;
}
