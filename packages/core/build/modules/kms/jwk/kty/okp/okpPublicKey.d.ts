import { KmsJwkPublicOkp } from './okpJwk';
export declare function okpPublicJwkToPublicKey(publicJwk: KmsJwkPublicOkp): Uint8Array;
export declare function okpPublicKeyToPublicJwk<Curve extends KmsJwkPublicOkp['crv']>(publicKey: Uint8Array, crv: Curve): {
    kty: "OKP";
    crv: Curve;
    x: string;
};
