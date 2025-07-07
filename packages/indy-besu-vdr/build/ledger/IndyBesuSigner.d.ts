import { Transaction } from 'indy2-vdr';
export declare class IndyBesuSigner {
    readonly address: string;
    private readonly signingKey;
    constructor(secretKey: Uint8Array);
    signTransaction(transaction: Transaction): void;
}
