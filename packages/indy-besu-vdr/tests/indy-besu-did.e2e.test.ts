import {
  Agent,
  Buffer,
  DidDocumentBuilder,
  JsonTransformer,
  getEd25519VerificationKey2018,
  TypedArrayEncoder
} from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { buildDid, getBesuIndyModules } from './indy-bese-test-utils'
import { IndyBesuDidCreateOptions } from '../src/dids'
import { VerificationKeyPurpose, VerificationKeyType } from '../src/dids/DidUtils'
import * as ed25519 from '@noble/ed25519'

describe('Indy-Besu DID', () => {
  let agent: Agent

  beforeAll(async () => {
    const agentOptions = getAgentOptions(
      'Faber', 
      {
        endpoints: ['http://localhost:3001'],
      }, 
      {},
      getBesuIndyModules()
    )

    agent = new Agent(agentOptions)
    await agent.initialize()
  })

  afterAll(async () => {
    if (agent) {
      await agent.shutdown()
    }
  })

  it('create and resolve a did:ethr', async () => {
    console.log('🚀 Starting DID creation test...')
    
    // Generate Ed25519 keypair using crypto.randomBytes instead of noble's randomPrivateKey
    const privateKey = crypto.randomBytes(32)
    const publicKey = await ed25519.getPublicKey(privateKey)

    // Convert to Base58 using Credo's TypedArrayEncoder
    const publicKeyBase58 = TypedArrayEncoder.toBase58(publicKey)

    console.log('🔑 Generated keys')

    // Register a DID with Ed25519 verification key as delegate
    const createResult = await agent.dids.create<IndyBesuDidCreateOptions>({
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
              publicKey: Buffer.from(publicKey),
              publicKeyBase58: publicKeyBase58
            },
            purpose: VerificationKeyPurpose.AssertionMethod,
          },
        ],
      },
      secret: {
        didPrivateKey: Buffer.from(crypto.randomBytes(32)), // secp256k1 private key for DID
      },
    })

    console.log('✅ DID creation completed')
    console.log('Create result:', JSON.stringify(createResult, null, 2))

    expect(createResult.didState).toMatchObject({ state: 'finished' })

    const id = createResult.didState.did!
    const document = createResult.didState.didDocument!

    console.log('📋 Created DID:', id)

    expect(JsonTransformer.toJSON(document)).toMatchObject({
      '@context': expect.arrayContaining([
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
        'https://w3id.org/security/suites/ed25519-2018/v1',
      ]),
      id: id,
      verificationMethod: expect.arrayContaining([
        expect.objectContaining({
          id: `${id}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: id,
          blockchainAccountId: expect.stringMatching(/^eip155:1337:0x[a-fA-F0-9]{40}$/),
        }),
        expect.objectContaining({
          id: `${id}#delegate-1`,
          type: 'Ed25519VerificationKey2018',
          controller: id,
          publicKeyBase58: publicKeyBase58,
        }),
      ]),
      service: [
        {
          id: `${id}#service-1`,
          serviceEndpoint: 'https://example.com/endpoint',
          type: 'endpoint',
        },
      ],
      authentication: [`${id}#controller`],
      assertionMethod: [`${id}#controller`, `${id}#delegate-1`],
    })

    console.log('🔍 Testing DID resolution...')
    
    // Test DID resolution
    const resolvedDid = await agent.dids.resolve(id)
    console.log('✅ DID resolution completed')
    console.log('Resolved DID:', JSON.stringify(resolvedDid, null, 2))

    expect(resolvedDid.didResolutionMetadata.error).toBeUndefined()
    expect(JsonTransformer.toJSON(resolvedDid.didDocument)).toMatchObject(
      JsonTransformer.toJSON(document)
    )
    
    console.log('🎉 All tests passed!')
  }, 120000) // Increase timeout to 2 minutes
})