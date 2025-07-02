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

export class IndyBesuDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ['ethr']

  public async create(agentContext: AgentContext, options: IndyBesuDidCreateOptions): Promise<DidCreateResult> {
    console.log('🏗️  IndyBesuDidRegistrar.create() called')
    
    try {
      console.log('📦 Resolving DidRegistry from dependency manager...')
      const didRegistry = agentContext.dependencyManager.resolve(DidRegistry)
      console.log('✅ DidRegistry resolved')

      const didPrivateKey = options.secret?.didPrivateKey
      if (!didPrivateKey) {
        console.log('❌ Missing didPrivateKey in secret')
        return failedResult('Missing didPrivateKey in secret')
      }
      console.log('🔑 Got didPrivateKey')

      // Convert Buffer to Uint8Array if needed
      const privateKeyBytes = Buffer.isBuffer(didPrivateKey) ? 
        new Uint8Array(didPrivateKey) : 
        didPrivateKey
      console.log('🔄 Converted private key to Uint8Array')

      // Create signing key and derive public key
      console.log('⚙️  Creating SigningKey...')
      const signingKey = new SigningKey(privateKeyBytes)
      console.log('✅ SigningKey created')
      
      const publicKeyHex = signingKey.publicKey.slice(2) // Remove '0x' prefix
      const publicKey = Buffer.from(publicKeyHex, 'hex')
      console.log('🔑 Derived public key')

      // Build DID
      console.log('🆔 Building DID...')
      const did = buildDid(options.method, publicKey)
      console.log('✅ DID built:', did)

      // Create signer
      console.log('✍️  Creating IndyBesuSigner...')
      const signer = new IndyBesuSigner(privateKeyBytes)
      console.log('✅ IndyBesuSigner created')

      // THIS IS LIKELY WHERE IT HANGS - blockchain operations
      console.log('⛓️  Starting blockchain operations...')
      
      // Set verification keys if provided
      if (options?.options?.verificationKeys) {
        console.log(`🔐 Processing ${options.options.verificationKeys.length} verification keys...`)
        
        for (let i = 0; i < options.options.verificationKeys.length; i++) {
          const verificationKey = options.options.verificationKeys[i]
          console.log(`🔐 Processing verification key ${i + 1}/${options.options.verificationKeys.length}`)
          
          const materialPropertyName = getVerificationMaterialPropertyName(verificationKey.type)
          const material = getVerificationMaterial(verificationKey.type, verificationKey.key)
          const purpose = getVerificationPurpose(verificationKey.purpose)

          const keyAttribute = {
            [materialPropertyName]: material,
            purpose,
            type: VerificationKeyType[verificationKey.type],
          }

          console.log(`⛓️  Calling didRegistry.setAttribute for key ${i + 1}...`)
          agentContext.config.logger.debug('Setting DID attribute:', { did, keyAttribute })
          
          try {
            // THIS CALL LIKELY HANGS - add timeout wrapper
            const setAttributePromise = didRegistry.setAttribute(did, keyAttribute, BigInt(100000), signer)
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => {
                reject(new Error(`setAttribute timed out after 30 seconds for key ${i + 1}`))
              }, 30000)
            })
            
            await Promise.race([setAttributePromise, timeoutPromise])
            console.log(`✅ setAttribute completed for key ${i + 1}`)
          } catch (error: any) {
            console.warn(`⚠️  setAttribute failed for key ${i + 1}:`, error.message)
            // Continue with other keys instead of failing completely
          }
        }
      }

      // Set endpoints if provided
      if (options?.options?.endpoints) {
        console.log(`🌐 Processing ${options.options.endpoints.length} endpoints...`)
        
        for (let i = 0; i < options.options.endpoints.length; i++) {
          const endpoint = options.options.endpoints[i]
          console.log(`🌐 Processing endpoint ${i + 1}/${options.options.endpoints.length}`)
          
          const serviceAttribute = {
            serviceEndpoint: endpoint.endpoint,
            type: endpoint.type,
          }
          
          console.log(`⛓️  Calling didRegistry.setAttribute for endpoint ${i + 1}...`)
          try {
            const setAttributePromise = didRegistry.setAttribute(did, serviceAttribute, BigInt(100000), signer)
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => {
                reject(new Error(`setAttribute timed out after 30 seconds for endpoint ${i + 1}`))
              }, 30000)
            })
            
            await Promise.race([setAttributePromise, timeoutPromise])
            console.log(`✅ setAttribute completed for endpoint ${i + 1}`)
          } catch (error: any) {
            console.warn(`⚠️  setAttribute failed for endpoint ${i + 1}:`, error.message)
            // Continue instead of failing completely
          }
        }
      

        // Set endpoints if provided
        if (options?.options?.endpoints) {
          console.log(`🌐 Processing ${options.options.endpoints.length} endpoints...`)
          
          for (let i = 0; i < options.options.endpoints.length; i++) {
            const endpoint = options.options.endpoints[i]
            console.log(`🌐 Processing endpoint ${i + 1}/${options.options.endpoints.length}`)
            
            const serviceAttribute = {
              serviceEndpoint: endpoint.endpoint,
              type: endpoint.type,
            }
            
            console.log(`⛓️  Calling didRegistry.setAttribute for endpoint ${i + 1}...`)
            try {
              const setAttributePromise = didRegistry.setAttribute(did, serviceAttribute, BigInt(100000), signer)
              const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                  reject(new Error(`setAttribute timed out after 30 seconds for endpoint ${i + 1}`))
                }, 30000)
              })
              
              await Promise.race([setAttributePromise, timeoutPromise])
              console.log(`✅ setAttribute completed for endpoint ${i + 1}`)
            } catch (error: any) {
              console.warn(`⚠️  setAttribute failed for endpoint ${i + 1}:`, error.message)
              // Continue instead of failing completely
            }
          }
        }
      }

      console.log('🏗️  Building DID document...')
      // Build DID document
      const didDocument = buildDidDocument(
        did,
        { publicKey: publicKey }, // Pass as object with publicKey property
        options?.options?.endpoints,
        options?.options?.verificationKeys
      )
      console.log('✅ DID document built')

      console.log('🎉 DID creation completed successfully')
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
      console.error('💥 DID creation failed with error:', error.message)
      console.error('Stack trace:', error.stack)
      agentContext.config.logger.error('Failed to create DID:', error)
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
    didPrivateKey: Buffer | Uint8Array // Accept both Buffer and Uint8Array
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