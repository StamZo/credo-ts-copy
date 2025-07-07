import { PublicJwk } from '../../../kms';
export declare class DidKey {
    readonly publicJwk: PublicJwk;
    constructor(publicJwk: PublicJwk);
    static fromDid(did: string): DidKey;
    get did(): string;
    get didDocument(): import("../..").DidDocument;
}
