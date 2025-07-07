import type { KnownJwaContentEncryptionAlgorithm, KnownJwaKeyEncryptionAlgorithm } from '../jwa';
import type { KmsJwkPrivate, KmsJwkPublic } from '../knownJwk';
import type { KmsJwkPublicOct } from '../kty/oct/octJwk';
export declare function supportedEncryptionAlgsForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): ("A128GCM" | "A192GCM" | "A256GCM" | "A128CBC" | "A256CBC" | "C20P" | "XC20P" | "XSALSA20-POLY1305" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512" | "A128KW" | "A192KW" | "A256KW")[];
/**
 * Get the allowed content encryption algs for a key. If takes all the known supported
 * algs and will filter these based on the optional `alg` key in the JWK.
 *
 * This does not handle the intended key `use` and `key_ops`.
 */
export declare function allowedEncryptionAlgsForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>): Array<KnownJwaContentEncryptionAlgorithm | KnownJwaKeyEncryptionAlgorithm>;
export declare function assertAllowedEncryptionAlgForKey(jwk: KmsJwkPrivate | Exclude<KmsJwkPublic, KmsJwkPublicOct>, algorithm: KnownJwaContentEncryptionAlgorithm | KnownJwaKeyEncryptionAlgorithm): void;
