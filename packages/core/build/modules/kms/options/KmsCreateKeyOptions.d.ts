import type { KmsJwkPublicFromCreateType } from '../jwk/knownJwk';
import * as z from '../../../utils/zod';
import { KnownJwaSignatureAlgorithm } from '../jwk';
declare const zKmsCreateKeyTypeEc: z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}>;
export type KmsCreateKeyTypeEc = z.output<typeof zKmsCreateKeyTypeEc>;
/**
 * Octer key pair, commonly used for Ed25519 and X25519 key types
 */
declare const zKmsCreateKeyTypeOkp: z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}>;
export type KmsCreateKeyTypeOkp = z.output<typeof zKmsCreateKeyTypeOkp>;
/**
 * RSA key pair.
 */
declare const zKmsCreateKeyTypeRsa: z.ZodObject<Pick<{
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
}, "kty"> & {
    modulusLength: z.ZodUnion<[z.ZodLiteral<2048>, z.ZodLiteral<3072>, z.ZodLiteral<4096>]>;
}, "strip", z.ZodTypeAny, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}>;
export type KmsCreateKeyTypeRsa = z.output<typeof zKmsCreateKeyTypeRsa>;
/**
 * Represents an octect sequence for symmetric keys
 */
export declare const zKmsCreateKeyTypeOct: z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    algorithm: z.ZodLiteral<"aes">;
    length: z.ZodUnion<[z.ZodLiteral<128>, z.ZodLiteral<192>, z.ZodLiteral<256>, z.ZodEffects<z.ZodNumber, number, number>]>;
}, "strip", z.ZodTypeAny, {
    length: number;
    algorithm: "aes";
    kty: "oct";
}, {
    length: number;
    algorithm: "aes";
    kty: "oct";
}>, z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    algorithm: z.ZodLiteral<"hmac">;
    length: z.ZodUnion<[z.ZodLiteral<256>, z.ZodLiteral<384>, z.ZodLiteral<512>]>;
}, "strip", z.ZodTypeAny, {
    length: 256 | 384 | 512;
    algorithm: "hmac";
    kty: "oct";
}, {
    length: 256 | 384 | 512;
    algorithm: "hmac";
    kty: "oct";
}>, z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    /**
     * For usage with ChaCha20-Poly1305 and XChaCha20-Poly1305
     */
    algorithm: z.ZodLiteral<"C20P">;
}, "strip", z.ZodTypeAny, {
    algorithm: "C20P";
    kty: "oct";
}, {
    algorithm: "C20P";
    kty: "oct";
}>]>;
export type KmsCreateKeyTypeOct = z.output<typeof zKmsCreateKeyTypeOct>;
export declare const zKmsCreateKeyTypeAssymetric: z.ZodUnion<[z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}>, z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}>, z.ZodObject<Pick<{
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
}, "kty"> & {
    modulusLength: z.ZodUnion<[z.ZodLiteral<2048>, z.ZodLiteral<3072>, z.ZodLiteral<4096>]>;
}, "strip", z.ZodTypeAny, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}>]>;
export type KmsCreateKeyTypeAssymetric = z.output<typeof zKmsCreateKeyTypeAssymetric>;
export declare const zKmsCreateKeyType: z.ZodUnion<[z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}, {
    kty: "EC";
    crv: "P-256" | "P-384" | "P-521" | "secp256k1";
}>, z.ZodObject<Pick<{
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
}, "kty" | "crv">, "strip", z.ZodTypeAny, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}, {
    kty: "OKP";
    crv: "X25519" | "Ed25519";
}>, z.ZodObject<Pick<{
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
}, "kty"> & {
    modulusLength: z.ZodUnion<[z.ZodLiteral<2048>, z.ZodLiteral<3072>, z.ZodLiteral<4096>]>;
}, "strip", z.ZodTypeAny, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}, {
    kty: "RSA";
    modulusLength: 4096 | 3072 | 2048;
}>, z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    algorithm: z.ZodLiteral<"aes">;
    length: z.ZodUnion<[z.ZodLiteral<128>, z.ZodLiteral<192>, z.ZodLiteral<256>, z.ZodEffects<z.ZodNumber, number, number>]>;
}, "strip", z.ZodTypeAny, {
    length: number;
    algorithm: "aes";
    kty: "oct";
}, {
    length: number;
    algorithm: "aes";
    kty: "oct";
}>, z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    algorithm: z.ZodLiteral<"hmac">;
    length: z.ZodUnion<[z.ZodLiteral<256>, z.ZodLiteral<384>, z.ZodLiteral<512>]>;
}, "strip", z.ZodTypeAny, {
    length: 256 | 384 | 512;
    algorithm: "hmac";
    kty: "oct";
}, {
    length: 256 | 384 | 512;
    algorithm: "hmac";
    kty: "oct";
}>, z.ZodObject<{
    kty: z.ZodLiteral<"oct">;
    /**
     * For usage with ChaCha20-Poly1305 and XChaCha20-Poly1305
     */
    algorithm: z.ZodLiteral<"C20P">;
}, "strip", z.ZodTypeAny, {
    algorithm: "C20P";
    kty: "oct";
}, {
    algorithm: "C20P";
    kty: "oct";
}>]>]>;
export type KmsCreateKeyType = z.output<typeof zKmsCreateKeyType>;
export declare const zKmsCreateKeyOptions: z.ZodObject<{
    keyId: z.ZodOptional<z.ZodString>;
    type: z.ZodUnion<[z.ZodObject<Pick<{
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
    }, "kty" | "crv">, "strip", z.ZodTypeAny, {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
    }, {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
    }>, z.ZodObject<Pick<{
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
    }, "kty" | "crv">, "strip", z.ZodTypeAny, {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
    }, {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
    }>, z.ZodObject<Pick<{
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
    }, "kty"> & {
        modulusLength: z.ZodUnion<[z.ZodLiteral<2048>, z.ZodLiteral<3072>, z.ZodLiteral<4096>]>;
    }, "strip", z.ZodTypeAny, {
        kty: "RSA";
        modulusLength: 4096 | 3072 | 2048;
    }, {
        kty: "RSA";
        modulusLength: 4096 | 3072 | 2048;
    }>, z.ZodDiscriminatedUnion<"algorithm", [z.ZodObject<{
        kty: z.ZodLiteral<"oct">;
        algorithm: z.ZodLiteral<"aes">;
        length: z.ZodUnion<[z.ZodLiteral<128>, z.ZodLiteral<192>, z.ZodLiteral<256>, z.ZodEffects<z.ZodNumber, number, number>]>;
    }, "strip", z.ZodTypeAny, {
        length: number;
        algorithm: "aes";
        kty: "oct";
    }, {
        length: number;
        algorithm: "aes";
        kty: "oct";
    }>, z.ZodObject<{
        kty: z.ZodLiteral<"oct">;
        algorithm: z.ZodLiteral<"hmac">;
        length: z.ZodUnion<[z.ZodLiteral<256>, z.ZodLiteral<384>, z.ZodLiteral<512>]>;
    }, "strip", z.ZodTypeAny, {
        length: 256 | 384 | 512;
        algorithm: "hmac";
        kty: "oct";
    }, {
        length: 256 | 384 | 512;
        algorithm: "hmac";
        kty: "oct";
    }>, z.ZodObject<{
        kty: z.ZodLiteral<"oct">;
        /**
         * For usage with ChaCha20-Poly1305 and XChaCha20-Poly1305
         */
        algorithm: z.ZodLiteral<"C20P">;
    }, "strip", z.ZodTypeAny, {
        algorithm: "C20P";
        kty: "oct";
    }, {
        algorithm: "C20P";
        kty: "oct";
    }>]>]>;
}, "strip", z.ZodTypeAny, {
    type: {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
    } | {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
    } | {
        kty: "RSA";
        modulusLength: 4096 | 3072 | 2048;
    } | {
        length: number;
        algorithm: "aes";
        kty: "oct";
    } | {
        length: 256 | 384 | 512;
        algorithm: "hmac";
        kty: "oct";
    } | {
        algorithm: "C20P";
        kty: "oct";
    };
    keyId?: string | undefined;
}, {
    type: {
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
    } | {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
    } | {
        kty: "RSA";
        modulusLength: 4096 | 3072 | 2048;
    } | {
        length: number;
        algorithm: "aes";
        kty: "oct";
    } | {
        length: 256 | 384 | 512;
        algorithm: "hmac";
        kty: "oct";
    } | {
        algorithm: "C20P";
        kty: "oct";
    };
    keyId?: string | undefined;
}>;
export interface KmsCreateKeyOptions<Type extends KmsCreateKeyType = KmsCreateKeyType> {
    /**
     * The `kid` for the key.
     */
    keyId?: string;
    /**
     * The type of key to generate
     */
    type: Type;
}
export declare const zKmsCreateKeyForSignatureAlgorithmOptions: z.ZodObject<{
    keyId: z.ZodOptional<z.ZodString>;
    algorithm: z.ZodEnum<["HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", ...("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[]]>;
}, "strip", z.ZodTypeAny, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    keyId?: string | undefined;
}, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    keyId?: string | undefined;
}>;
export interface KmsCreateKeyForSignatureAlgorithmOptions {
    /**
     * The `kid` for the key.
     */
    keyId?: string;
    /**
     * The JWA signature algorithm to create the key for.
     */
    algorithm: KnownJwaSignatureAlgorithm;
}
export interface KmsCreateKeyReturn<Type extends KmsCreateKeyType = KmsCreateKeyType> {
    keyId: string;
    /**
     * The public JWK representation of the created key. `kid` will always
     * be defined.
     *
     * In case of a symmetric (oct) key this won't include any key material, but
     * will include additional JWK claims such as `use`, `kty`, and `kid`
     */
    publicJwk: KmsJwkPublicFromCreateType<Type> & {
        kid: string;
    };
}
export {};
