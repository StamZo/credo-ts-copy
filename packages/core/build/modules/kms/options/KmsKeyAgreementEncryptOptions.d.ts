import * as z from '../../../utils/zod';
export declare const zKmsJwkPublicEcdh: z.ZodUnion<[z.ZodObject<{
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
export type KmsJwkPublicEcdh = z.infer<typeof zKmsJwkPublicEcdh>;
export declare const zKmsKeyAgreementEcdhEs: z.ZodObject<{
    /**
     * The key id pointing to the ephemeral public key.
     *
     * The key type MUST match with the externalPublicJwk
     */
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
}>;
export type KmsKeyAgreementEcdhEs = z.output<typeof zKmsKeyAgreementEcdhEs>;
declare const zKmsKeyAgreementEncryptEcdhEsKw: z.ZodObject<{
    /**
     * The key id pointing to the ephemeral public key.
     *
     * The key type MUST match with the externalPublicJwk
     */
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
}>;
export type KmsKeyAgreementEncryptEcdhEsKw = z.output<typeof zKmsKeyAgreementEncryptEcdhEsKw>;
declare const zKmsKeyAgreementEncryptEcdhHsalsa20: z.ZodObject<{
    /**
     * The key id to use for encrypting the content encryption key.
     * If no key id is provided, anonymous encryption is used.
     */
    keyId: z.ZodOptional<z.ZodString>;
    /**
     * Perform key agreement based on the HSALSA20 as used in Libsodium's
     * Cryptobox. This is not based on an official JWA algorithm, but is
     * used primarily for DIDComm v1 messaging.
     */
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
}>;
export type KmsKeyAgreementEncryptEcdhHsalsa20 = z.output<typeof zKmsKeyAgreementEncryptEcdhHsalsa20>;
export declare const zKmsKeyAgreementEncryptOptions: z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
    /**
     * The key id pointing to the ephemeral public key.
     *
     * The key type MUST match with the externalPublicJwk
     */
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
    /**
     * The key id pointing to the ephemeral public key.
     *
     * The key type MUST match with the externalPublicJwk
     */
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
    /**
     * The key id to use for encrypting the content encryption key.
     * If no key id is provided, anonymous encryption is used.
     */
    keyId: z.ZodOptional<z.ZodString>;
    /**
     * Perform key agreement based on the HSALSA20 as used in Libsodium's
     * Cryptobox. This is not based on an official JWA algorithm, but is
     * used primarily for DIDComm v1 messaging.
     */
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
export type KmsKeyAgreementEncryptOptions = z.output<typeof zKmsKeyAgreementEncryptOptions>;
export {};
