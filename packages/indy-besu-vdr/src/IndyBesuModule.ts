// packages/indy-besu-vdr/src/IndyBesuModule.ts
import { AgentContext, DependencyManager, Module } from '@credo-ts/core'
import { IndyBesuModuleConfig, IndyBesuModuleConfigOptions } from './IndyBesuModuleConfig'
import { CredentialDefinitionRegistry, DidRegistry, SchemaRegistry } from './ledger'
import { LedgerClient } from 'indy2-vdr'

export class IndyBesuModule implements Module {
  public readonly config: IndyBesuModuleConfig

  public constructor(options: IndyBesuModuleConfigOptions) {
    this.config = new IndyBesuModuleConfig(options)
  }

  public register(dependencyManager: DependencyManager) {
    // Only create the client if not in mock mode
    if (!this.config.skipBlockchainWrites) {
      const client = new LedgerClient(
        this.config.chainId,
        this.config.nodeAddress,
        [DidRegistry.config, SchemaRegistry.config, CredentialDefinitionRegistry.config],
        null
      )
      dependencyManager.registerInstance(LedgerClient, client)
    } else {
      // Register a mock client for testing
      dependencyManager.registerInstance(LedgerClient, this.createMockClient())
    }

    dependencyManager.registerSingleton(DidRegistry)
    dependencyManager.registerSingleton(SchemaRegistry)
    dependencyManager.registerSingleton(CredentialDefinitionRegistry)
  }

  public async initialize(agentContext: AgentContext): Promise<void> {
    agentContext.config.logger.info('Initializing IndyBesuModule...')
    
    if (this.config.skipBlockchainWrites) {
      agentContext.config.logger.info('Running in mock mode - skipping blockchain connectivity check')
      return
    }
    
    try {
      const client = agentContext.dependencyManager.resolve(LedgerClient)
      
      // Test connection with timeout
      const pingPromise = client.ping()
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Blockchain ping timed out after ${this.config.connectionTimeoutMs}ms`))
        }, this.config.connectionTimeoutMs)
      })
      
      await Promise.race([pingPromise, timeoutPromise])
      agentContext.config.logger.info('Blockchain connection successful')
      
    } catch (error: any) {
      agentContext.config.logger.warn(`Blockchain connection failed: ${error.message}`)
      
      if (this.config.failOnConnectionError) {
        throw error
      }
      
      agentContext.config.logger.warn('Continuing without blockchain connection...')
    }
  }

  private createMockClient(): any {
    return {
      ping: async () => ({ status: 'mock', timestamp: Date.now() }),
      submitTransaction: async () => new Uint8Array([1, 2, 3, 4]), // Mock transaction hash
      getReceipt: async () => ({ status: 'success', blockNumber: 1 }),
      queryEvents: async () => []
    }
  }
}