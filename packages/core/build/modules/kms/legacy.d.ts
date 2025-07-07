import { PublicJwk } from './jwk';
/**
 * Returns the legacy key id based on the public key encoded as base58
 *
 * This is what was has been used by askar
 */
export declare function legacyKeyIdFromPublicJwk(publicJwk: PublicJwk): string;
