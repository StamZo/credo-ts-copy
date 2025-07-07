import { BaseContract } from './BaseContract';
import { LedgerClient } from 'indy2-vdr';
import { IndyBesuSigner } from '../IndyBesuSigner';
export declare class DidRegistry extends BaseContract {
    static readonly config: {
        address: string;
        spec: any;
    };
    constructor(client: LedgerClient);
    addDelegate(id: string, delegateType: string, delegate: string, validity: bigint, signer: IndyBesuSigner): Promise<any>;
    setAttribute(id: string, attribute: any, validity: bigint, signer: IndyBesuSigner): Promise<any>;
    resolveDid(id: string): Promise<any>;
}
