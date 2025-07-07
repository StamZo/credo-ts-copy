import type { AgentContext } from '../../../../agent';
import type { DidRegistrar } from '../../domain/DidRegistrar';
import type { DidCreateOptions, DidCreateResult, DidDeactivateResult, DidUpdateResult } from '../../types';
import { XOR } from '../../../../types';
import { KmsCreateKeyOptions, KmsCreateKeyTypeAssymetric } from '../../../kms';
export declare class KeyDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    create(agentContext: AgentContext, options: KeyDidCreateOptions): Promise<DidCreateResult>;
    update(): Promise<DidUpdateResult>;
    deactivate(): Promise<DidDeactivateResult>;
}
export interface KeyDidCreateOptions extends DidCreateOptions {
    method: 'key';
    did?: never;
    didDocument?: never;
    secret?: never;
    /**
     * You can create a did:key based on an existing `keyId`, or provide `createKey` options
     * to create a new key.
     */
    options: XOR<{
        createKey: KmsCreateKeyOptions<KmsCreateKeyTypeAssymetric>;
    }, {
        keyId: string;
    }>;
}
export type KeyDidUpdateOptions = never;
export type KeyDidDeactivateOptions = never;
