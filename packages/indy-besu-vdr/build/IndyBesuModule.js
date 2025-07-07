"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuModule = void 0;
const IndyBesuModuleConfig_1 = require("./IndyBesuModuleConfig");
const ledger_1 = require("./ledger");
const indy2_vdr_1 = require("indy2-vdr");
class IndyBesuModule {
    constructor(options) {
        this.config = new IndyBesuModuleConfig_1.IndyBesuModuleConfig(options);
    }
    register(dependencyManager) {
        // Only create the client if not in mock mode
        if (!this.config.skipBlockchainWrites) {
            const client = new indy2_vdr_1.LedgerClient(this.config.chainId, this.config.nodeAddress, [ledger_1.DidRegistry.config, ledger_1.SchemaRegistry.config, ledger_1.CredentialDefinitionRegistry.config], null);
            dependencyManager.registerInstance(indy2_vdr_1.LedgerClient, client);
        }
        else {
            // Register a mock client for testing
            dependencyManager.registerInstance(indy2_vdr_1.LedgerClient, this.createMockClient());
        }
        dependencyManager.registerSingleton(ledger_1.DidRegistry);
        dependencyManager.registerSingleton(ledger_1.SchemaRegistry);
        dependencyManager.registerSingleton(ledger_1.CredentialDefinitionRegistry);
    }
    async initialize(agentContext) {
        agentContext.config.logger.info('Initializing IndyBesuModule...');
        if (this.config.skipBlockchainWrites) {
            agentContext.config.logger.info('Running in mock mode - skipping blockchain connectivity check');
            return;
        }
        try {
            const client = agentContext.dependencyManager.resolve(indy2_vdr_1.LedgerClient);
            // Test connection with timeout
            const pingPromise = client.ping();
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Blockchain ping timed out after ${this.config.connectionTimeoutMs}ms`));
                }, this.config.connectionTimeoutMs);
            });
            await Promise.race([pingPromise, timeoutPromise]);
            agentContext.config.logger.info('Blockchain connection successful');
        }
        catch (error) {
            agentContext.config.logger.warn(`Blockchain connection failed: ${error.message}`);
            if (this.config.failOnConnectionError) {
                throw error;
            }
            agentContext.config.logger.warn('Continuing without blockchain connection...');
        }
    }
    createMockClient() {
        return {
            ping: async () => ({ status: 'mock', timestamp: Date.now() }),
            submitTransaction: async () => new Uint8Array([1, 2, 3, 4]), // Mock transaction hash
            getReceipt: async () => ({ status: 'success', blockNumber: 1 }),
            queryEvents: async () => []
        };
    }
}
exports.IndyBesuModule = IndyBesuModule;
//# sourceMappingURL=IndyBesuModule.js.map