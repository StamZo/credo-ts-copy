import { PublicJwk } from '../../../kms';
export declare class DidJwk {
    readonly did: string;
    readonly publicJwk: PublicJwk;
    private constructor();
    get allowsEncrypting(): boolean;
    get allowsSigning(): boolean;
    static fromDid(did: string): DidJwk;
    /**
     * A did:jwk DID can only have one verification method, and the verification method
     * id will always be `<did>#0`.
     */
    get verificationMethodId(): string;
    static fromPublicJwk(publicJwk: PublicJwk): DidJwk;
    get jwkJson(): {
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
    get didDocument(): import("../..").DidDocument;
}
