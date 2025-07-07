import type { AgentContext } from '../../../../agent';
import type { DidResolver } from '../../domain/DidResolver';
import type { DidResolutionOptions, DidResolutionResult, ParsedDid } from '../../types';
export declare class WebDidResolver implements DidResolver {
    readonly supportedMethods: string[];
    readonly allowsCaching = true;
    readonly allowsLocalDidRecord = true;
    private _resolverInstance;
    private resolver;
    constructor();
    resolve(_agentContext: AgentContext, did: string, parsed: ParsedDid, didResolutionOptions: DidResolutionOptions): Promise<DidResolutionResult>;
}
