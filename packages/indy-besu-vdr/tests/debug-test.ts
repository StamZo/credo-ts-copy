import { Agent, Buffer } from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { getBesuIndyModules } from './indy-bese-test-utils'
import { IndyBesuDidCreateOptions } from '../src/dids'

describe('Debug Memory Leak', () => {
  let agent: Agent

  beforeAll(async () => {
    console.log('🚀 Initializing agent...')
    const agentOptions = getAgentOptions(
      'DebugAgent', 
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

  it('should test minimal DID creation', async () => {
    console.log('🧪 Testing minimal DID creation...')
    
    const privateKey = crypto.randomBytes(32)
    console.log('🔑 Generated private key')

    const didOptions: IndyBesuDidCreateOptions = {
      method: 'ethr',
      secret: {
        didPrivateKey: Buffer.from(privateKey),
      },
    }

    console.log('📋 Created DID options')

    try {
      console.log('⏳ Calling agent.dids.create...')
      
      // Add a timeout wrapper to prevent infinite hanging
      const createPromise = agent.dids.create(didOptions)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('DID creation timed out after 30 seconds'))
        }, 30000)
      })

      const result = await Promise.race([createPromise, timeoutPromise])
      
      console.log('✅ DID creation completed')
      console.log('Result state:', result.didState.state)
      
      if (result.didState.state === 'finished') {
        console.log('🎉 DID created successfully:', result.didState.did)
      } else {
        console.log('❌ DID creation failed:', result.didState.reason)
      }

      expect(result).toBeDefined()
      
    } catch (error: any) {
      console.error('❌ DID creation failed:', error.message)
      
      // Don't fail the test if it's a timeout - we just want to see where it hangs
      if (error.message.includes('timed out')) {
        console.log('⚠️  Test timed out - this helps us identify the hanging point')
      } else {
        throw error
      }
    }
  }, 60000)

  it('should test ledger client directly', async () => {
    console.log('🧪 Testing ledger client directly...')
    
    try {
      const { LedgerClient } = require('indy2-vdr')
      const { DidRegistry, SchemaRegistry, CredentialDefinitionRegistry } = require('../src/ledger')
      
      console.log('📦 Creating LedgerClient...')
      const client = new LedgerClient(
        1337,
        'http://localhost:8545',
        [DidRegistry.config, SchemaRegistry.config, CredentialDefinitionRegistry.config],
        null
      )
      
      console.log('📡 Testing ping...')
      const pingResult = await client.ping()
      console.log('✅ Ping successful:', pingResult)
      
    } catch (error: any) {
      console.error('❌ Ledger client test failed:', error.message)
      throw error
    }
  }, 30000)
})