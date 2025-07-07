export interface IndyBesuModuleConfigOptions {
    chainId: number;
    nodeAddress: string;
    didRegistryAddress?: string;
    schemaRegistryAddress?: string;
    credentialDefinitionRegistryAddress?: string;
    skipBlockchainWrites?: boolean;
    transactionTimeoutMs?: number;
    connectionTimeoutMs?: number;
    failOnConnectionError?: boolean;
    gasLimit?: number;
    maxRetries?: number;
}
export declare class IndyBesuModuleConfig {
    readonly chainId: number;
    readonly nodeAddress: string;
    readonly didRegistryAddress: string;
    readonly schemaRegistryAddress: string;
    readonly credentialDefinitionRegistryAddress: string;
    readonly skipBlockchainWrites: boolean;
    readonly transactionTimeoutMs: number;
    readonly connectionTimeoutMs: number;
    readonly failOnConnectionError: boolean;
    readonly gasLimit: number;
    readonly maxRetries: number;
    constructor(options: IndyBesuModuleConfigOptions);
}
