import type { ResolvedDidCommService } from '../../../../types';
import { DidDocumentKey } from '../../DidsApiOptions';
import { DidDocument } from '../../domain';
export declare function createPeerDidDocumentFromServices<WithKeys extends boolean>(services: ResolvedDidCommService[], withKeys: WithKeys): {
    didDocument: DidDocument;
    keys: WithKeys extends true ? DidDocumentKey[] : undefined;
};
