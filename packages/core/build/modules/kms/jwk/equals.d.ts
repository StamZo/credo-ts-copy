import { KmsJwkPrivateAsymmetric, KmsJwkPublicAsymmetric } from './knownJwk';
/**
 * Checks if two JWK public keys have matching key types
 * Supports EC, OKP, and RSA key types
 */
export declare function assymetricJwkKeyTypeMatches(first: KmsJwkPublicAsymmetric | KmsJwkPrivateAsymmetric, second: KmsJwkPublicAsymmetric | KmsJwkPrivateAsymmetric): boolean;
/**
 * Checks if two JWK public keys have matching key types
 * Supports EC, OKP, and RSA key types
 */
export declare function assertAsymmetricJwkKeyTypeMatches(first: KmsJwkPublicAsymmetric | KmsJwkPrivateAsymmetric, second: KmsJwkPublicAsymmetric | KmsJwkPrivateAsymmetric): asserts first is typeof second;
/**
 * Checks if two JWK public keys have matching key material
 * Supports EC, OKP, and RSA key types
 */
export declare function assymetricPublicJwkMatches(first: KmsJwkPublicAsymmetric, second: KmsJwkPublicAsymmetric): boolean;
