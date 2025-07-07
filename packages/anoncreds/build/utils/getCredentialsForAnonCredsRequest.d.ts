import type { AgentContext } from '@credo-ts/core';
import type { AnonCredsCredentialsForProofRequest, AnonCredsGetCredentialsForProofRequestOptions } from '../formats';
import type { AnonCredsProofRequest } from '../models';
export declare const getCredentialsForAnonCredsProofRequest: (agentContext: AgentContext, proofRequest: AnonCredsProofRequest, options: AnonCredsGetCredentialsForProofRequestOptions) => Promise<AnonCredsCredentialsForProofRequest>;
