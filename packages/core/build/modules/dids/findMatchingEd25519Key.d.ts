import { Ed25519PublicJwk, PublicJwk, X25519PublicJwk } from '../kms';
import { DidDocument } from './domain/DidDocument';
import { VerificationMethod } from './domain/verificationMethod';
/**
 * Tries to find a matching Ed25519 key to the supplied X25519 key
 * @param x25519Key X25519 key
 * @param didDocument Did document containing all the keys
 * @returns a matching Ed25519 key or `undefined` (if no matching key found)
 */
export declare function findMatchingEd25519Key(x25519Key: PublicJwk<X25519PublicJwk>, didDocument: DidDocument): {
    publicJwk: PublicJwk<Ed25519PublicJwk>;
    verificationMethod: VerificationMethod;
} | undefined;
