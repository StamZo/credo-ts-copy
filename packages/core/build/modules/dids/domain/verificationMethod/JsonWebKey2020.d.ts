import type { VerificationMethod } from './VerificationMethod';
import { PublicJwk } from '../../../kms';
export declare const VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020 = "JsonWebKey2020";
type GetJsonWebKey2020Options = {
    did: string;
    verificationMethodId?: string;
    publicJwk: PublicJwk;
};
/**
 * Get a JsonWebKey2020 verification method.
 */
export declare function getJsonWebKey2020(options: GetJsonWebKey2020Options): {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk: {
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
    } | ({
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
    } & {
        crv: "P-256";
    }) | ({
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
    } & {
        crv: "P-384";
    }) | ({
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
    } & {
        crv: "P-521";
    }) | ({
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
    } & {
        crv: "secp256k1";
    }) | ({
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
    } & {
        crv: "X25519";
    }) | ({
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
    } & {
        crv: "Ed25519";
    });
};
/**
 * Check whether a verification method is a JsonWebKey2020 verification method.
 */
export declare function isJsonWebKey2020(verificationMethod: VerificationMethod): verificationMethod is VerificationMethod & {
    type: 'JsonWebKey2020';
};
/**
 * Get a key from a JsonWebKey2020 verification method.
 */
export declare function getPublicJwkFromJsonWebKey2020(verificationMethod: VerificationMethod & {
    type: 'JsonWebKey2020';
}): PublicJwk<import("../../../kms/jwk/PublicJwk").SupportedPublicJwk>;
export {};
