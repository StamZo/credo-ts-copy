import type { KmsJwkPrivate, KmsJwkPublic } from './knownJwk';
/**
 * Gets text description of a key.
 *
 * - `EC key with crv '<crv>'`
 * - `RSA key with bith length <bitLength>
 * - `oct key`
 * - `'<kty>' key`
 */
export declare function getJwkHumanDescription(jwk: KmsJwkPrivate | KmsJwkPublic): string;
