import { AgentContext, ResolvedDidCommService } from '@credo-ts/core';
import { DidRepository, DidResolverService, Kms } from '@credo-ts/core';
export declare class DidCommDocumentService {
    private didResolverService;
    private didRepository;
    constructor(didResolverService: DidResolverService, didRepository: DidRepository);
    resolveServicesFromDid(agentContext: AgentContext, did: string): Promise<ResolvedDidCommService[]>;
    resolveCreatedDidDocumentWithKeysByRecipientKey(agentContext: AgentContext, publicJwk: Kms.PublicJwk): Promise<{
        keys: import("@credo-ts/core").DidDocumentKey[] | undefined;
        didDocument: import("@credo-ts/core").DidDocument;
    }>;
}
