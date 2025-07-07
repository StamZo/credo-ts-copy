import { BaseContract } from './BaseContract';
import { LedgerClient } from 'indy2-vdr';
import { IndyBesuSigner } from '../IndyBesuSigner';
export declare class SchemaRegistry extends BaseContract {
    static readonly config: {
        address: string;
        spec: any;
    };
    constructor(client: LedgerClient);
    createSchema(id: string, schema: any, signer: IndyBesuSigner): Promise<any>;
    resolveSchema(id: string): Promise<any>;
}
