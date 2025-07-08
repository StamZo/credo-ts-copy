import {
  ProofEventTypes,
  ProofState,
  ProofStateChangedEvent,
  V2ProofProtocol,
  CredentialEventTypes,
  CredentialState,
  CredentialStateChangedEvent,
  ConnectionEventTypes, ConnectionStateChangedEvent 
} from '@credo-ts/didcomm'

import type { 
  ConnectionRecord, 
  CredentialExchangeRecord, 
  ProofExchangeRecord,
  RequestProofOptions,
} from '@credo-ts/didcomm'

import type {
  AnonCredsProofFormatService,
  RegisterCredentialDefinitionReturnStateFinished,
  RegisterSchemaReturnStateFinished,
} from '@credo-ts/anoncreds'

import { CREDENTIALS_CONTEXT_V1_URL, TypedArrayEncoder, utils, KeyType } from '@credo-ts/core'

import { IndyBesuDidCreateOptions, VerificationKeyPurpose, VerificationKeyType } from '@credo-ts/indy-besu-vdr'

import { BaseAgent, indyNetworkConfig } from './BaseAgent'
import { Color, Output, greenText, purpleText, redText } from './OutputClass'
import { computeAddress } from 'ethers'
import crypto from 'crypto'

export enum RegistryOptions {
  indy = 'did:indy',
  indyBesu = 'did:ethr',
}

export class createFaberAgent extends BaseAgent {
  public outOfBandId?: string
  public schema?: RegisterSchemaReturnStateFinished
  public credentialDefinition?: RegisterCredentialDefinitionReturnStateFinished
  public issuerId?: string

  public didPrivateKey?: Uint8Array

  public constructor(port: number, name: string) {
    super({ port, name })
    
  }

  public static async build(): Promise<createFaberAgent> {
    const faber = new createFaberAgent(9001, 'faber')
    await faber.initializeAgent()
    return faber
  }

  public async createIndyBesuDid() {
    // Generate a random private key for the DID
    const privateKey = crypto.randomBytes(32)
    this.didPrivateKey = new Uint8Array(privateKey)

    const createdDid = await this.agent.dids.create<IndyBesuDidCreateOptions>({ 
      method: 'ethr',
      secret: {
        didPrivateKey: privateKey,
      },
    })

    if (createdDid.didState.state == 'failed') {
      throw new Error(createdDid.didState.reason)
    }

    console.log(purpleText(`Created DID${Color.Reset}: ${JSON.stringify(createdDid.didState.didDocument, null, 2)}`))

    this.issuerId = createdDid.didState.did

    return createdDid.didState.did 
  }

  public async createW3cIndyBesuDid() {
    // Generate a random private key for the DID
    const privateKey = crypto.randomBytes(32)
    this.didPrivateKey = new Uint8Array(privateKey)

    const assertKey = await this.agent.modules.askar.createKey({ keyType: KeyType.Ed25519 })

    const createdDid = await this.agent.dids.create<IndyBesuDidCreateOptions>({
      method: 'ethr',
      options: {
        verificationKeys: [
          {
            type: VerificationKeyType.Ed25519VerificationKey2018,
            key: assertKey,
            purpose: VerificationKeyPurpose.AssertionMethod,
          },
        ],
      },
      secret: {
        didPrivateKey: privateKey,
      },
    })

    if (createdDid.didState.state == 'failed') {
      throw new Error(createdDid.didState.reason)
    }

    console.log(purpleText(`Created DID${Color.Reset}: ${JSON.stringify(createdDid.didState.didDocument, null, 2)}`))

    this.issuerId = createdDid.didState.did
    return createdDid.didState.did 
  }

  public async importDid(registry: string) {
    // NOTE: we assume the did is already registered on the ledger, we just store the private key in the wallet
    // and store the existing did in the wallet
    // indy did is based on private key (seed)
    const unqualifiedIndyDid = '2jEvRuKmfBJTRa7QowDpNN'
    const indyDid = `did:indy:${indyNetworkConfig.indyNamespace}:${unqualifiedIndyDid}`

    const did = registry === RegistryOptions.indy ? indyDid : indyDid

    await this.agent.dids.import({
      did,
      overwrite: true,
      privateKeys: [
        {
          keyType: KeyType.Ed25519,
          privateKey: TypedArrayEncoder.fromString('afjdemoverysercure00000000000000'),
        },
      ],
    })
    this.issuerId = did
  }

  private async getConnectionRecord() {
    if (!this.outOfBandId) {
      throw Error(redText(Output.MissingConnectionRecord))
    }

    const [connection] = await this.agent.modules.connections.findAllByOutOfBandId(this.outOfBandId)

    if (!connection) {
      throw Error(redText(Output.MissingConnectionRecord))
    }

    return connection
  }

  private async printConnectionInvite() {
    const outOfBand = await this.agent.modules.oob.createInvitation()
    this.outOfBandId = outOfBand.id

    console.log(
      Output.ConnectionLink,
      outOfBand.outOfBandInvitation.toUrl({ domain: `http://localhost:${this.port}` }),
      '\n'
    )
  }

  private async waitForConnection() {
    if (!this.outOfBandId) {
      throw new Error(redText(Output.MissingConnectionRecord))
    }

    console.log('Waiting for Alice to finish connection...')

    const getConnectionRecord = (outOfBandId: string) =>
      new Promise<ConnectionRecord>((resolve, reject) => {
        // Start listener
        this.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, (e) => {
          if (e.payload.connectionRecord.outOfBandId !== outOfBandId) return

          resolve(e.payload.connectionRecord)
        })

        // Also retrieve the connection record by invitation if the event has already fired
        void this.agent.modules.connections.findAllByOutOfBandId(outOfBandId).then(([connectionRecord]) => {
          if (connectionRecord) {
            resolve(connectionRecord)
          }
        })
      })

    const connectionRecord = await getConnectionRecord(this.outOfBandId)

    await this.agent.modules.connections.returnWhenIsConnected(connectionRecord.id)
    console.log(greenText(Output.ConnectionEstablished))
  }

  public async setupConnection() {
    await this.printConnectionInvite()
    await this.waitForConnection()
  }

  private printSchema(name: string, version: string, attributes: string[]) {
    console.log(`\n\nThe credential definition will look like this:\n`)
    console.log(purpleText(`Name: ${Color.Reset}${name}`))
    console.log(purpleText(`Version: ${Color.Reset}${version}`))
    console.log(purpleText(`Attributes: ${Color.Reset}${attributes[0]}, ${attributes[1]}, ${attributes[2]}\n`))
  }

  public async registerSchema() {
    if (!this.issuerId) {
      throw new Error(redText('Missing anoncreds issuerId'))
    }

    if (!this.didPrivateKey) {
      throw new Error(redText('Missing DID private key'))
    }

    const schemaTemplate = {
      name: 'FaberCollege' + utils.uuid(),
      version: '1.0.0',
      attrNames: ['name', 'degree', 'date'],
      issuerId: this.issuerId,
    }
    this.printSchema(schemaTemplate.name, schemaTemplate.version, schemaTemplate.attrNames)
    console.log(greenText('Registering schema...\n', false))

    const { schemaState } = await this.agent.modules.anoncreds.registerSchema({
      schema: schemaTemplate,
      options: {
        secretKey: this.didPrivateKey,
      },
    })

    if (schemaState.state !== 'finished') {
      throw new Error(
        `Error registering schema: ${schemaState.state === 'failed' ? schemaState.reason : 'Not Finished'}`
      )
    }

    console.log(`Schema registered!\n${Color.Reset}`)

    console.log(purpleText(`Schema ID:${Color.Reset} ${schemaState.schemaId}\n`))

    this.schema = schemaState

    return schemaState
  }

  public async registerCredentialDefinition() {
    if (!this.issuerId) {
      throw new Error(redText('Missing anoncreds issuerId'))
    }

    if (!this.schema) {
      throw new Error(redText('Missing anoncreds schemaId'))
    }

    if (!this.didPrivateKey) {
      throw new Error(redText('Missing DID private key'))
    }

    console.log(greenText('Registering credential definition...\n', false))

    const { credentialDefinitionState } = await this.agent.modules.anoncreds.registerCredentialDefinition({
      credentialDefinition: {
        schemaId: this.schema.schemaId,
        issuerId: this.issuerId,
        tag: 'latest',
      },
      options: {
        secretKey: this.didPrivateKey,
      },
    })

    if (credentialDefinitionState.state !== 'finished') {
      throw new Error(
        `Error registering credential definition: ${
          credentialDefinitionState.state === 'failed' ? credentialDefinitionState.reason : 'Not Finished'
        }}`
      )
    }

    this.credentialDefinition = credentialDefinitionState

    console.log(`Credential definition registered!\n${Color.Reset}`)

    console.log(
      purpleText(`Credential definition ID:${Color.Reset} ${this.credentialDefinition.credentialDefinitionId}\n`)
    )

    return this.credentialDefinition
  }

  private async waitForAcceptCredential(recordId: string) {
    console.log('Waiting for Alice to accept credential...\n\n')

    const getCredentialExchangeRecord = (recordId: string) =>
      new Promise<CredentialExchangeRecord>((resolve, reject) => {
        this.agent.events.on(
          CredentialEventTypes.CredentialStateChanged,
          async ({ payload }: CredentialStateChangedEvent) => {
            if (recordId !== payload.credentialRecord.id) return

            const state = payload.credentialRecord.state
            if (
              state === CredentialState.Done ||
              state === CredentialState.Declined ||
              state === CredentialState.Abandoned
            ) {
              resolve(payload.credentialRecord)
            }
          }
        )
      })

    const record = await getCredentialExchangeRecord(recordId)

    switch (record.state) {
      case CredentialState.Done:
        console.log(greenText('Credential accepted!\n'))
        break
      case CredentialState.Declined:
        console.log(redText('Credential declined\n'))
        break
      case CredentialState.Abandoned:
        console.log(redText('Abandoned\n'))
    }
  }

  public async issueAnonCredsCredential(options?: { waitForAcceptance?: boolean }) {
    if (!this.credentialDefinition) {
      throw new Error(redText('Missing anoncreds credentialDefinitionId'))
    }
    const connectionRecord = await this.getConnectionRecord()
    

    const credential = {
      attributes: [
        { name: 'name', value: 'Alice Smith' },
        { name: 'degree', value: 'Computer Science' },
        { name: 'date', value: '01/01/2022' },
      ],
      credentialDefinitionId: this.credentialDefinition.credentialDefinitionId,
    }

    const record = await this.agent.modules.credentials.offerCredential({
      connectionId: connectionRecord.id,
      protocolVersion: 'v2',
      credentialFormats: { anoncreds: credential },
    })

    
    console.log(purpleText(`Credential:${Color.Reset} ${JSON.stringify(credential, null, 2)}`))
    console.log('Go to the Alice agent to accept the credential offer\n')

    if (options?.waitForAcceptance) {
      await this.waitForAcceptCredential(record.id)
    }
    return record
  }

  public async issueJsonLdCredential(options?: { waitForAcceptance?: boolean }) {
    if (!this.issuerId) {
      throw new Error(redText('Missing issuerDid'))
    }

    const connectionRecord = await this.getConnectionRecord()

    

    const credential = {
      '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://www.w3.org/2018/credentials/examples/v1'],
      type: ['VerifiableCredential', 'FaberCollege'],
      issuer: this.issuerId,
      issuanceDate: '2023-12-07T12:23:48Z',
      credentialSubject: {
        name: 'Alice Smith',
        degree: 'Computer Science',
      },
    }

    const record = await this.agent.modules.credentials.offerCredential({
      connectionId: connectionRecord.id,
      protocolVersion: 'v2',
      credentialFormats: {
        jsonld: {
          credential: credential,
          options: {
            proofType: 'Ed25519Signature2018',
            proofPurpose: 'assertionMethod',
          },
        },
      },
    })

    
    console.log(purpleText(`Credential:${Color.Reset} ${JSON.stringify(credential, null, 2)}`))
    console.log('Go to the Alice agent to accept the credential offer\n')

    if (options?.waitForAcceptance) {
      await this.waitForAcceptCredential(record.id)
    }
    return record
  }

  private async printProofFlow(print: string) {
    
    await new Promise((f) => setTimeout(f, 2000))
  }

  private async newProofAttribute() {
    await this.printProofFlow(greenText(`Creating new proof attribute for 'name' ...\n`))
    const proofAttribute = {
      name: {
        name: 'name',
        restrictions: [
          {
            cred_def_id: this.credentialDefinition?.credentialDefinitionId,
          },
        ],
      },
    }

    return proofAttribute
  }

  private async waitForProof(recordId: string) {
    console.log('Waiting for Alice to present proof...\n\n')

    const getCredentialExchangeRecord = (recordId: string) =>
      new Promise<ProofExchangeRecord>((resolve, reject) => {
        this.agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
          if (recordId !== payload.proofRecord.id) return

          const state = payload.proofRecord.state
          if (state === ProofState.Done || state === ProofState.Declined || state === ProofState.Abandoned) {
            resolve(payload.proofRecord)
          }
        })
      })

    const record = await getCredentialExchangeRecord(recordId)

    switch (record.state) {
      case ProofState.Done:
        console.log(greenText('Proof presented!\n'))

        const formatData = await this.agent.modules.proofs.getFormatData(recordId)
        const revealedAttrs = formatData.presentation?.anoncreds?.requested_proof.revealed_attrs

        if (revealedAttrs) {
          console.log(purpleText(`Revealed attributes:${Color.Reset} ${JSON.stringify(revealedAttrs, null, 2)}\n\n`))
        }
        break
      case ProofState.Declined:
        console.log(redText('Proof request declined\n'))
        break
      case ProofState.Abandoned:
        console.log(redText('Abandoned\n'))
    }
  }

  public async sendAnonCredsProofRequest(options?: { waitForPresentation?: boolean }) {
    const connectionRecord = await this.getConnectionRecord()
    const proofAttribute = await this.newProofAttribute()
    await this.printProofFlow(greenText('\nRequesting proof...\n', false))

    const request = {
      protocolVersion: 'v2' as const,
      connectionId: connectionRecord.id,
      proofFormats: {
        anoncreds: {
          name: 'proof-request',
          version: '1.0',
          requested_attributes: proofAttribute,
        },
      },
    } as RequestProofOptions<[V2ProofProtocol<[AnonCredsProofFormatService]>]>

    const record = await this.agent.modules.proofs.requestProof(request)

   

    console.log(purpleText(`Proof request:${Color.Reset} ${JSON.stringify(request, null, 2)}`))
    console.log(`Go to the Alice agent to accept the proof request\n`)

    if (options?.waitForPresentation) {
      await this.waitForProof(record.id)
    }

    return record
  }

  public async sendJsonLdProofRequest(options?: { waitForPresentation?: boolean }) {
    const connectionRecord = await this.getConnectionRecord();

    // Adjust this to fit the JSON-LD credential you issued
    const request = {
      protocolVersion: 'v2' as const,
      connectionId: connectionRecord.id,
      proofFormats: {
        jsonld: {
          presentationDefinition: {
            id: 'degree-proof',
            input_descriptors: [
              {
                id: 'degree',
                schema: [{ uri: 'https://www.w3.org/2018/credentials#VerifiableCredential' }],
                constraints: {
                  fields: [
                    {
                      path: ['$.credentialSubject.degree'],
                      filter: { type: 'string' },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };

    const record = await this.agent.modules.proofs.requestProof(request as any);

    
    if (options?.waitForPresentation) {
      await this.waitForProof(record.id);
    }

    return record;
  }

  public async sendMessage(message: string) {
    const connectionRecord = await this.getConnectionRecord()
    await this.agent.modules.basicMessages.sendMessage(connectionRecord.id, message)
  }

  public async exit() {
    console.log(Output.Exit)
    await this.agent.shutdown()
    process.exit(0)
  }

  public async restart() {
    await this.agent.shutdown()
  }
}
