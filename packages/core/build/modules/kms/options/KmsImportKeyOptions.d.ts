import * as z from '../../../utils/zod';
import { KmsJwkPrivate, KmsJwkPublicFromKmsJwkPrivate } from '../jwk/knownJwk';
export declare const zKmsImportKeyOptions: z.ZodObject<{
    /**
     * The private jwk to import. If the key needs to use a specific keyId, make sure to set
     * the `kid` property on the JWK. If no kid is provided a key id will be generated.
     */
    privateJwk: z.ZodDiscriminatedUnion<"kty", [z.ZodObject<{
        d: z.ZodString;
        kty: z.ZodLiteral<"EC">;
        crv: z.ZodEnum<["P-256", "P-384", "P-521", "secp256k1"]>;
        x: z.ZodString;
        y: z.ZodString;
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
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        d: string;
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
    }, {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        d: string;
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
    }>, z.ZodObject<{
        d: z.ZodString;
        p: z.ZodString;
        q: z.ZodString;
        dp: z.ZodString;
        dq: z.ZodString;
        qi: z.ZodString;
        oth: z.ZodOptional<z.ZodArray<z.ZodObject<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        kty: z.ZodLiteral<"RSA">;
        n: z.ZodString;
        e: z.ZodString;
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
        kty: "RSA";
        d: string;
        n: string;
        e: string;
        p: string;
        q: string;
        dp: string;
        dq: string;
        qi: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        oth?: z.objectOutputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
    }, {
        kty: "RSA";
        d: string;
        n: string;
        e: string;
        p: string;
        q: string;
        dp: string;
        dq: string;
        qi: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        oth?: z.objectInputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
    }>, z.ZodObject<{
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
    }>, z.ZodObject<{
        d: z.ZodString;
        kty: z.ZodLiteral<"OKP">;
        crv: z.ZodEnum<["X25519", "Ed25519"]>;
        x: z.ZodString;
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
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        d: string;
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
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        d: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    privateJwk: {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        d: string;
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
    } | {
        kty: "RSA";
        d: string;
        n: string;
        e: string;
        p: string;
        q: string;
        dp: string;
        dq: string;
        qi: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        oth?: z.objectOutputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
    } | {
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
    } | {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        d: string;
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
}, {
    privateJwk: {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        d: string;
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
    } | {
        kty: "RSA";
        d: string;
        n: string;
        e: string;
        p: string;
        q: string;
        dp: string;
        dq: string;
        qi: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        oth?: z.objectInputType<{
            d: z.ZodOptional<z.ZodString>;
            r: z.ZodOptional<z.ZodString>;
            t: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
    } | {
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
    } | {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        d: string;
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
}>;
export interface KmsImportKeyOptions<Jwk extends KmsJwkPrivate> {
    /**
     * The private jwk to import. If the key needs to use a specific keyId, make sure to set
     * the `kid` property on the JWK. If no kid is provided a key id will be generated.
     */
    privateJwk: Jwk;
}
export interface KmsImportKeyReturn<Jwk extends KmsJwkPrivate> {
    keyId: string;
    /**
     * The public JWK representation of the imported key. `kid` will always
     * be defined.
     *
     * In case of a symmetric (oct) key this won't include any key material, but
     * will include additional JWK claims such as `use`, `kty`, and `kid`
     */
    publicJwk: KmsJwkPublicFromKmsJwkPrivate<Jwk> & {
        kid: string;
    };
}
