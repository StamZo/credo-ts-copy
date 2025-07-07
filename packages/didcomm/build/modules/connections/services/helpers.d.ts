import { AgentContext, DidDocumentKey, Kms, PeerDidNumAlgo, ResolvedDidCommService } from '@credo-ts/core';
import type { Routing } from '../../../models';
import type { DidDoc } from '../models';
import { OutOfBandDidCommService } from '../../oob/domain/OutOfBandDidCommService';
import { OutOfBandInlineServiceKey } from '../../oob/repository/OutOfBandRecord';
export declare function convertToNewDidDocument(didDoc: DidDoc, keys?: DidDocumentKey[]): {
    didDocument: import("@credo-ts/core").DidDocument;
    keys: {
        didDocumentRelativeKeyId: string;
        kmsKeyId: string;
    }[] | undefined;
};
export declare function routingToServices(routing: Routing): ResolvedDidCommService[];
/**
 * Asserts that the keys we are going to use for creating a did document haven't already been used in another did document
 * Due to how DIDComm v1 works (only reference the key not the did in encrypted message) we can't have multiple dids containing
 * the same key as we won't know which did (and thus which connection) a message is intended for.
 */
export declare function assertNoCreatedDidExistsForKeys(agentContext: AgentContext, recipientKeys: Kms.PublicJwk[]): Promise<void>;
export declare function createPeerDidFromServices(agentContext: AgentContext, services: ResolvedDidCommService[], numAlgo: PeerDidNumAlgo): Promise<{
    keys: DidDocumentKey[] | undefined;
    didDocument: import("@credo-ts/core").DidDocument;
}>;
export declare function getResolvedDidcommServiceWithSigningKeyId(outOfBandDidcommService: OutOfBandDidCommService, 
/**
 * Optional keys for the inline services
 */
inlineServiceKeys?: OutOfBandInlineServiceKey[]): ResolvedDidCommService;
