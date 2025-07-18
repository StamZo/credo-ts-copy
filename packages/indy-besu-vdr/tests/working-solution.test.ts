import { Agent, Buffer, DidCreateResult, TypedArrayEncoder } from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { IndyBesuDidCreateOptions } from '../src/dids'
import { VerificationKeyPurpose, VerificationKeyType } from '../src/dids/DidUtils'
import { IndyBesuModule } from '../src/IndyBesuModule'
import { DidsModule } from '@credo-ts/core'
import { IndyBesuDidRegistrar } from '../src/dids/IndyBesuDidRegistrar'
import { IndyBesuDidResolver } from '../src/dids/IndyBesuDidResolver'
import * as ed25519 from '@noble/ed25519'

describe('Working Solution Test', () => {
  let agent: Agent

  beforeAll(async () => {
    console.log('🚀 Initializing agent with timeout protection...')
    
    // Create modules with skipBlockchainWrites for fast testing
    const besuModules = {
      indyBesuVdr: new IndyBesuModule({ 
        chainId: 1337, 
        nodeAddress: 'http://localhost:8545',
        skipBlockchainWrites: false, // Test with timeouts
        transactionTimeoutMs: 10000   // 10 second timeout
      }),
      dids: new DidsModule({
        registrars: [new IndyBesuDidRegistrar()],
        resolvers: [new IndyBesuDidResolver()],
      }),
    }

    const agentOptions = getAgentOptions(
      'WorkingSolutionAgent', 
      {
        endpoints: ['http://localhost:3001'],
      }, 
      {},
      besuModules
    )

    agent = new Agent(agentOptions)
    await agent.initialize()
    console.log('✅ Agent initialized')
  })

  afterAll(async () => {
    console.log('🧹 Cleaning up agent...')
    if (agent) {
      await agent.shutdown()
      console.log('✅ Agent shutdown complete')
    }
  })

  it('should create a DID with verification keys using timeout protection', async () => {
    console.log('🧪 Testing DID creation with timeout protection...')
    
    const privateKey = crypto.randomBytes(32)
    const ed25519PrivateKey = crypto.randomBytes(32)
    const ed25519PublicKey = await ed25519.getPublicKey(ed25519PrivateKey)
    const publicKeyBase58 = TypedArrayEncoder.toBase58(ed25519PublicKey)

    console.log('🔑 Generated keys')

    const didOptions: IndyBesuDidCreateOptions = {
      method: 'ethr',
      options: {
        endpoints: [
          {
            type: 'endpoint',
            endpoint: 'https://example.com/endpoint',
          },
        ],
        verificationKeys: [
          {
            type: VerificationKeyType.Ed25519VerificationKey2018,
            key: { 
              publicKey: Buffer.from(ed25519PublicKey),
              publicKeyBase58: publicKeyBase58
            },
            purpose: VerificationKeyPurpose.AssertionMethod,
          },
        ],
      },
      secret: {
        didPrivateKey: Buffer.from(privateKey),
      },
    }

    console.log('📋 Created DID options with verification keys and endpoints')

    try {
      console.log('⏳ Calling agent.dids.create with timeout protection...')
      
      const result = await agent.dids.create(didOptions) as DidCreateResult
      
      console.log('✅ DID creation completed!')
      console.log('Result state:', result.didState.state)
      
      if (result.didState.state === 'finished') {
        console.log('🎉 DID created successfully:', result.didState.did)
        console.log('📄 DID Document contexts:', result.didState.didDocument?.context)
        
        expect(result.didState.did).toMatch(/^did:ethr:[a-f0-9]{40}$/)
        expect(result.didState.didDocument).toBeDefined()
        
        // The DID document should include both the main controller key and the Ed25519 key
        const didDoc = result.didState.didDocument!
        expect(didDoc.verificationMethod).toBeDefined()
        expect(didDoc.verificationMethod!.length).toBeGreaterThanOrEqual(1)
        
        console.log('🎯 Test completed successfully with timeout protection!')
        
      } else {
        console.log('❌ DID creation not finished. State:', result.didState.state)
        if ('reason' in result.didState) {
          console.log('Failure reason:', result.didState.reason)
        }
        
        // Even if blockchain writes failed, we should still get a basic DID
        expect(result.didState.state).toBe('finished')
      }
      
    } catch (error: any) {
      console.error('❌ DID creation failed:', error.message)
      throw error
    }
  }, 60000)
})