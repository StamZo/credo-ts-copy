import { KnownJwaSignatureAlgorithm } from '../../jwa';
import { PublicJwkType } from '../PublicJwk';
import { KmsJwkPublicOkp } from './okpJwk';
type Jwk = KmsJwkPublicOkp & {
    crv: 'X25519';
};
export declare class X25519PublicJwk implements PublicJwkType<Jwk> {
    readonly jwk: Jwk;
    static supportdEncryptionKeyAgreementAlgorithms: "ECDH-HSALSA20"[];
    static supportedSignatureAlgorithms: KnownJwaSignatureAlgorithm[];
    static multicodecPrefix: number;
    supportdEncryptionKeyAgreementAlgorithms: "ECDH-HSALSA20"[];
    supportedSignatureAlgorithms: ("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[];
    multicodecPrefix: number;
    constructor(jwk: Jwk);
    get publicKey(): {
        crv: "X25519";
        kty: "OKP";
        publicKey: Uint8Array<ArrayBufferLike>;
    };
    get multicodec(): Uint8Array<ArrayBufferLike>;
    static fromPublicKey(publicKey: Uint8Array): X25519PublicJwk;
    static fromMulticodec(multicodec: Uint8Array): X25519PublicJwk;
}
export {};
