// packages/indy-besu-vdr/src/dids/IndyBesuDidRegistrar.ts
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
import { SigningKey } from 'ethers'
import { IndyBesuModuleConfig } from '../IndyBesuModuleConfig'

export class IndyBesuDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ['ethr']

  public async create(agentContext: AgentContext, options: IndyBesuDidCreateOptions): Promise<DidCreateResult> {
    agentContext.config.logger.info('Creating DID...')
    
    try {
      const didRegistry = agentContext.dependencyManager.resolve(DidRegistry)
      const config = agentContext.dependencyManager.resolve(IndyBesuModuleConfig)

      const didPrivateKey = options.secret?.didPrivateKey
      if (!didPrivateKey) {
        return failedResult('Missing didPrivateKey in secret')
      }

      // Convert Buffer to Uint8Array if needed
      const privateKeyBytes = Buffer.isBuffer(didPrivateKey) ? 
        new Uint8Array(didPrivateKey) : 
        didPrivateKey

      // Create signing key and derive public key
      const signingKey = new SigningKey(privateKeyBytes)
      const publicKeyHex = signingKey.publicKey.slice(2) // Remove '0x' prefix
      const publicKey = Buffer.from(publicKeyHex, 'hex')

      // Build DID
      const did = buildDid(options.method, publicKey)
      agentContext.config.logger.debug(`Built DID: ${did}`)

      // Create signer
      const signer = new IndyBesuSigner(privateKeyBytes)

      // Skip blockchain operations if in mock mode
      if (config.skipBlockchainWrites) {
        agentContext.config.logger.info('Mock mode: Skipping blockchain writes')
      } else {
        // Process verification keys
        if (options?.options?.verificationKeys) {
          agentContext.config.logger.info(`Setting ${options.options.verificationKeys.length} verification keys...`)
          
          for (let i = 0; i < options.options.verificationKeys.length; i++) {
            const verificationKey = options.options.verificationKeys[i]
            
            try {
              const materialPropertyName = getVerificationMaterialPropertyName(verificationKey.type)
              const material = getVerificationMaterial(verificationKey.type, verificationKey.key)
              const purpose = getVerificationPurpose(verificationKey.purpose)

              const keyAttribute = {
                [materialPropertyName]: material,
                purpose,
                type: VerificationKeyType[verificationKey.type],
              }

              agentContext.config.logger.debug(`Setting attribute for key ${i + 1}...`)
              await didRegistry.setAttribute(did, keyAttribute, BigInt(100000), signer)
              agentContext.config.logger.debug(`Attribute set for key ${i + 1}`)
              
            } catch (error: any) {
              agentContext.config.logger.warn(`Failed to set verification key ${i + 1}: ${error.message}`)
              
              if (config.failOnConnectionError) {
                throw error
              }
              // Continue with other keys
            }
          }
        }

        // Process endpoints
        if (options?.options?.endpoints) {
          agentContext.config.logger.info(`Setting ${options.options.endpoints.length} endpoints...`)
          
          for (let i = 0; i < options.options.endpoints.length; i++) {
            const endpoint = options.options.endpoints[i]
            
            try {
              const serviceAttribute = {
                serviceEndpoint: endpoint.endpoint,
                type: endpoint.type,
              }
              
              agentContext.config.logger.debug(`Setting endpoint ${i + 1}...`)
              await didRegistry.setAttribute(did, serviceAttribute, BigInt(100000), signer)
              agentContext.config.logger.debug(`Endpoint set ${i + 1}`)
              
            } catch (error: any) {
              agentContext.config.logger.warn(`Failed to set endpoint ${i + 1}: ${error.message}`)
              
              if (config.failOnConnectionError) {
                throw error
              }
              // Continue with other endpoints
            }
          }
        }
      }

      // Build DID document
      const didDocument = buildDidDocument(
        did,
        { publicKey: publicKey },
        options?.options?.endpoints,
        options?.options?.verificationKeys
      )

      agentContext.config.logger.info('DID creation completed successfully')
      
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'finished',
          did: didDocument.id,
          didDocument: didDocument,
          secret: { 
            didPrivateKey: didPrivateKey,
            didKey: { privateKey: privateKeyBytes }
          },
        },
      }
    } catch (error: any) {
      agentContext.config.logger.error('DID creation failed:', error)
      return failedResult(`Failed to create DID: ${error.message}`)
    }
  }

  public async update(agentContext: AgentContext, options: IndyBesuDidUpdateOptions): Promise<DidUpdateResult> {
    return {
      didDocumentMetadata: {},
      didRegistrationMetadata: {},
      didState: {
        state: 'failed',
        reason: 'notImplemented: updating did:ethr not implemented yet',
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
        reason: 'notImplemented: deactivating did:ethr not implemented yet',
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
    didPrivateKey: Buffer | Uint8Array
  }
}

export interface IndyBesuDidUpdateOptions extends DidUpdateOptions {
  options: {
    accountKey: Buffer | Uint8Array
  }
}

export interface IndyBesuDidDeactivateOptions extends DidDeactivateOptions {
  options: {
    accountKey: Buffer | Uint8Array
  }
}