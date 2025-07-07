import { AgentContext, DidPurpose, Kms } from '@credo-ts/core';
import type { JwtSigner, JwtSignerX5c } from '@openid4vc/oauth2';
import type { OpenId4VcJwtIssuer } from './models';
/**
 * Returns the JWA Signature Algorithms that are supported by the wallet.
 */
export declare function getSupportedJwaSignatureAlgorithms(agentContext: AgentContext): Kms.KnownJwaSignatureAlgorithm[];
export declare function getPublicJwkFromDid(agentContext: AgentContext, didUrl: string, allowedPurposes?: DidPurpose[]): Promise<Kms.PublicJwk<import("@credo-ts/core/src/modules/kms/jwk/PublicJwk").SupportedPublicJwk>>;
export declare function requestSignerToJwtIssuer(agentContext: AgentContext, requestSigner: OpenId4VcJwtIssuer): Promise<Exclude<JwtSigner, JwtSignerX5c> | (JwtSignerX5c & {
    issuer: string;
})>;
export declare function getProofTypeFromPublicJwk(agentContext: AgentContext, key: Kms.PublicJwk): string;
export declare function addSecondsToDate(date: Date, seconds: number): Date;
export declare function dateToSeconds(date: Date): number;
export declare function parseIfJson<T>(input: T): T | Record<string, unknown>;
