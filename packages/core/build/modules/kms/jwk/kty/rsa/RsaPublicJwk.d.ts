import { KnownJwaKeyAgreementAlgorithm, KnownJwaSignatureAlgorithm } from '../../jwa';
import { PublicJwkType } from '../PublicJwk';
import { KmsJwkPublicRsa } from './rsaJwk';
export declare class RsaPublicJwk implements PublicJwkType<KmsJwkPublicRsa> {
    readonly jwk: KmsJwkPublicRsa;
    static supportdEncryptionKeyAgreementAlgorithms: KnownJwaKeyAgreementAlgorithm[];
    static supportedSignatureAlgorithms: KnownJwaSignatureAlgorithm[];
    static multicodecPrefix: number;
    multicodecPrefix: number;
    supportdEncryptionKeyAgreementAlgorithms: ("ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20")[];
    get supportedSignatureAlgorithms(): ("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K")[];
    constructor(jwk: KmsJwkPublicRsa);
    get publicKey(): {
        modulus: Uint8Array<ArrayBuffer>;
        exponent: Uint8Array<ArrayBuffer>;
        kty: "RSA";
    };
    get multicodec(): Uint8Array;
    static fromPublicKey(publicKey: {
        modulus: Uint8Array;
        exponent: Uint8Array;
    }): RsaPublicJwk;
    static fromMulticodec(_multicodec: Uint8Array): RsaPublicJwk;
}
