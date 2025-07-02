import { Agent, Buffer, DidCreateResult } from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { getBesuIndyModules } from './indy-bese-test-utils'
import { IndyBesuDidCreateOptions } from '../src/dids'

describe('Simple Offline Test', () => {
  let agent: Agent

  beforeAll(async () => {
    console.log('🚀 Initializing agent...')
    const agentOptions = getAgentOptions(
      'SimpleAgent', 
      {
        endpoints: ['http://localhost:3001'],
      }, 
      {},
      getBesuIndyModules()
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

  it('should create a DID without verification keys or endpoints', async () => {
    console.log('🧪 Testing basic DID creation without blockchain calls...')
    
    const privateKey = crypto.randomBytes(32)
    console.log('🔑 Generated private key')

    // Minimal DID options - no verification keys or endpoints
    // This should only require basic DID creation without blockchain setAttribute calls
    const didOptions: IndyBesuDidCreateOptions = {
      method: 'ethr',
      secret: {
        didPrivateKey: Buffer.from(privateKey),
      },
      // No options = no blockchain calls for verification keys or endpoints
    }

    console.log('📋 Created minimal DID options (no verification keys/endpoints)')

    try {
      console.log('⏳ Calling agent.dids.create with minimal options...')
      
      const createPromise = agent.dids.create(didOptions)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('DID creation timed out after 15 seconds'))
        }, 15000)
      })

      const result = await Promise.race([createPromise, timeoutPromise]) as DidCreateResult
      
      console.log('✅ DID creation completed')
      console.log('Result state:', result.didState.state)
      console.log('Full result:', JSON.stringify(result, null, 2))
      
      if (result.didState.state === 'finished') {
        console.log('🎉 DID created successfully:', result.didState.did)
        expect(result.didState.did).toMatch(/^did:ethr:[a-f0-9]{40}$/)
        expect(result.didState.didDocument).toBeDefined()
      } else {
        console.log('❌ DID creation not finished. State:', result.didState.state)
        // Handle different state types properly
        if ('reason' in result.didState) {
          console.log('Failure reason:', result.didState.reason)
          throw new Error(`DID creation failed: ${result.didState.reason}`)
        } else {
          throw new Error(`DID creation not finished. State: ${result.didState.state}`)
        }
      }
      
    } catch (error: any) {
      console.error('❌ DID creation failed:', error.message)
      throw error
    }
  }, 30000)
})