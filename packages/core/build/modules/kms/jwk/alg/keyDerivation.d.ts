import type { KnownJwaKeyAgreementAlgorithm } from '../jwa';
import type { KmsJwkPrivate, KmsJwkPublic } from '../knownJwk';
import type { KmsJwkPublicOct } from '../kty/oct/octJwk';
export declare function supportedKeyDerivationAlgsForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): KnownJwaKeyAgreementAlgorithm[];
/**
 * Get the allowed key derivation algs for a key. If takes all the known supported
 * algs and will filter these based on the optional `alg` key in the JWK.
 *
 * This does not handle the intended key `use` and `key_ops`.
 */
export declare function allowedKeyDerivationAlgsForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): KnownJwaKeyAgreementAlgorithm[];
export declare function assertAllowedKeyDerivationAlgForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>, algorithm: KnownJwaKeyAgreementAlgorithm): void;
