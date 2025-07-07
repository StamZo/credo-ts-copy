import { Ed25519PublicJwk, PublicJwk } from '../../../kms';
import { VerificationMethod } from './VerificationMethod';
export declare const VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020 = "Ed25519VerificationKey2020";
type Ed25519VerificationKey2020 = VerificationMethod & {
    type: typeof VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2020;
};
/**
 * Get a Ed25519VerificationKey2020 verification method.
 */
export declare function getEd25519VerificationKey2020({ publicJwk, id, controller, }: {
    id: string;
    publicJwk: PublicJwk<Ed25519PublicJwk>;
    controller: string;
}): VerificationMethod;
/**
 * Check whether a verification method is a Ed25519VerificationKey2020 verification method.
 */
export declare function isEd25519VerificationKey2020(verificationMethod: VerificationMethod): verificationMethod is Ed25519VerificationKey2020;
/**
 * Get a key from a Ed25519VerificationKey2020 verification method.
 */
export declare function getPublicJwkFromEd25519VerificationKey2020(verificationMethod: Ed25519VerificationKey2020): PublicJwk<Ed25519PublicJwk | import("../../../kms").P256PublicJwk | import("../../../kms").P384PublicJwk | import("../../../kms").P521PublicJwk | import("../../../kms").RsaPublicJwk | import("../../../kms").Secp256k1PublicJwk | import("../../../kms").X25519PublicJwk>;
export {};
