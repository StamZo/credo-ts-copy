import { Jwk, KnownJwaSignatureAlgorithm } from '../../modules/kms';
import type { CredoWebCryptoKey } from './CredoWebCryptoKey';
export type CredoWebCryptoKeyPair = {
    publicKey: CredoWebCryptoKey;
    privateKey: CredoWebCryptoKey;
};
type HashAlgorithmIdentifier = 'SHA-256' | 'SHA-384' | 'SHA-512';
export type EcdsaParams = {
    name: 'ECDSA';
    hash: {
        name: HashAlgorithmIdentifier;
    } | HashAlgorithmIdentifier;
};
export type Ed25519Params = {
    name: 'Ed25519';
};
export type RsaSsaParams = {
    name: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS';
    hash: {
        name: HashAlgorithmIdentifier;
    } | HashAlgorithmIdentifier;
    saltLength?: number;
};
export type Ed25519KeyGenParams = {
    name: 'Ed25519';
};
export type EcKeyGenParams = {
    name: 'ECDSA';
    namedCurve: 'P-256' | 'P-384' | 'P-521' | 'K-256';
};
export type RsaHashedKeyGenParams = {
    name: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS';
    modulusLength: number;
    publicExponent: Uint8Array;
    hash: {
        name: HashAlgorithmIdentifier;
    };
};
export type Ed25519KeyImportParams = {
    name: 'Ed25519';
};
export type EcKeyImportParams = {
    name: 'ECDSA';
    namedCurve: 'P-256' | 'P-384' | 'K-256' | 'P-521';
};
export type RsaHashedImportParams = {
    name: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS';
    hash: {
        name: HashAlgorithmIdentifier;
    };
};
export type KeyUsage = 'sign' | 'verify' | 'encrypt' | 'decrypt' | 'wrapKey' | 'unwrapKey' | 'deriveKey' | 'deriveBits';
export type KeyFormat = 'jwk' | 'pkcs8' | 'spki' | 'raw';
export type KeyType = 'private' | 'public' | 'secret';
export type JsonWebKey = Jwk;
export type HashAlgorithm = {
    name: HashAlgorithmIdentifier;
};
export type KeyImportParams = EcKeyImportParams | Ed25519KeyImportParams | RsaHashedImportParams;
export type KeyGenAlgorithm = EcKeyGenParams | Ed25519KeyGenParams | RsaHashedKeyGenParams;
export type KeySignParams = EcdsaParams | Ed25519Params | RsaSsaParams;
export type KeyVerifyParams = EcdsaParams | Ed25519Params | RsaSsaParams;
/**
 * Derives the JWA algorithm name from KeySignParams or KeyVerifyParams
 * @param params - The signing or verification parameters
 * @returns The corresponding JWA algorithm string
 */
export declare function keyParamsToJwaAlgorithm(params: KeySignParams | KeyVerifyParams, key: CredoWebCryptoKey): KnownJwaSignatureAlgorithm;
export {};
