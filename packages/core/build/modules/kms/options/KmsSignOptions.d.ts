import * as z from '../../../utils/zod';
export declare const zKmsSignOptions: z.ZodObject<{
    /**
     * The key to use for signing
     */
    keyId: z.ZodString;
    /**
     * The JWA signature algorithm to use for signing
     */
    algorithm: z.ZodEnum<["HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K", ...("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[]]>;
    /**
     * The data to sign
     */
    data: z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    keyId: string;
    data: Uint8Array<ArrayBuffer>;
}, {
    algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    keyId: string;
    data: Uint8Array<ArrayBuffer>;
}>;
export type KmsSignOptions = z.output<typeof zKmsSignOptions>;
export interface KmsSignReturn {
    signature: Uint8Array;
}
