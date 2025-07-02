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
    const client = new LedgerClient(
      this.config.chainId,
      this.config.nodeAddress,
      [DidRegistry.config, SchemaRegistry.config, CredentialDefinitionRegistry.config],
      null
    )

    dependencyManager.registerInstance(LedgerClient, client)
    dependencyManager.registerSingleton(DidRegistry)
    dependencyManager.registerSingleton(SchemaRegistry)
    dependencyManager.registerSingleton(CredentialDefinitionRegistry)
  }

  public async initialize(agentContext: AgentContext): Promise<void> {
    console.log('🔧 IndyBesuModule.initialize() called')
    
    try {
      const client = agentContext.dependencyManager.resolve(LedgerClient)
      console.log('📦 LedgerClient resolved')
      
      console.log('📡 Testing blockchain connection with timeout...')
      
      // Add timeout to prevent hanging
      const pingPromise = client.ping()
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Blockchain ping timed out after 10 seconds'))
        }, 10000)
      })
      
      const pingResult = await Promise.race([pingPromise, timeoutPromise])
      console.log('✅ Blockchain connection successful:', pingResult)
      
    } catch (error: any) {
      console.error('❌ Blockchain connection failed:', error.message)
      
      // For now, don't fail initialization - just log the error
      // This allows the agent to start even if blockchain is temporarily unavailable
      console.warn('⚠️  Continuing without blockchain connection...')
      agentContext.config.logger.warn('IndyBesuModule: Blockchain connection failed, continuing without it', {
        error: error.message
      })
    }
  }
}