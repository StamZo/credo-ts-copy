"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuModuleConfig = void 0;
class IndyBesuModuleConfig {
    constructor(options) {
        this.chainId = options.chainId;
        this.nodeAddress = options.nodeAddress;
        // Default contract addresses for local development
        this.didRegistryAddress = options.didRegistryAddress || '0x0000000000000000000000000000000000018888';
        this.schemaRegistryAddress = options.schemaRegistryAddress || '0x0000000000000000000000000000000000005555';
        this.credentialDefinitionRegistryAddress =
            options.credentialDefinitionRegistryAddress || '0x0000000000000000000000000000000000004444';
        // Configuration options
        this.skipBlockchainWrites = options.skipBlockchainWrites || false;
        this.transactionTimeoutMs = options.transactionTimeoutMs || 30000;
        this.connectionTimeoutMs = options.connectionTimeoutMs || 10000;
        this.failOnConnectionError = options.failOnConnectionError || false;
        this.gasLimit = options.gasLimit || 1000000;
        this.maxRetries = options.maxRetries || 3;
    }
}
exports.IndyBesuModuleConfig = IndyBesuModuleConfig;
//# sourceMappingURL=IndyBesuModuleConfig.js.map