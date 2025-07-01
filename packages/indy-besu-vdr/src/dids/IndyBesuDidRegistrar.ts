import {
  AgentContext,
  Buffer,
  DidCreateOptions,
  DidCreateResult,
  DidDeactivateOptions,
  DidDeactivateResult,
  DidRegistrar,
  DidUpdateOptions,
  DidUpdateResult,
} from '@credo-ts/core'
import { DidRegistry, IndyBesuSigner } from '../ledger'
import {
  buildDid,
  failedResult,
  getVerificationMaterial,
  getVerificationPurpose,
  IndyBesuEndpoint,
  VerificationKey,
  getVerificationMaterialPropertyName,
  buildDidDocument,
  VerificationKeyType,
} from './DidUtils'

export class IndyBesuDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ['ethr']

  public async create(agentContext: AgentContext, options: IndyBesuDidCreateOptions): Promise<DidCreateResult> {
    const didRegistry = agentContext.dependencyManager.resolve(DidRegistry)

    // --- CREATION OF SECP256K1 KEY FOR DID ---
    // Instead of wallet.createKey(), generate the key yourself in test, and pass as Buffer.
    // Here, we just read Buffer from secret, and derive publicKey directly.

    // DidKey must be a structure with a publicKey Buffer.
    // Most likely, you'll have options.secret.didPrivateKey (Buffer, 32 bytes, SECP256K1).
    const didPrivateKey = options.secret?.didPrivateKey
    if (!didPrivateKey) return failedResult('Missing didPrivateKey')

    // Use publicKey derivation (ethers)
    // You might want to import this helper from DidUtils for consistency.
    const { computeAddress } = await import('ethers')
    const publicKeyHex = didPrivateKey.toString('hex')
    // ethers v6: get public key from private key
    const { SigningKey } = await import('ethers')
    const publicKey = Buffer.from(new SigningKey(didPrivateKey).publicKey.slice(2), 'hex') // uncompressed public key

    // Actually, for computeAddress, you can just pass the privateKey directly to buildDid.
    const did = buildDid(options.method, publicKey)

    // --- SIGNER ---
    // For IndyBesuSigner, you should update your implementation to accept just the privateKey,
    // or a JWK, since agentContext.wallet is not available.
    // For now, pass the privateKey (update IndyBesuSigner if needed).
    const signer = new IndyBesuSigner(didPrivateKey /*, agentContext.wallet - REMOVE THIS ARGUMENT IN YOUR CLASS */)

    try {
      if (options?.options?.verificationKeys) {
        for (const verificationKey of options.options.verificationKeys) {
          const materialPropertyName = getVerificationMaterialPropertyName(verificationKey.type)
          const material = getVerificationMaterial(verificationKey.type, verificationKey.key)
          const purpose = getVerificationPurpose(verificationKey.purpose)

          const keyAttribute = {
            [`${materialPropertyName}`]: material,
            purpose,
            type: VerificationKeyType[verificationKey.type],
          }
          console.log('Setting attribute:', { did, keyAttribute })

          await didRegistry.setAttribute(did, keyAttribute, BigInt(100000), signer)
        }
      }

      if (options?.options?.endpoints) {
        for (const endpoint of options.options.endpoints) {
          const serviceAttribute = {
            serviceEndpoint: endpoint.endpoint,
            type: endpoint.type,
          }
          await didRegistry.setAttribute(did, serviceAttribute, BigInt(100000), signer)
        }
      }

      // --- DidDocument ---
      const didDocument = buildDidDocument(
        did,
        publicKey, // use publicKey Buffer here
        options?.options?.endpoints,
        options?.options?.verificationKeys
      )

      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'finished',
          did: didDocument.id,
          didDocument: didDocument,
          secret: { didPrivateKey }, // Store the private key in secret
        },
      }
    } catch (error: any) {
      console.log(error)
      return failedResult(`unknownError: ${error.message}`)
    }
  }

  public async update(agentContext: AgentContext, options: IndyBesuDidUpdateOptions): Promise<DidUpdateResult> {
    return {
      didDocumentMetadata: {},
      didRegistrationMetadata: {},
      didState: {
        state: 'failed',
        reason: `notImplemented: updating did:indy not implemented yet`,
      },
    }
  }

  public async deactivate(
    agentContext: AgentContext,
    options: IndyBesuDidDeactivateOptions
  ): Promise<DidDeactivateResult> {
    return {
      didDocumentMetadata: {},
      didRegistrationMetadata: {},
      didState: {
        state: 'failed',
        reason: `notImplemented: deactivating did:indy not implemented yet`,
      },
    }
  }
}

export interface IndyBesuDidCreateOptions extends DidCreateOptions {
  method: 'ethr'
  did?: never
  didDocument?: never
  options?: {
    endpoints?: IndyBesuEndpoint[]
    verificationKeys?: VerificationKey[]
  }
  secret?: {
    didPrivateKey: Buffer // 32 byte secp256k1 private key
  }
}

export interface IndyBesuDidUpdateOptions extends DidUpdateOptions {
  options: {
    accountKey: Buffer // Accept Buffer instead of Key
  }
}

export interface IndyBesuDidDeactivateOptions extends DidDeactivateOptions {
  options: {
    accountKey: Buffer
  }
}
