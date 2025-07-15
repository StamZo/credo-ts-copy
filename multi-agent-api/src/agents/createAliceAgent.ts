import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@credo-ts/didcomm'
import { CredentialState, ProofState } from '@credo-ts/didcomm'

import { BaseAgent } from './BaseAgent'
import { greenText, Output, redText } from './OutputClass'

export class createAliceAgent extends BaseAgent {
  public connected: boolean
  public connectionRecordFaberId?: string

  public constructor(port: number, name: string) {
    super({ port, name })
    this.connected = false
  }

  public static async build(): Promise<createAliceAgent> {
    const alice = new createAliceAgent(9000, 'alice')
    await alice.initializeAgent()
    return alice
  }

  private async getConnectionRecord() {
    if (!this.connectionRecordFaberId) {
      throw Error(redText(Output.MissingConnectionRecord))
    }
    
    // Access connections module directly
    const connections = this.agent.modules.connections
    if (!connections) {
      throw Error(redText('Connections module not found'))
    }
    
    return await connections.getById(this.connectionRecordFaberId)
  }

  private async receiveConnectionRequest(invitationUrl: string) {
    // Access out-of-band module directly
    const outOfBand = this.agent.modules.oob || this.agent.modules.outOfBand
    if (!outOfBand) {
      throw Error(redText('OutOfBand module not found'))
    }
    
    const { connectionRecord } = await outOfBand.receiveInvitationFromUrl(invitationUrl)
    if (!connectionRecord) {
      throw new Error(redText(Output.NoConnectionRecordFromOutOfBand))
    }
    return connectionRecord
  }

  private async waitForConnection(connectionRecord: ConnectionRecord) {
    // Access connections module directly
    const connections = this.agent.modules.connections
    if (!connections) {
      throw Error(redText('Connections module not found'))
    }
    
    const finalConnectionRecord = await connections.returnWhenIsConnected(connectionRecord.id)
    this.connected = true
    console.log(greenText(Output.ConnectionEstablished))
    return finalConnectionRecord.id
  }

  public async acceptConnection(invitation_url: string) {
    const connectionRecord = await this.receiveConnectionRequest(invitation_url)
    this.connectionRecordFaberId = await this.waitForConnection(connectionRecord)
  }

  public async acceptCredentialOffer(credentialRecord: CredentialExchangeRecord) {
    // Access credentials module directly
    const credentials = this.agent.modules.credentials
    if (!credentials) {
      throw Error(redText('Credentials module not found'))
    }
    
    await credentials.acceptOffer({
      credentialRecordId: credentialRecord.id,
    })
  }

  public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
    // Access proofs module directly
    const proofs = this.agent.modules.proofs
    if (!proofs) {
      throw Error(redText('Proofs module not found'))
    }
    
    const requestedCredentials = await proofs.selectCredentialsForRequest({
      proofRecordId: proofRecord.id,
    })

    await proofs.acceptRequest({
      proofRecordId: proofRecord.id,
      proofFormats: requestedCredentials.proofFormats,
    })
    console.log(greenText('\nProof request accepted!\n'))
  }

  public async sendMessage(message: string) {
    const connectionRecord = await this.getConnectionRecord()
    
    // Access basic messages module directly
    const basicMessages = this.agent.modules.basicMessages
    if (!basicMessages) {
      throw Error(redText('BasicMessages module not found'))
    }
    
    await basicMessages.sendMessage(connectionRecord.id, message)
  }

  public async exit() {
    console.log(Output.Exit)
    await this.agent.shutdown()
    process.exit(0)
  }

  public async restart() {
    await this.agent.shutdown()
  }

  public async acceptAllCredentialOffers() {
    // Access credentials module directly
    const credentials = this.agent.modules.credentials
    if (!credentials) {
      throw Error(redText('Credentials module not found'))
    }
    
    const records = await credentials.findAllByQuery({ state: CredentialState.OfferReceived })
    for (const record of records) {
      await credentials.acceptOffer({ credentialRecordId: record.id })
    }
  }

  public async acceptAllProofRequests() {
    // Access proofs module directly
    const proofs = this.agent.modules.proofs
    if (!proofs) {
      throw Error(redText('Proofs module not found'))
    }
    
    const records = await proofs.findAllByQuery({ state: ProofState.RequestReceived })
    for (const record of records) {
      await this.acceptProofRequest(record)
    }
  }
}
