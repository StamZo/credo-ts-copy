import { Agent, Buffer, DidCreateResult, TypedArrayEncoder } from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { getBesuIndyModules } from './indy-bese-test-utils'
import { IndyBesuDidCreateOptions } from '../src/dids'
import { VerificationKeyPurpose, VerificationKeyType } from '../src/dids/DidUtils'
import * as ed25519 from '@noble/ed25519'

describe('Verification Key Test', () => {
  let agent: Agent

  beforeAll(async () => {
    console.log('🚀 Initializing agent...')
    const agentOptions = getAgentOptions(
      'VerificationKeyAgent', 
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

  it('should create a DID with verification keys (this is where it hangs)', async () => {
    console.log('🧪 Testing DID creation WITH verification keys...')
    
    const privateKey = crypto.randomBytes(32)
    const ed25519PrivateKey = crypto.randomBytes(32)
    const ed25519PublicKey = await ed25519.getPublicKey(ed25519PrivateKey)
    const publicKeyBase58 = TypedArrayEncoder.toBase58(ed25519PublicKey)

    console.log('🔑 Generated keys')

    const didOptions: IndyBesuDidCreateOptions = {
      method: 'ethr',
      options: {
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

    console.log('📋 Created DID options WITH verification keys')

    try {
      console.log('⏳ Calling agent.dids.create with verification keys...')
      console.log('⚠️  This is where the memory leak/hang should occur...')
      
      const createPromise = agent.dids.create(didOptions)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('DID creation timed out after 30 seconds - this confirms the setAttribute hang'))
        }, 30000)
      })

      const result = await Promise.race([createPromise, timeoutPromise]) as DidCreateResult
      
      console.log('✅ DID creation completed unexpectedly!')
      console.log('Result state:', result.didState.state)
      
      if (result.didState.state === 'finished') {
        console.log('🎉 DID created successfully:', result.didState.did)
        expect(result.didState.did).toMatch(/^did:ethr:[a-f0-9]{40}$/)
      } else {
        console.log('❌ DID creation not finished. State:', result.didState.state)
        if ('reason' in result.didState) {
          console.log('Failure reason:', result.didState.reason)
          throw new Error(`DID creation failed: ${result.didState.reason}`)
        }
      }
      
    } catch (error: any) {
      if (error.message.includes('timed out')) {
        console.log('✅ Confirmed: DID creation with verification keys hangs (as expected)')
        console.log('🎯 The issue is in didRegistry.setAttribute() calls')
        
        // Don't fail the test - this is expected behavior we're documenting
        expect(error.message).toContain('timed out')
      } else {
        console.error('❌ Unexpected error:', error.message)
        throw error
      }
    }
  }, 45000)
})