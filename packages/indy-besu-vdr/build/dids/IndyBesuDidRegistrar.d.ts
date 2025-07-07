import { AgentContext, Buffer, DidCreateOptions, DidCreateResult, DidDeactivateOptions, DidDeactivateResult, DidRegistrar, DidUpdateOptions, DidUpdateResult } from '@credo-ts/core';
import { IndyBesuEndpoint, VerificationKey } from './DidUtils';
export declare class IndyBesuDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    create(agentContext: AgentContext, options: IndyBesuDidCreateOptions): Promise<DidCreateResult>;
    update(agentContext: AgentContext, options: IndyBesuDidUpdateOptions): Promise<DidUpdateResult>;
    deactivate(agentContext: AgentContext, options: IndyBesuDidDeactivateOptions): Promise<DidDeactivateResult>;
}
export interface IndyBesuDidCreateOptions extends DidCreateOptions {
    method: 'ethr';
    did?: never;
    didDocument?: never;
    options?: {
        endpoints?: IndyBesuEndpoint[];
        verificationKeys?: VerificationKey[];
    };
    secret?: {
        didPrivateKey: Buffer | Uint8Array;
    };
}
export interface IndyBesuDidUpdateOptions extends DidUpdateOptions {
    options: {
        accountKey: Buffer | Uint8Array;
    };
}
export interface IndyBesuDidDeactivateOptions extends DidDeactivateOptions {
    options: {
        accountKey: Buffer | Uint8Array;
    };
}
