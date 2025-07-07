import { IndyBesuSigner } from '../IndyBesuSigner';
import { LedgerClient, Transaction } from 'indy2-vdr';
import { IndyBesuModuleConfig } from '../../IndyBesuModuleConfig';
export declare class BaseContract {
    protected client: LedgerClient;
    protected config?: IndyBesuModuleConfig;
    constructor(client: LedgerClient, config?: IndyBesuModuleConfig);
    signAndSubmit(transaction: Transaction, signer: IndyBesuSigner, timeoutMs?: number): Promise<any>;
    private mockSignAndSubmit;
}
