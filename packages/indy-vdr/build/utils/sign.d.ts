import { AgentContext, Kms } from '@credo-ts/core';
import type { IndyVdrRequest } from '@hyperledger/indy-vdr-shared';
import type { IndyVdrPool } from '../pool';
export declare function multiSignRequest<Request extends IndyVdrRequest>(agentContext: AgentContext, request: Request, signingKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>, identifier: string): Promise<Request>;
export declare function signRequest<Request extends IndyVdrRequest>(agentContext: AgentContext, pool: IndyVdrPool, request: Request, submitterDid: string): Promise<Request>;
