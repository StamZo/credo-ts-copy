import type { AgentContext } from '../../../../agent';
import type { DidRegistrar } from '../../domain/DidRegistrar';
import type { DidCreateOptions, DidCreateResult, DidDeactivateResult, DidUpdateResult } from '../../types';
import { DidDocument } from '../../domain';
import { XOR } from '../../../../types';
import { KmsCreateKeyOptions, KmsCreateKeyTypeAssymetric } from '../../../kms';
import { DidDocumentKey } from '../../DidsApiOptions';
import { PeerDidNumAlgo } from './didPeer';
export declare class PeerDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    create(agentContext: AgentContext, options: PeerDidNumAlgo0CreateOptions | PeerDidNumAlgo1CreateOptions | PeerDidNumAlgo2CreateOptions | PeerDidNumAlgo4CreateOptions): Promise<DidCreateResult>;
    update(): Promise<DidUpdateResult>;
    deactivate(): Promise<DidDeactivateResult>;
}
export type PeerDidCreateOptions = PeerDidNumAlgo0CreateOptions | PeerDidNumAlgo1CreateOptions | PeerDidNumAlgo2CreateOptions | PeerDidNumAlgo4CreateOptions;
export interface PeerDidNumAlgo0CreateOptions extends DidCreateOptions {
    method: 'peer';
    did?: never;
    didDocument?: never;
    options: {
        numAlgo: PeerDidNumAlgo.InceptionKeyWithoutDoc;
    } & XOR<{
        createKey: KmsCreateKeyOptions<KmsCreateKeyTypeAssymetric>;
    }, {
        keyId: string;
    }>;
    secret?: never;
}
export interface PeerDidNumAlgo1CreateOptions extends DidCreateOptions {
    method: 'peer';
    did?: never;
    didDocument: DidDocument;
    options: {
        numAlgo: PeerDidNumAlgo.GenesisDoc;
        /**
         * The linking between the did document keys and the kms keys. If you want to use
         * the DID within Credo you MUST add the key here. All keys must be present in the did
         * document, but not all did document keys must be present in this array, to allow for keys
         * that are not controleld by this agent.
         */
        keys: DidDocumentKey[];
    };
    secret?: never;
}
export interface PeerDidNumAlgo2CreateOptions extends DidCreateOptions {
    method: 'peer';
    did?: never;
    didDocument: DidDocument;
    options: {
        numAlgo: PeerDidNumAlgo.MultipleInceptionKeyWithoutDoc;
        /**
         * The linking between the did document keys and the kms keys. If you want to use
         * the DID within Credo you MUST add the key here. All keys must be present in the did
         * document, but not all did document keys must be present in this array, to allow for keys
         * that are not controleld by this agent.
         */
        keys: DidDocumentKey[];
    };
    secret?: never;
}
export interface PeerDidNumAlgo4CreateOptions extends DidCreateOptions {
    method: 'peer';
    did?: never;
    didDocument: DidDocument;
    options: {
        numAlgo: PeerDidNumAlgo.ShortFormAndLongForm;
        /**
         * The linking between the did document keys and the kms keys. If you want to use
         * the DID within Credo you MUST add the key here. All keys must be present in the did
         * document, but not all did document keys must be present in this array, to allow for keys
         * that are not controleld by this agent.
         */
        keys: DidDocumentKey[];
    };
    secret?: never;
}
export type PeerDidUpdateOptions = never;
export type PeerDidDeactivateOptions = never;
