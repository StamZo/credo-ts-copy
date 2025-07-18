import { ethers } from 'ethers'

async function testBlockchainConnectivity() {
  console.log('Testing blockchain connectivity...')
  
  try {
    // Test different RPC endpoints
    const endpoints = [
      'http://localhost:8545',  // rpcnode
      'http://localhost:21001', // validator1
      'http://localhost:21002', // validator2
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\nTesting endpoint: ${endpoint}`)
        const provider = new ethers.JsonRpcProvider(endpoint)
        
        // Check if we can connect and get basic info
        const network = await provider.getNetwork()
        console.log(`✅ Connected to network:`, {
          chainId: network.chainId.toString(),
          name: network.name
        })
        
        const blockNumber = await provider.getBlockNumber()
        console.log(`✅ Latest block: ${blockNumber}`)
        
        // Check if contracts exist at expected addresses
        const contractAddresses = {
          'DID Registry': '0x0000000000000000000000000000000000018888',
          'Schema Registry': '0x0000000000000000000000000000000000005555',
          'Credential Definition Registry': '0x0000000000000000000000000000000000004444'
        }
        
        console.log('\nChecking for deployed contracts...')
        for (const [name, address] of Object.entries(contractAddresses)) {
          const code = await provider.getCode(address)
          if (code === '0x') {
            console.log(`❌ ${name} at ${address}: No contract deployed`)
          } else {
            console.log(`✅ ${name} at ${address}: Contract found (${code.length} bytes)`)
          }
        }
        
        // Test successful, use this endpoint
        return { provider, endpoint }
        
      } catch (error: any) {
        console.log(`❌ Failed to connect to ${endpoint}:`, error.message)
      }
    }
    
    throw new Error('No working RPC endpoint found')
    
  } catch (error: any) {
    console.error('❌ Blockchain connectivity test failed:', error.message)
    throw error
  }
}

async function deployContracts(provider: ethers.JsonRpcProvider) {
  console.log('\n🚀 Deploying smart contracts...')
  
  try {
    // Get accounts from the provider
    const accounts = await provider.listAccounts()
    console.log('Available accounts:', accounts.length)
    
    if (accounts.length === 0) {
      throw new Error('No accounts available for deployment')
    }
    
    // Use the first account as deployer
    const signer = await provider.getSigner(0)
    const deployerAddress = await signer.getAddress()
    console.log('Deployer address:', deployerAddress)
    
    // Simple contract deployment (placeholder - you'll need actual contract bytecode)
    console.log('⚠️  Note: You need to deploy the actual Indy Besu contracts')
    console.log('📋 Required contracts:')
    console.log('   - EthereumExtDidRegistry at 0x0000000000000000000000000000000000018888')
    console.log('   - SchemaRegistry at 0x0000000000000000000000000000000000005555') 
    console.log('   - CredentialDefinitionRegistry at 0x0000000000000000000000000000000000004444')
    
    return true
    
  } catch (error: any) {
    console.error('❌ Contract deployment failed:', error.message)
    throw error
  }
}

// Run the test
testBlockchainConnectivity()
  .then(({ provider, endpoint }) => {
    console.log(`\n✅ Successfully connected to blockchain at ${endpoint}`)
    return deployContracts(provider)
  })
  .then(() => {
    console.log('\n🎉 Blockchain setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message)
    process.exit(1)
  })