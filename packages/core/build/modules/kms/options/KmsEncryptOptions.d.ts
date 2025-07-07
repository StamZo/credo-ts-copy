import * as z from '../../../utils/zod';
declare const zKmsEncryptDataEncryptionAesGcm: z.ZodObject<{
    algorithm: z.ZodEnum<["A128GCM", "A192GCM", "A256GCM"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128GCM" | "A192GCM" | "A256GCM";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128GCM" | "A192GCM" | "A256GCM";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>;
export type KmsEncryptDataEncryptionAesGcm = z.output<typeof zKmsEncryptDataEncryptionAesGcm>;
declare const zKmsEncryptDataEncryptionAesCbc: z.ZodObject<{
    algorithm: z.ZodEnum<["A128CBC", "A256CBC"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128CBC" | "A256CBC";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128CBC" | "A256CBC";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}>;
export type KmsEncryptDataEncryptionAesCbc = z.output<typeof zKmsEncryptDataEncryptionAesCbc>;
declare const zKmsEncryptDataEncryptionAesCbcHmac: z.ZodObject<{
    algorithm: z.ZodEnum<["A128CBC-HS256", "A192CBC-HS384", "A256CBC-HS512"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>;
export type KmsEncryptDataEncryptionAesCbcHmac = z.output<typeof zKmsEncryptDataEncryptionAesCbcHmac>;
declare const zKmsEncryptDataEncryptionC20p: z.ZodObject<{
    algorithm: z.ZodEnum<["C20P", "XC20P"]>;
    iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "C20P" | "XC20P";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "C20P" | "XC20P";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>;
export type KmsEncryptDataEncryptionX20c = z.output<typeof zKmsEncryptDataEncryptionC20p>;
export declare const zKmsEncryptDataEncryption: z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
    algorithm: z.ZodEnum<["A128CBC", "A256CBC"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128CBC" | "A256CBC";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128CBC" | "A256CBC";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}>, z.ZodObject<{
    algorithm: z.ZodEnum<["A128CBC-HS256", "A192CBC-HS384", "A256CBC-HS512"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>, z.ZodObject<{
    algorithm: z.ZodEnum<["A128GCM", "A192GCM", "A256GCM"]>;
    iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "A128GCM" | "A192GCM" | "A256GCM";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "A128GCM" | "A192GCM" | "A256GCM";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>, z.ZodObject<{
    algorithm: z.ZodEnum<["C20P", "XC20P"]>;
    iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "C20P" | "XC20P";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "C20P" | "XC20P";
    iv?: Uint8Array<ArrayBuffer> | undefined;
    aad?: Uint8Array<ArrayBuffer> | undefined;
}>, z.ZodObject<{
    algorithm: z.ZodEnum<["XSALSA20-POLY1305"]>;
    iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "XSALSA20-POLY1305";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}, {
    algorithm: "XSALSA20-POLY1305";
    iv?: Uint8Array<ArrayBuffer> | undefined;
}>]>;
export type KmsEncryptDataEncryption = z.output<typeof zKmsEncryptDataEncryption>;
export declare const zKmsEncryptOptions: z.ZodObject<{
    /**
     * The key to use for encrypting. There are three possible formats:
     * - a key id, pointing to a symmetric (oct) jwk that can be used directly for encryption
     * - a private symmetric (oct) jwk object that can be used directly for encryption
     * - an object configuring key agreement, based on an existing assymetric key
     */
    key: z.ZodUnion<[z.ZodObject<{
        keyId: z.ZodString;
        privateJwk: z.ZodOptional<z.ZodNever>;
        keyAgreement: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        keyId: string;
        privateJwk?: undefined;
        keyAgreement?: undefined;
    }, {
        keyId: string;
        privateJwk?: undefined;
        keyAgreement?: undefined;
    }>, z.ZodObject<{
        privateJwk: z.ZodObject<{
            k: z.ZodString;
            kty: z.ZodLiteral<"oct">;
            kid: z.ZodOptional<z.ZodString>;
            alg: z.ZodOptional<z.ZodString>;
            key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
            use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
            ext: z.ZodOptional<z.ZodBoolean>;
            x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            x5t: z.ZodOptional<z.ZodString>;
            'x5t#S256': z.ZodOptional<z.ZodString>;
            x5u: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        }, {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        }>;
        keyId: z.ZodOptional<z.ZodNever>;
        keyAgreement: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        privateJwk: {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        };
        keyId?: undefined;
        keyAgreement?: undefined;
    }, {
        privateJwk: {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        };
        keyId?: undefined;
        keyAgreement?: undefined;
    }>, z.ZodObject<{
        keyAgreement: z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
            keyId: z.ZodString;
            algorithm: z.ZodLiteral<"ECDH-ES">;
            externalPublicJwk: z.ZodUnion<[z.ZodObject<{
                kty: z.ZodLiteral<"OKP">;
                x: z.ZodString;
                d: z.ZodOptional<z.ZodString>;
                kid: z.ZodOptional<z.ZodString>;
                alg: z.ZodOptional<z.ZodString>;
                key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
                use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
                ext: z.ZodOptional<z.ZodBoolean>;
                x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                x5t: z.ZodOptional<z.ZodString>;
                'x5t#S256': z.ZodOptional<z.ZodString>;
                x5u: z.ZodOptional<z.ZodString>;
            } & {
                crv: z.ZodEnum<["X25519"]>;
            }, "strip", z.ZodTypeAny, {
                kty: "OKP";
                crv: "X25519";
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
            }, {
                kty: "OKP";
                crv: "X25519";
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
            }>, z.ZodObject<{
                kty: z.ZodLiteral<"EC">;
                x: z.ZodString;
                y: z.ZodString;
                d: z.ZodOptional<z.ZodUndefined>;
                kid: z.ZodOptional<z.ZodString>;
                alg: z.ZodOptional<z.ZodString>;
                key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
                use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
                ext: z.ZodOptional<z.ZodBoolean>;
                x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                x5t: z.ZodOptional<z.ZodString>;
                'x5t#S256': z.ZodOptional<z.ZodString>;
                x5u: z.ZodOptional<z.ZodString>;
            } & {
                crv: z.ZodEnum<["P-256", "P-384", "P-521", "secp256k1"]>;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>]>;
            apu: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
            apv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
        }, "strip", z.ZodTypeAny, {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        }, {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        }>, z.ZodObject<{
            keyId: z.ZodString;
            algorithm: z.ZodEnum<["ECDH-ES+A128KW", "ECDH-ES+A192KW", "ECDH-ES+A256KW"]>;
            externalPublicJwk: z.ZodUnion<[z.ZodObject<{
                kty: z.ZodLiteral<"OKP">;
                x: z.ZodString;
                d: z.ZodOptional<z.ZodString>;
                kid: z.ZodOptional<z.ZodString>;
                alg: z.ZodOptional<z.ZodString>;
                key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
                use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
                ext: z.ZodOptional<z.ZodBoolean>;
                x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                x5t: z.ZodOptional<z.ZodString>;
                'x5t#S256': z.ZodOptional<z.ZodString>;
                x5u: z.ZodOptional<z.ZodString>;
            } & {
                crv: z.ZodEnum<["X25519"]>;
            }, "strip", z.ZodTypeAny, {
                kty: "OKP";
                crv: "X25519";
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
            }, {
                kty: "OKP";
                crv: "X25519";
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
            }>, z.ZodObject<{
                kty: z.ZodLiteral<"EC">;
                x: z.ZodString;
                y: z.ZodString;
                d: z.ZodOptional<z.ZodUndefined>;
                kid: z.ZodOptional<z.ZodString>;
                alg: z.ZodOptional<z.ZodString>;
                key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
                use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
                ext: z.ZodOptional<z.ZodBoolean>;
                x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                x5t: z.ZodOptional<z.ZodString>;
                'x5t#S256': z.ZodOptional<z.ZodString>;
                x5u: z.ZodOptional<z.ZodString>;
            } & {
                crv: z.ZodEnum<["P-256", "P-384", "P-521", "secp256k1"]>;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>]>;
            apu: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
            apv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
        }, "strip", z.ZodTypeAny, {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        }, {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        }>, z.ZodObject<{
            keyId: z.ZodOptional<z.ZodString>;
            algorithm: z.ZodLiteral<"ECDH-HSALSA20">;
            externalPublicJwk: z.ZodObject<{
                kty: z.ZodLiteral<"OKP">;
                x: z.ZodString;
                d: z.ZodOptional<z.ZodString>;
                kid: z.ZodOptional<z.ZodString>;
                alg: z.ZodOptional<z.ZodString>;
                key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
                use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
                ext: z.ZodOptional<z.ZodBoolean>;
                x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                x5t: z.ZodOptional<z.ZodString>;
                'x5t#S256': z.ZodOptional<z.ZodString>;
                x5u: z.ZodOptional<z.ZodString>;
            } & {
                crv: z.ZodEnum<["X25519"]>;
            }, "strip", z.ZodTypeAny, {
                kty: "OKP";
                crv: "X25519";
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
            }, {
                kty: "OKP";
                crv: "X25519";
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
            }>;
        }, "strip", z.ZodTypeAny, {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        }, {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        }>]>;
        keyId: z.ZodOptional<z.ZodNever>;
        privateJwk: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        keyAgreement: {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        };
        keyId?: undefined;
        privateJwk?: undefined;
    }, {
        keyAgreement: {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        };
        keyId?: undefined;
        privateJwk?: undefined;
    }>]>;
    /**
     * The encryption algorithm used to encrypt the data/content.
     * In JWE this parameter is referred to as "enc".
     */
    encryption: z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
        algorithm: z.ZodEnum<["A128CBC", "A256CBC"]>;
        iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        algorithm: "A128CBC" | "A256CBC";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        algorithm: "A128CBC" | "A256CBC";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    }>, z.ZodObject<{
        algorithm: z.ZodEnum<["A128CBC-HS256", "A192CBC-HS384", "A256CBC-HS512"]>;
        iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
        aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }>, z.ZodObject<{
        algorithm: z.ZodEnum<["A128GCM", "A192GCM", "A256GCM"]>;
        iv: z.ZodOptional<z.ZodEffects<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>, Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>>;
        aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        algorithm: "A128GCM" | "A192GCM" | "A256GCM";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        algorithm: "A128GCM" | "A192GCM" | "A256GCM";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }>, z.ZodObject<{
        algorithm: z.ZodEnum<["C20P", "XC20P"]>;
        iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
        aad: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        algorithm: "C20P" | "XC20P";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        algorithm: "C20P" | "XC20P";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    }>, z.ZodObject<{
        algorithm: z.ZodEnum<["XSALSA20-POLY1305"]>;
        iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        algorithm: "XSALSA20-POLY1305";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        algorithm: "XSALSA20-POLY1305";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    }>]>;
    /**
     * The data to encrypt
     */
    data: z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>;
}, "strip", z.ZodTypeAny, {
    encryption: {
        algorithm: "A128CBC" | "A256CBC";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "A128GCM" | "A192GCM" | "A256GCM";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "C20P" | "XC20P";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "XSALSA20-POLY1305";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    };
    data: Uint8Array<ArrayBuffer>;
    key: {
        keyId: string;
        privateJwk?: undefined;
        keyAgreement?: undefined;
    } | {
        privateJwk: {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        };
        keyId?: undefined;
        keyAgreement?: undefined;
    } | {
        keyAgreement: {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        };
        keyId?: undefined;
        privateJwk?: undefined;
    };
}, {
    encryption: {
        algorithm: "A128CBC" | "A256CBC";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "A128GCM" | "A192GCM" | "A256GCM";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "C20P" | "XC20P";
        iv?: Uint8Array<ArrayBuffer> | undefined;
        aad?: Uint8Array<ArrayBuffer> | undefined;
    } | {
        algorithm: "XSALSA20-POLY1305";
        iv?: Uint8Array<ArrayBuffer> | undefined;
    };
    data: Uint8Array<ArrayBuffer>;
    key: {
        keyId: string;
        privateJwk?: undefined;
        keyAgreement?: undefined;
    } | {
        privateJwk: {
            kty: "oct";
            k: string;
            kid?: string | undefined;
            alg?: string | undefined;
            key_ops?: string[] | undefined;
            use?: string | undefined;
            ext?: boolean | undefined;
            x5c?: string[] | undefined;
            x5t?: string | undefined;
            'x5t#S256'?: string | undefined;
            x5u?: string | undefined;
        };
        keyId?: undefined;
        keyAgreement?: undefined;
    } | {
        keyAgreement: {
            algorithm: "ECDH-ES";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW";
            keyId: string;
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            apu?: Uint8Array<ArrayBuffer> | undefined;
            apv?: Uint8Array<ArrayBuffer> | undefined;
        } | {
            algorithm: "ECDH-HSALSA20";
            externalPublicJwk: {
                kty: "OKP";
                crv: "X25519";
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
            };
            keyId?: string | undefined;
        };
        keyId?: undefined;
        privateJwk?: undefined;
    };
}>;
export type KmsEncryptOptions = z.output<typeof zKmsEncryptOptions>;
export interface KmsEncryptReturn {
    /**
     * The encrypted data, also known as "ciphertext" in JWE
     */
    encrypted: Uint8Array;
    /**
     * Optional authentication tag
     */
    tag?: Uint8Array;
    /**
     * The initialization vector. For algorithms where the iv is required
     * and not provided, this will contain the auto-generated value.
     */
    iv?: Uint8Array;
    /**
     * The encrypted content encryption key, if key wrapping was used
     */
    encryptedKey?: KmsEncryptedKey;
}
export declare const zKmsEncryptedKey: z.ZodObject<{
    /**
     * Optional authentication tag
     */
    tag: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    /**
     * The initialization vector.
     */
    iv: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    /**
     * The encrypted key
     */
    encrypted: z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>;
}, "strip", z.ZodTypeAny, {
    encrypted: Uint8Array<ArrayBuffer>;
    tag?: Uint8Array<ArrayBuffer> | undefined;
    iv?: Uint8Array<ArrayBuffer> | undefined;
}, {
    encrypted: Uint8Array<ArrayBuffer>;
    tag?: Uint8Array<ArrayBuffer> | undefined;
    iv?: Uint8Array<ArrayBuffer> | undefined;
}>;
/**
 * An encrypted content encryption key (CEK).
 */
export type KmsEncryptedKey = z.infer<typeof zKmsEncryptedKey>;
export {};
