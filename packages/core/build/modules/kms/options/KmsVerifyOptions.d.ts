import type { KmsJwkPublic } from '../jwk/knownJwk';
import * as z from '../../../utils/zod';
export declare const zKmsVerifyOptions: z.ZodObject<{
    /**
     * The key to verify with. Either a string referring to a keyId, or a `KmsJwkPublicAssymetric` for verifying with a
     * public asymmetric JWK.
     *
     * It is currently not possible to verify a signature with symmetric a
     * key that is not already present in the KMS.
     */
    key: z.ZodUnion<[z.ZodObject<{
        keyId: z.ZodString;
        publicJwk: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        keyId: string;
        publicJwk?: undefined;
    }, {
        keyId: string;
        publicJwk?: undefined;
    }>, z.ZodObject<{
        publicJwk: z.ZodDiscriminatedUnion<"kty", [z.ZodObject<{
            kty: z.ZodLiteral<"EC">;
            crv: z.ZodEnum<["P-256", "P-384", "P-521", "secp256k1"]>;
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
        }>, z.ZodObject<{
            kty: z.ZodLiteral<"RSA">;
            n: z.ZodString;
            e: z.ZodString;
            d: z.ZodOptional<z.ZodUndefined>;
            p: z.ZodOptional<z.ZodUndefined>;
            q: z.ZodOptional<z.ZodUndefined>;
            dp: z.ZodOptional<z.ZodUndefined>;
            dq: z.ZodOptional<z.ZodUndefined>;
            qi: z.ZodOptional<z.ZodUndefined>;
            oth: z.ZodOptional<z.ZodUndefined>;
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
        }, {
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
        }>, z.ZodObject<{
            kty: z.ZodLiteral<"OKP">;
            crv: z.ZodEnum<["X25519", "Ed25519"]>;
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
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>]>;
        keyId: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        publicJwk: {
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
        };
        keyId?: undefined;
    }, {
        publicJwk: {
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
        };
        keyId?: undefined;
    }>]>;
    /**
     * The JWA signature algorithm to use for verification
     */
    algorithm: z.ZodEnum<["HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", ...("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[]]>;
    /**
     * The data to verify
     */
    data: z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>;
    /**
     * The signature to verify the data against
     */
    signature: z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    signature: Uint8Array<ArrayBuffer>;
    data: Uint8Array<ArrayBuffer>;
    key: {
        keyId: string;
        publicJwk?: undefined;
    } | {
        publicJwk: {
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
        };
        keyId?: undefined;
    };
}, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    signature: Uint8Array<ArrayBuffer>;
    data: Uint8Array<ArrayBuffer>;
    key: {
        keyId: string;
        publicJwk?: undefined;
    } | {
        publicJwk: {
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
        };
        keyId?: undefined;
    };
}>;
export type KmsVerifyOptions = z.output<typeof zKmsVerifyOptions>;
export type KmsVerifyReturn = {
    verified: true;
    publicJwk: KmsJwkPublic;
} | {
    verified: false;
};
