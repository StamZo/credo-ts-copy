import { AgentContext, DidResolutionResult, DidResolver } from '@credo-ts/core';
export declare class IndyBesuDidResolver implements DidResolver {
    readonly supportedMethods: string[];
    readonly allowsCaching = false;
    resolve(agentContext: AgentContext, did: string): Promise<DidResolutionResult>;
    private updateContext;
}
