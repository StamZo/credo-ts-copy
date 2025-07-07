import type { AgentContext, DidCreateOptions, DidCreateResult, DidDeactivateResult, DidDocument, DidDocumentKey, DidDocumentService, DidOperationStateActionBase, DidRegistrar, DidUpdateResult } from '@credo-ts/core';
import { Kms } from '@credo-ts/core';
export declare class IndyVdrIndyDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    private didCreateActionResult;
    private didCreateFailedResult;
    private didCreateFinishedResult;
    parseInput(agentContext: AgentContext, options: IndyVdrDidCreateOptions): Promise<ParseInputResult>;
    saveDidRecord(agentContext: AgentContext, did: string, didDocument: DidDocument, keys: DidDocumentKey[]): Promise<void>;
    private createDidDocument;
    create(agentContext: AgentContext, options: IndyVdrDidCreateOptions): Promise<IndyVdrDidCreateResult>;
    update(): Promise<DidUpdateResult>;
    deactivate(): Promise<DidDeactivateResult>;
    private createRegisterDidWriteRequest;
    private registerPublicDid;
    private createSetDidEndpointsRequest;
    private setEndpointsForDid;
}
interface IndyVdrDidCreateOptionsWithoutDid extends DidCreateOptions {
    didDocument?: never;
    did?: never;
    method: 'indy';
    options: {
        /**
         * Optionally an existing keyId can be provided, in this case the did will be created
         * based on the existing key
         */
        keyId?: string;
        alias?: string;
        role?: NymRequestRole;
        services?: DidDocumentService[];
        useEndpointAttrib?: boolean;
        endorserDid: string;
        endorserMode: 'internal' | 'external';
        endorsedTransaction?: never;
    };
}
interface IndyVdrDidCreateOptionsForSubmission extends DidCreateOptions {
    didDocument?: never;
    did: string;
    method?: never;
    options: {
        endorserMode: 'external';
        endorsedTransaction: {
            nymRequest: string;
            attribRequest?: string;
        };
    };
}
export type IndyVdrDidCreateOptions = IndyVdrDidCreateOptionsWithoutDid | IndyVdrDidCreateOptionsForSubmission;
type ParseInputOkEndorsedTransaction = {
    status: 'ok';
    did: string;
    type: 'endorsedTransaction';
    endorsedTransaction: IndyVdrDidCreateOptionsForSubmission['options']['endorsedTransaction'];
    namespaceIdentifier: string;
    namespace: string;
    endorserNamespaceIdentifier: string;
};
type ParseInputOkCreate = {
    status: 'ok';
    type: 'create';
    did: string;
    verificationKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    namespaceIdentifier: string;
    namespace: string;
    endorserNamespaceIdentifier: string;
    endorserDid: string;
    alias?: string;
    role?: NymRequestRole;
    services?: DidDocumentService[];
    useEndpointAttrib?: boolean;
};
type parseInputError = {
    status: 'error';
    reason: string;
};
type ParseInputResult = ParseInputOkEndorsedTransaction | ParseInputOkCreate | parseInputError;
export interface EndorseDidTxAction extends DidOperationStateActionBase {
    action: 'endorseIndyTransaction';
    endorserDid: string;
    nymRequest: string;
    attribRequest?: string;
    did: string;
}
export type IndyVdrDidCreateResult = DidCreateResult<EndorseDidTxAction>;
export type NymRequestRole = 'STEWARD' | 'TRUSTEE' | 'ENDORSER' | 'NETWORK_MONITOR';
export {};
