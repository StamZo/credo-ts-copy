import { CheqdNetwork, DidStdFee } from '@cheqd/sdk';
import { AgentContext, DidCreateOptions, DidCreateResult, DidDeactivateResult, DidDocumentKey, DidRegistrar, DidUpdateOptions, DidUpdateResult, Kms, XOR } from '@credo-ts/core';
import { MethodSpecificIdAlgo } from '@cheqd/sdk';
import { MsgCreateResourcePayload } from '@cheqd/ts-proto/cheqd/resource/v2';
import { DidDocument } from '@credo-ts/core';
export declare class CheqdDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    private contextMapping;
    private collectAllContexts;
    create(agentContext: AgentContext, options: CheqdDidCreateOptions): Promise<DidCreateResult>;
    update(agentContext: AgentContext, options: CheqdDidUpdateOptions): Promise<DidUpdateResult>;
    deactivate(agentContext: AgentContext, options: CheqdDidDeactivateOptions): Promise<DidDeactivateResult>;
    createResource(agentContext: AgentContext, did: string, resource: CheqdCreateResourceOptions): Promise<{
        resourceMetadata: {};
        resourceRegistrationMetadata: {};
        resourceState: {
            state: string;
            reason: string;
            resourceId?: undefined;
            resource?: undefined;
        };
    } | {
        resourceMetadata: {};
        resourceRegistrationMetadata: {};
        resourceState: {
            state: string;
            resourceId: string;
            resource: MsgCreateResourcePayload;
            reason?: undefined;
        };
    }>;
    private signPayload;
}
type KmsCreateKeyOptionsOkpEd25519 = Kms.KmsCreateKeyOptions<Kms.KmsCreateKeyTypeOkp & {
    crv: 'Ed25519';
}>;
export interface CheqdDidCreateWithoutDidDocumentOptions extends DidCreateOptions {
    method: 'cheqd';
    did?: never;
    didDocument?: never;
    secret?: never;
    options: {
        network: `${CheqdNetwork}`;
        fee?: DidStdFee;
        versionId?: string;
        methodSpecificIdAlgo?: `${MethodSpecificIdAlgo}`;
    } & XOR<{
        createKey: KmsCreateKeyOptionsOkpEd25519;
    }, {
        keyId: string;
    }>;
}
export interface CheqdDidCreateFromDidDocumentOptions extends DidCreateOptions {
    method: 'cheqd';
    did?: undefined;
    didDocument: DidDocument;
    options: {
        /**
         * The linking between the did document keys and the kms keys. For cheqd dids ALL authentication entries MUST sign the request
         * and thus it is required to a mapping for all keys.
         */
        keys: DidDocumentKey[];
        fee?: DidStdFee;
        versionId?: string;
    };
}
export type CheqdDidCreateOptions = CheqdDidCreateFromDidDocumentOptions | CheqdDidCreateWithoutDidDocumentOptions;
export interface CheqdDidUpdateOptions extends DidUpdateOptions {
    did: string;
    didDocument: DidDocument;
    secret?: never;
    options?: {
        /**
         * The linking between the did document keys and the kms keys. The existing keys will be filtered based on the keys not present
         * in the did document anymore, and this new list will be merged into it.
         */
        keys?: DidDocumentKey[];
        fee?: DidStdFee;
        versionId?: string;
    } & XOR<{
        createKey?: KmsCreateKeyOptionsOkpEd25519;
    }, {
        keyId?: string;
    }>;
}
export interface CheqdDidDeactivateOptions extends DidCreateOptions {
    method: 'cheqd';
    did: string;
    options: {
        fee?: DidStdFee;
        versionId?: string;
    };
}
export interface CheqdCreateResourceOptions extends Pick<MsgCreateResourcePayload, 'id' | 'name' | 'resourceType'> {
    data: string | Uint8Array | object;
    collectionId?: MsgCreateResourcePayload['collectionId'];
    version?: MsgCreateResourcePayload['version'];
    alsoKnownAs?: MsgCreateResourcePayload['alsoKnownAs'];
}
export {};
