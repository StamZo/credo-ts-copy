import { PublicJwk, Secp256k1PublicJwk } from '../../../kms';
import { VerificationMethod } from './VerificationMethod';
export declare const VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019 = "EcdsaSecp256k1VerificationKey2019";
type EcdsaSecp256k1VerificationKey2019 = VerificationMethod & {
    type: typeof VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019;
};
/**
 * Get a EcdsaSecp256k1VerificationKey2019 verification method.
 */
export declare function getEcdsaSecp256k1VerificationKey2019({ publicJwk, id, controller, }: {
    id: string;
    publicJwk: PublicJwk<Secp256k1PublicJwk>;
    controller: string;
}): VerificationMethod;
/**
 * Check whether a verification method is a EcdsaSecp256k1VerificationKey2019 verification method.
 */
export declare function isEcdsaSecp256k1VerificationKey2019(verificationMethod: VerificationMethod): verificationMethod is EcdsaSecp256k1VerificationKey2019;
/**
 * Get a public jwk from a EcdsaSecp256k1VerificationKey2019 verification method.
 */
export declare function getPublicJwkFromEcdsaSecp256k1VerificationKey2019(verificationMethod: EcdsaSecp256k1VerificationKey2019): PublicJwk<Secp256k1PublicJwk>;
export {};
