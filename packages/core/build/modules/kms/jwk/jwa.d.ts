import * as z from '../../../utils/zod';
export declare const KnownJwaSignatureAlgorithms: {
    readonly HS256: "HS256";
    readonly HS384: "HS384";
    readonly HS512: "HS512";
    readonly RS256: "RS256";
    readonly RS384: "RS384";
    readonly RS512: "RS512";
    readonly ES256: "ES256";
    readonly ES384: "ES384";
    readonly ES512: "ES512";
    readonly PS256: "PS256";
    readonly PS384: "PS384";
    readonly PS512: "PS512";
    readonly EdDSA: "EdDSA";
    readonly ES256K: "ES256K";
};
export declare const zKnownJwaSignatureAlgorithm: z.ZodEnum<["HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", ...("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[]]>;
export type KnownJwaSignatureAlgorithm = z.output<typeof zKnownJwaSignatureAlgorithm>;
export declare function isKnownJwaSignatureAlgorithm(alg: string): alg is KnownJwaSignatureAlgorithm;
export declare const KnownJwaContentEncryptionAlgorithms: {
    readonly A128GCM: "A128GCM";
    readonly A192GCM: "A192GCM";
    readonly A256GCM: "A256GCM";
    readonly A128CBC: "A128CBC";
    readonly A256CBC: "A256CBC";
    readonly C20P: "C20P";
    readonly XC20P: "XC20P";
    /**
     * As is used in DIDComm v1
     */
    readonly 'XSALSA20-POLY1305': "XSALSA20-POLY1305";
    readonly A128CBC_HS256: "A128CBC-HS256";
    readonly A192CBC_HS384: "A192CBC-HS384";
    readonly A256CBC_HS512: "A256CBC-HS512";
};
export declare const zKnownJwaContentEncryptionAlgorithm: z.ZodEnum<["A128GCM" | "A192GCM" | "A256GCM" | "A128CBC" | "A256CBC" | "C20P" | "XC20P" | "XSALSA20-POLY1305" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512", "A128GCM" | "A192GCM" | "A256GCM" | "A128CBC" | "A256CBC" | "C20P" | "XC20P" | "XSALSA20-POLY1305" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512", ...("A128GCM" | "A192GCM" | "A256GCM" | "A128CBC" | "A256CBC" | "C20P" | "XC20P" | "XSALSA20-POLY1305" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512")[]]>;
export type KnownJwaContentEncryptionAlgorithm = z.output<typeof zKnownJwaContentEncryptionAlgorithm>;
export declare const KnownJwaKeyEncryptionAlgorithms: {
    readonly A128KW: "A128KW";
    readonly A192KW: "A192KW";
    readonly A256KW: "A256KW";
};
declare const zKnownJwaKeyEncryptionAlgorithm: z.ZodEnum<["A128KW" | "A192KW" | "A256KW", "A128KW" | "A192KW" | "A256KW", ...("A128KW" | "A192KW" | "A256KW")[]]>;
export type KnownJwaKeyEncryptionAlgorithm = z.output<typeof zKnownJwaKeyEncryptionAlgorithm>;
export declare const KnownJwaKeyAgreementAlgorithms: {
    readonly ECDH_ES: "ECDH-ES";
    readonly ECDH_ES_A128KW: "ECDH-ES+A128KW";
    readonly ECDH_ES_A192KW: "ECDH-ES+A192KW";
    readonly ECDH_ES_A256KW: "ECDH-ES+A256KW";
    readonly ECDH_HSALSA20: "ECDH-HSALSA20";
};
declare const zKnownJwaKeyAgreementAlgorithm: z.ZodEnum<["ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20", "ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20", ...("ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20")[]]>;
export type KnownJwaKeyAgreementAlgorithm = z.output<typeof zKnownJwaKeyAgreementAlgorithm>;
export {};
