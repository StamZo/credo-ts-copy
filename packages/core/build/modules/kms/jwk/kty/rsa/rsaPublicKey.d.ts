import { KmsJwkPublicRsa } from './rsaJwk';
export declare function rsaPublicJwkToPublicKey(publicJwk: KmsJwkPublicRsa): {
    modulus: Uint8Array<ArrayBuffer>;
    exponent: Uint8Array<ArrayBuffer>;
};
export declare function rsaPublicKeyToPublicJwk(options: {
    modulus: Uint8Array;
    exponent: Uint8Array;
}): KmsJwkPublicRsa;
