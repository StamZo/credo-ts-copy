export interface IndyBesuModuleConfigOptions {
  chainId: number
  nodeAddress: string
  didRegistryAddress?: string
  schemaRegistryAddress?: string
  credentialDefinitionRegistryAddress?: string
  skipBlockchainWrites?: boolean // New option for testing
  transactionTimeoutMs?: number // Configurable timeout
}

export class IndyBesuModuleConfig {
  public readonly chainId!: number
  public readonly nodeAddress!: string
  public readonly didRegistryAddress: string
  public readonly schemaRegistryAddress: string
  public readonly credentialDefinitionRegistryAddress: string
  public readonly skipBlockchainWrites: boolean
  public readonly transactionTimeoutMs: number

  constructor(options: IndyBesuModuleConfigOptions) {
    this.chainId = options.chainId
    this.nodeAddress = options.nodeAddress
    
    // Default contract addresses for local development
    this.didRegistryAddress = options.didRegistryAddress || '0x0000000000000000000000000000000000018888'
    this.schemaRegistryAddress = options.schemaRegistryAddress || '0x0000000000000000000000000000000000005555'
    this.credentialDefinitionRegistryAddress = 
      options.credentialDefinitionRegistryAddress || '0x0000000000000000000000000000000000004444'
    
    // New options
    this.skipBlockchainWrites = options.skipBlockchainWrites || false
    this.transactionTimeoutMs = options.transactionTimeoutMs || 30000
  }
}