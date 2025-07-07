import {
  Buffer,
  DidCreateResult,
  TypedArrayEncoder,
  VerificationMethod,
  DidDocumentBuilder,
  getEd25519VerificationKey2018,
  getX25519KeyAgreementKey2019,
  DidDocumentService,
} from '@credo-ts/core'

import { computeAddress } from 'ethers'

export const VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_RECOVERY_2020 = 'EcdsaSecp256k1RecoveryMethod2020'
export const CONTEXT_SECURITY_SUITES_ED25519_2018_V1 = 'https://w3id.org/security/suites/ed25519-2018/v1'

export enum VerificationKeyType {
  Ed25519VerificationKey2018,
  X25519KeyAgreementKey2020,
  EcdsaSecp256k1RecoveryMethod2020,
}

export enum VerificationKeyPurpose {
  AssertionMethod,
  Authentication,
  keyAgreement,
}

export interface VerificationKey {
  type: VerificationKeyType
  key: any
  purpose: VerificationKeyPurpose
}

export interface IndyBesuEndpoint {
  type: string
  endpoint: string
}

export function buildDid(method: string, key: Buffer | Uint8Array): string {
  // For 'ethr' method, we use the Ethereum address as the identifier
  let keyHex: string
  
  if (Buffer.isBuffer(key)) {
    keyHex = TypedArrayEncoder.toHex(key)
  } else if (key instanceof Uint8Array) {
    keyHex = Buffer.from(key).toString('hex')
  } else {
    throw new Error('Key must be a Buffer or Uint8Array')
  }
  
  const address = computeAddress(`0x${keyHex}`)
  
  // Remove '0x' prefix and use the address as identifier
  const identifier = address.slice(2).toLowerCase()
  
  return `did:${method}:${identifier}`
}

export function getEcdsaSecp256k1RecoveryMethod2020({
  id,
  key,
  controller,
  chainId = 1337 // Default chain ID, should be configurable
}: {
  id: string
  key: any
  controller: string
  chainId?: number
}) {
  // Handle both Buffer and object with publicKey property
  const publicKeyBuffer = key.publicKey || key
  let keyHex: string
  
  if (Buffer.isBuffer(publicKeyBuffer)) {
    keyHex = TypedArrayEncoder.toHex(publicKeyBuffer)
  } else if (publicKeyBuffer instanceof Uint8Array) {
    keyHex = Buffer.from(publicKeyBuffer).toString('hex')
  } else {
    throw new Error('Public key must be a Buffer or Uint8Array')
  }
  
  const address = computeAddress(`0x${keyHex}`)

  return new VerificationMethod({
    id,
    type: 'EcdsaSecp256k1RecoveryMethod2020',
    controller,
    blockchainAccountId: `eip155:${chainId}:${address}`,
  })
}

export function failedResult(reason: string): DidCreateResult {
  return {
    didDocumentMetadata: {},
    didRegistrationMetadata: {},
    didState: {
      state: 'failed',
      reason: reason,
    },
  }
}

export function getVerificationMaterialPropertyName(type: VerificationKeyType): string {
  switch (type) {
    case VerificationKeyType.Ed25519VerificationKey2018:
    case VerificationKeyType.X25519KeyAgreementKey2020:
      return 'publicKeyBase58'
    case VerificationKeyType.EcdsaSecp256k1RecoveryMethod2020:
      return 'blockchainAccountId'
  }
}

export function getVerificationMaterial(type: VerificationKeyType, key: any): string {
  switch (type) {
    case VerificationKeyType.Ed25519VerificationKey2018:
    case VerificationKeyType.X25519KeyAgreementKey2020:
      return key.publicKeyBase58
    case VerificationKeyType.EcdsaSecp256k1RecoveryMethod2020:
      const publicKeyBuffer = key.publicKey || key
      let keyHex: string
      
      if (Buffer.isBuffer(publicKeyBuffer)) {
        keyHex = TypedArrayEncoder.toHex(publicKeyBuffer)
      } else if (publicKeyBuffer instanceof Uint8Array) {
        keyHex = Buffer.from(publicKeyBuffer).toString('hex')
      } else {
        throw new Error('Public key must be a Buffer or Uint8Array')
      }
      
      const address = computeAddress(`0x${keyHex}`)
      return `eip155:1337:${address}` // TODO: Make chain ID configurable
  }
}

export function getVerificationPurpose(purpose: VerificationKeyPurpose): string {
  switch (purpose) {
    case VerificationKeyPurpose.AssertionMethod:
      return 'veriKey'
    case VerificationKeyPurpose.Authentication:
      return 'sigAuth'
    case VerificationKeyPurpose.keyAgreement:
      return 'enc'
  }
}

export function getVerificationMethod(
  id: string,
  type: VerificationKeyType,
  key: any,
  controller: string
): VerificationMethod {
  switch (type) {
    case VerificationKeyType.Ed25519VerificationKey2018:
      // Handle the key object that has publicKeyBase58 already computed
      if (key.publicKeyBase58) {
        return new VerificationMethod({
          id,
          type: 'Ed25519VerificationKey2018',
          controller,
          publicKeyBase58: key.publicKeyBase58,
        })
      }
      // Fallback to computing base58 if only publicKey is provided
      const ed25519PublicKey = key.publicKey || key
      const publicKeyBase58 = TypedArrayEncoder.toBase58(ed25519PublicKey)
      return new VerificationMethod({
        id,
        type: 'Ed25519VerificationKey2018',
        controller,
        publicKeyBase58,
      })
    case VerificationKeyType.X25519KeyAgreementKey2020:
      // Similar handling for X25519
      if (key.publicKeyBase58) {
        return new VerificationMethod({
          id,
          type: 'X25519KeyAgreementKey2019',
          controller,
          publicKeyBase58: key.publicKeyBase58,
        })
      }
      const x25519PublicKey = key.publicKey || key
      const x25519PublicKeyBase58 = TypedArrayEncoder.toBase58(x25519PublicKey)
      return new VerificationMethod({
        id,
        type: 'X25519KeyAgreementKey2019',
        controller,
        publicKeyBase58: x25519PublicKeyBase58,
      })
    case VerificationKeyType.EcdsaSecp256k1RecoveryMethod2020:
      return getEcdsaSecp256k1RecoveryMethod2020({ id, key, controller })
  }
}

export function getKeyContext(type: VerificationKeyType) {
  switch (type) {
    case VerificationKeyType.Ed25519VerificationKey2018:
      return 'https://w3id.org/security/suites/ed25519-2018/v1'
    case VerificationKeyType.X25519KeyAgreementKey2020:
      return 'https://w3id.org/security/suites/x25519-2020/v1'
    case VerificationKeyType.EcdsaSecp256k1RecoveryMethod2020:
      return 'https://w3id.org/security/suites/secp256k1recovery-2020/v2'
  }
}

export function buildDidDocument(
  did: string,
  key: any,
  endpoints?: IndyBesuEndpoint[],
  verificationKeys?: VerificationKey[]
) {
  const context = [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  ]

  const verificationMethod = getEcdsaSecp256k1RecoveryMethod2020({
    key: key,
    id: `${did}#controller`,
    controller: did,
  })

  const didDocumentBuilder = new DidDocumentBuilder(did)
    .addVerificationMethod(verificationMethod)
    .addAuthentication(verificationMethod.id)
    .addAssertionMethod(verificationMethod.id)

  // Add key security contexts
  verificationKeys
    ?.map((value) => value.type)
    .map((value) => getKeyContext(value))
    .forEach((value) => {
      if (!context.includes(value)) {
        context.push(value)
      }
    })

  // Add verification methods
  verificationKeys?.forEach((value, index) => {
    const id = `${did}#delegate-${index + 1}`

    const verificationMethod = getVerificationMethod(id, value.type, value.key, did)
    didDocumentBuilder.addVerificationMethod(verificationMethod)

    switch (value.purpose) {
      case VerificationKeyPurpose.AssertionMethod:
        didDocumentBuilder.addAssertionMethod(id)
        break
      case VerificationKeyPurpose.Authentication:
        didDocumentBuilder.addAuthentication(id)
        break
      case VerificationKeyPurpose.keyAgreement:
        didDocumentBuilder.addKeyAgreement(id)
    }
  })

  // Add services
  endpoints?.forEach((value, index) => {
    const service = new DidDocumentService({
      id: `${did}#service-${index + 1}`,
      serviceEndpoint: value.endpoint,
      type: value.type,
    })

    didDocumentBuilder.addService(service)
  })

  const didDocument = didDocumentBuilder.build()
  didDocument.context = context

  return didDocument
}