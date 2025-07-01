import {
  Agent,
  Buffer,
  DidDocumentBuilder,
  JsonTransformer,
  getEd25519VerificationKey2018
} from '@credo-ts/core'
import crypto from 'crypto'
import { getAgentOptions } from '../../core/tests/helpers'
import { buildDid, getBesuIndyModules } from './indy-bese-test-utils'
import { IndyBesuDidCreateOptions } from '../src/dids'
import { VerificationKeyPurpose, VerificationKeyType } from '../src/dids/DidUtils'
import * as ed25519 from '@noble/ed25519'


const agentOptions = getAgentOptions('Faber', undefined)
const besuIndyModules = getBesuIndyModules()

describe('Indy-Besu DID', () => {
  let agent: Agent

  beforeAll(async () => {
    agent = new Agent({
      ...agentOptions,
      modules: besuIndyModules,
    })
    await agent.initialize()
  })

  afterAll(async () => {
    await agent.shutdown()
  })

  it('create and resolve a did:ethr', async () => {
    // Generate Ed25519 keypair using noble
    const privateKey = ed25519.utils.randomPrivateKey()
    const publicKey = await ed25519.getPublicKey(privateKey)

   // (Optional) If you want to see the JWK
  // const x = Buffer.from(publicKey)
  //   .toString('base64')
  //   .replace(/\+/g, '-')
  //   .replace(/\//g, '_')
  //   .replace(/=+$/, '');

  // const publicJwk = { kty: 'OKP', crv: 'Ed25519', x };
  // const keyId = 'did:example:123#key-1';
  // const assertKey = getEd25519VerificationKey2018({ id: keyId, controller: 'did:example:123', publicJwk });

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
            key: { publicKey },
            purpose: VerificationKeyPurpose.AssertionMethod,
          },
        ],
      },
      secret: {
        didPrivateKey: Buffer.from(crypto.randomBytes(32)),
      },
    })

    console.log(JSON.stringify(createResult))

    expect(createResult.didState).toMatchObject({ state: 'finished' })

    const id = createResult.didState.did!
    const namespaceIdentifier = id.split(':').pop()
    const document = createResult.didState.didDocument!

    expect(JsonTransformer.toJSON(document)).toMatchObject({
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
        'https://w3id.org/security/suites/ed25519-2018/v1',
      ],
      verificationMethod: [
        {
          id: `${id}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: id,
          blockchainAccountId: `eip155:1337:${namespaceIdentifier}`,
        },
        {
          id: `${id}#delegate-1`,
          type: 'Ed25519VerificationKey2018',
          controller: id,
          publicKeyBase58: Buffer.from(publicKey).toString('base58'),
        },
      ],
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

    const resolvedDid = await agent.dids.resolve(id)
    console.log(JSON.stringify(resolvedDid))

    expect(JsonTransformer.toJSON(resolvedDid.didDocument)).toMatchObject(JsonTransformer.toJSON(document))
  })
})
