import type { KnownJwaSignatureAlgorithm } from '../jwa';
import type { KmsJwkPrivate, KmsJwkPublic } from '../knownJwk';
import type { KmsJwkPublicOct } from '../kty/oct/octJwk';
import { KmsCreateKeyType } from '../../options';
/**
 * Get the allowed algs for a signing key. If takes all the known supported
 * algs and will filter these based on the optional `alg` key in the JWK.
 *
 * This does not handle the intended key `use` and `key_ops`.
 */
export declare function allowedSigningAlgsForSigningKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): KnownJwaSignatureAlgorithm[];
export declare function assertAllowedSigningAlgForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>, algorithm: KnownJwaSignatureAlgorithm): void;
export declare function supportedSigningAlgsForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): KnownJwaSignatureAlgorithm[];
export declare function createKeyTypeForSigningAlgorithm(algorithm: KnownJwaSignatureAlgorithm): KmsCreateKeyType;
