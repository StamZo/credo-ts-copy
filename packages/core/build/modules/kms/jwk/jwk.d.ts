import * as z from '../../../utils/zod';
export declare const vJwkCommon: z.ZodObject<{
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type JwkCommon = z.output<typeof vJwkCommon>;
export declare const vJwk: z.ZodObject<{
    crv: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodString>;
    d: z.ZodOptional<z.ZodString>;
    y: z.ZodOptional<z.ZodString>;
    k: z.ZodOptional<z.ZodString>;
    e: z.ZodOptional<z.ZodString>;
    n: z.ZodOptional<z.ZodString>;
    dp: z.ZodOptional<z.ZodString>;
    dq: z.ZodOptional<z.ZodString>;
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
    p: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    qi: z.ZodOptional<z.ZodString>;
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    crv: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodString>;
    d: z.ZodOptional<z.ZodString>;
    y: z.ZodOptional<z.ZodString>;
    k: z.ZodOptional<z.ZodString>;
    e: z.ZodOptional<z.ZodString>;
    n: z.ZodOptional<z.ZodString>;
    dp: z.ZodOptional<z.ZodString>;
    dq: z.ZodOptional<z.ZodString>;
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
    p: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    qi: z.ZodOptional<z.ZodString>;
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    crv: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodString>;
    d: z.ZodOptional<z.ZodString>;
    y: z.ZodOptional<z.ZodString>;
    k: z.ZodOptional<z.ZodString>;
    e: z.ZodOptional<z.ZodString>;
    n: z.ZodOptional<z.ZodString>;
    dp: z.ZodOptional<z.ZodString>;
    dq: z.ZodOptional<z.ZodString>;
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
    p: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    qi: z.ZodOptional<z.ZodString>;
    kty: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
    alg: z.ZodOptional<z.ZodString>;
    key_ops: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sign">, z.ZodLiteral<"verify">, z.ZodLiteral<"encrypt">, z.ZodLiteral<"decrypt">, z.ZodLiteral<"wrapKey">, z.ZodLiteral<"unwrapKey">, z.ZodLiteral<"deriveKey">, z.ZodLiteral<"deriveBits">]>, z.ZodString]>, "many">, string[], string[]>>;
    use: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sig">, z.ZodLiteral<"enc">]>, z.ZodString]>>;
    ext: z.ZodOptional<z.ZodBoolean>;
    x5c: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    x5t: z.ZodOptional<z.ZodString>;
    'x5t#S256': z.ZodOptional<z.ZodString>;
    x5u: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type Jwk = z.output<typeof vJwk>;
