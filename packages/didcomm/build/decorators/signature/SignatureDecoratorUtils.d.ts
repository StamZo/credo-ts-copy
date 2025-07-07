import type { AgentContext } from '@credo-ts/core';
import { Kms } from '@credo-ts/core';
import { SignatureDecorator } from './SignatureDecorator';
/**
 * Unpack and verify signed data before casting it to the supplied type.
 *
 * @param decorator Signature decorator to unpack and verify
 * @param wallet wallet instance
 *
 * @return Resulting data
 */
export declare function unpackAndVerifySignatureDecorator(agentContext: AgentContext, decorator: SignatureDecorator): Promise<Record<string, unknown>>;
/**
 * Sign data supplied and return a signature decorator.
 *
 * @param data the data to sign
 * @param wallet the wallet containing a key to use for signing
 * @param signerKey signer key
 *
 * @returns Resulting signature decorator.
 */
export declare function signData(agentContext: AgentContext, data: unknown, signerKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>): Promise<SignatureDecorator>;
