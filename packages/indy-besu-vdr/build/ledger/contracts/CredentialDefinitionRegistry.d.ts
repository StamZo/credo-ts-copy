import { LedgerClient } from 'indy2-vdr';
import { BaseContract } from './BaseContract';
import { IndyBesuSigner } from '../IndyBesuSigner';
export declare class CredentialDefinitionRegistry extends BaseContract {
    static readonly config: {
        address: string;
        spec: any;
    };
    constructor(client: LedgerClient);
    createCredentialDefinition(id: string, credDef: any, signer: IndyBesuSigner): Promise<any>;
    resolveCredentialDefinition(id: string): Promise<any>;
}
