import { Ed25519PublicJwk, PublicJwk } from '../../../kms';
import { VerificationMethod } from './VerificationMethod';
export declare const VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018 = "Ed25519VerificationKey2018";
type Ed25519VerificationKey2018 = VerificationMethod & {
    type: typeof VERIFICATION_METHOD_TYPE_ED25519_VERIFICATION_KEY_2018;
};
/**
 * Get a Ed25519VerificationKey2018 verification method.
 */
export declare function getEd25519VerificationKey2018({ publicJwk, id, controller, }: {
    id: string;
    publicJwk: PublicJwk<Ed25519PublicJwk>;
    controller: string;
}): VerificationMethod;
/**
 * Check whether a verification method is a Ed25519VerificationKey2018 verification method.
 */
export declare function isEd25519VerificationKey2018(verificationMethod: VerificationMethod): verificationMethod is Ed25519VerificationKey2018;
/**
 * Get a key from a Ed25519VerificationKey2018 verification method.
 */
/**
 * Get a public jwk from a Ed25519VerificationKey2018 verification method.
 */
export declare function getPublicJwkFromEd25519VerificationKey2018(verificationMethod: Ed25519VerificationKey2018): PublicJwk<Ed25519PublicJwk>;
export {};
