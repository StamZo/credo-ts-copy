import { SubjectPublicKeyInfo } from '@peculiar/asn1-x509';
import type { KeyGenAlgorithm } from '../types';
import { PublicJwk } from '../../../modules/kms';
export declare const publicJwkToCryptoKeyAlgorithm: (key: PublicJwk) => KeyGenAlgorithm;
export declare const cryptoKeyAlgorithmToCreateKeyOptions: (algorithm: KeyGenAlgorithm) => {
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
};
export declare const spkiToPublicJwk: (spki: SubjectPublicKeyInfo) => PublicJwk;
export declare const publicJwkToSpki: (publicJwk: PublicJwk) => SubjectPublicKeyInfo;
