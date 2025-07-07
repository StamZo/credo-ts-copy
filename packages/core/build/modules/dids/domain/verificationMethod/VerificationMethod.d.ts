import { Jwk } from '../../../kms';
export interface VerificationMethodOptions {
    id: string;
    type: string;
    controller: string;
    publicKeyBase58?: string;
    publicKeyBase64?: string;
    publicKeyJwk?: Jwk;
    publicKeyHex?: string;
    publicKeyMultibase?: string;
    publicKeyPem?: string;
    blockchainAccountId?: string;
    ethereumAddress?: string;
}
export declare class VerificationMethod {
    constructor(options: VerificationMethodOptions);
    id: string;
    type: string;
    controller: string;
    publicKeyBase58?: string;
    publicKeyBase64?: string;
    publicKeyJwk?: Jwk;
    publicKeyHex?: string;
    publicKeyMultibase?: string;
    publicKeyPem?: string;
    blockchainAccountId?: string;
    ethereumAddress?: string;
}
