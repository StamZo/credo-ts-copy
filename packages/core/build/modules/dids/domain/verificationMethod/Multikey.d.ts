import type { VerificationMethod } from './VerificationMethod';
import { PublicJwk } from '../../../kms';
export declare const VERIFICATION_METHOD_TYPE_MULTIKEY = "Multikey";
type GetMultikeyOptions = {
    did: string;
    publicJwk: PublicJwk;
    verificationMethodId?: string;
};
/**
 * Get a Multikey verification method.
 */
export declare function getMultikey({ did, publicJwk, verificationMethodId }: GetMultikeyOptions): {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
};
/**
 * Check whether a verification method is a Multikey verification method.
 */
export declare function isMultikey(verificationMethod: VerificationMethod): verificationMethod is VerificationMethod & {
    type: 'Multikey';
};
/**
 * Get a public jwk from a Multikey verification method.
 */
export declare function getPublicJwkFromMultikey(verificationMethod: VerificationMethod & {
    type: 'Multikey';
}): PublicJwk<import("../../../kms").Ed25519PublicJwk | import("../../../kms").P256PublicJwk | import("../../../kms").P384PublicJwk | import("../../../kms").P521PublicJwk | import("../../../kms").RsaPublicJwk | import("../../../kms").Secp256k1PublicJwk | import("../../../kms").X25519PublicJwk>;
export {};
