import { KnownJwaSignatureAlgorithm } from '../../jwa';
import { PublicJwkType } from '../PublicJwk';
import { KmsJwkPublicEc } from './ecJwk';
type Jwk = KmsJwkPublicEc & {
    crv: 'P-384';
};
export declare class P384PublicJwk implements PublicJwkType<Jwk> {
    readonly jwk: Jwk;
    static supportedSignatureAlgorithms: KnownJwaSignatureAlgorithm[];
    static supportdEncryptionKeyAgreementAlgorithms: "ECDH-ES"[];
    static multicodecPrefix: number;
    supportdEncryptionKeyAgreementAlgorithms: "ECDH-ES"[];
    supportedSignatureAlgorithms: ("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[];
    multicodecPrefix: number;
    constructor(jwk: Jwk);
    get publicKey(): {
        crv: "P-384";
        kty: "EC";
        publicKey: Uint8Array<ArrayBufferLike>;
    };
    get multicodec(): Uint8Array<ArrayBufferLike>;
    static fromPublicKey(publicKey: Uint8Array): P384PublicJwk;
    static fromMulticodec(multicodec: Uint8Array): P384PublicJwk;
}
export {};
