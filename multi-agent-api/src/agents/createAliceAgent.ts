// createAliceAgent.ts (corrected)
import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@credo-ts/core'
import { CredentialState, ProofState } from '@credo-ts/core'

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
    
    return await this.agent.connections.getById(this.connectionRecordFaberId)
  }

  private async receiveConnectionRequest(invitationUrl: string) {
    console.log('🔍 Alice receiving invitation URL:', invitationUrl)
    
    // Decode and inspect the invitation
    const url = new URL(invitationUrl)
    const oobParam = url.searchParams.get('oob')
    if (oobParam) {
      const invitation = JSON.parse(Buffer.from(oobParam, 'base64').toString())
      console.log('🔍 Decoded invitation services:', invitation.services)
    }

   // In Credo-ts 0.5.x, outOfBand is accessed directly on the agent as agent.oob
    const outOfBand = this.agent.oob
    if (!outOfBand) {
      throw new Error(redText('OutOfBand not found'))
    }

    const { connectionRecord } = await outOfBand.receiveInvitationFromUrl(invitationUrl)
    
    if (!connectionRecord) {
      throw new Error(redText(Output.NoConnectionRecordFromOutOfBand))
    }
    return connectionRecord
  }

  private async waitForConnection(connectionRecord: ConnectionRecord) {
    const connections = this.agent.connections
    if (!connections) {
      throw Error(redText('Connections module not found'))
    }
    
    const finalConnectionRecord = await connections.returnWhenIsConnected(connectionRecord.id)
    this.connected = true
    console.log(greenText(Output.ConnectionEstablished))
    return finalConnectionRecord.id
  }

  public async acceptConnection(invitation_url: string) {
    try {
      console.log('Alice receiving invitation URL:', invitation_url)
      
      const connectionRecord = await this.receiveConnectionRequest(invitation_url)
      this.connectionRecordFaberId = await this.waitForConnection(connectionRecord)
    } catch (error) {
      console.error('Error in acceptConnection:', error)
      throw error
    }
  }

  public async acceptCredentialOffer(credentialRecord: CredentialExchangeRecord) {
    const credentials = this.agent.credentials
    if (!credentials) {
      throw Error(redText('Credentials module not found'))
    }
    
    await credentials.acceptOffer({
      credentialRecordId: credentialRecord.id,
    })
  }

  public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
    const proofs = this.agent.proofs
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
    
    const basicMessages = this.agent.basicMessages
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
    const credentials = this.agent.credentials
    if (!credentials) {
      throw Error(redText('Credentials module not found'))
    }
    
    const records = await credentials.findAllByQuery({ state: CredentialState.OfferReceived })
    for (const record of records) {
      await credentials.acceptOffer({ credentialRecordId: record.id })
    }
  }

  public async acceptAllProofRequests() {
    const proofs = this.agent.proofs
    if (!proofs) {
      throw Error(redText('Proofs module not found'))
    }
    
    const records = await proofs.findAllByQuery({ state: ProofState.RequestReceived })
    for (const record of records) {
      await this.acceptProofRequest(record)
    }
  }
}