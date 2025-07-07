import { KnownJwaKeyAgreementAlgorithm, KnownJwaSignatureAlgorithm } from '../../jwa';
import { PublicJwkType } from '../PublicJwk';
import { KmsJwkPublicOkp } from './okpJwk';
type Jwk = KmsJwkPublicOkp & {
    crv: 'Ed25519';
};
export declare class Ed25519PublicJwk implements PublicJwkType<Jwk> {
    readonly jwk: Jwk;
    static supportedSignatureAlgorithms: KnownJwaSignatureAlgorithm[];
    static supportdEncryptionKeyAgreementAlgorithms: KnownJwaKeyAgreementAlgorithm[];
    static multicodecPrefix: number;
    supportdEncryptionKeyAgreementAlgorithms: ("ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20")[];
    supportedSignatureAlgorithms: ("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[];
    multicodecPrefix: number;
    constructor(jwk: Jwk);
    get publicKey(): {
        crv: "Ed25519";
        kty: "OKP";
        publicKey: Uint8Array<ArrayBufferLike>;
    };
    get multicodec(): Uint8Array<ArrayBufferLike>;
    static fromPublicKey(publicKey: Uint8Array): Ed25519PublicJwk;
    static fromMulticodec(multicodec: Uint8Array): Ed25519PublicJwk;
    toX25519PublicJwk(): {
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
    };
}
export {};
