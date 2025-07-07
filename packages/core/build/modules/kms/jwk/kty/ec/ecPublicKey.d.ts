import { CurveParams } from 'ec-compression';
import { KmsJwkPublicEc } from './ecJwk';
export declare const ecCrvToCurveParams: Record<KmsJwkPublicEc['crv'], CurveParams>;
export declare function ecPublicJwkToPublicKey(publicJwk: KmsJwkPublicEc, { compressed }?: {
    compressed?: boolean;
}): Uint8Array;
export declare function ecPublicKeyToPublicJwk<Crv extends KmsJwkPublicEc['crv']>(publicKey: Uint8Array, crv: Crv): {
    kty: "EC";
    crv: Crv;
    x: string;
    y: string;
};
