import { PublicJwk, X25519PublicJwk } from '../../../kms';
import { VerificationMethod } from './VerificationMethod';
export declare const VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019 = "X25519KeyAgreementKey2019";
type X25519KeyAgreementKey2019 = VerificationMethod & {
    type: typeof VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019;
};
/**
 * Get a X25519KeyAgreementKey2019 verification method.
 */
export declare function getX25519KeyAgreementKey2019({ publicJwk, id, controller, }: {
    id: string;
    publicJwk: PublicJwk<X25519PublicJwk>;
    controller: string;
}): VerificationMethod;
/**
 * Check whether a verification method is a X25519KeyAgreementKey2019 verification method.
 */
export declare function isX25519KeyAgreementKey2019(verificationMethod: VerificationMethod): verificationMethod is X25519KeyAgreementKey2019;
/**
 * Get a key from a X25519KeyAgreementKey2019 verification method.
 */
export declare function getPublicJwkFrommX25519KeyAgreementKey2019(verificationMethod: X25519KeyAgreementKey2019): PublicJwk<X25519PublicJwk>;
export {};
