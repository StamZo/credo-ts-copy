import type { AgentContext } from '@credo-ts/core';
import type { VerifyProofOptions, VerifyW3cPresentationOptions } from './AnonCredsVerifierServiceOptions';
export declare const AnonCredsVerifierServiceSymbol: unique symbol;
export interface AnonCredsVerifierService {
    verifyProof(agentContext: AgentContext, options: VerifyProofOptions): Promise<boolean>;
    verifyW3cPresentation(agentContext: AgentContext, options: VerifyW3cPresentationOptions): Promise<boolean>;
}
