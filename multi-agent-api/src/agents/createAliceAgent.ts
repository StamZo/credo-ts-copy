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
    return await this.agent.modules.connections.getById(this.connectionRecordFaberId)
  }

  private async receiveConnectionRequest(invitationUrl: string) {
    const { connectionRecord } = await this.agent.modules.oob.receiveInvitationFromUrl(invitationUrl)
    if (!connectionRecord) {
      throw new Error(redText(Output.NoConnectionRecordFromOutOfBand))
    }
    return connectionRecord
  }

  private async waitForConnection(connectionRecord: ConnectionRecord) {
    connectionRecord = await this.agent.modules.connections.returnWhenIsConnected(connectionRecord.id)
    this.connected = true
    console.log(greenText(Output.ConnectionEstablished))
    return connectionRecord.id
  }

  public async acceptConnection(invitation_url: string) {
    const connectionRecord = await this.receiveConnectionRequest(invitation_url)
    this.connectionRecordFaberId = await this.waitForConnection(connectionRecord)
  }

  public async acceptCredentialOffer(credentialRecord: CredentialExchangeRecord) {
    await this.agent.modules.credentials.acceptOffer({
      credentialRecordId: credentialRecord.id,
    })
  }

  public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
    const requestedCredentials = await this.agent.modules.proofs.selectCredentialsForRequest({
      proofRecordId: proofRecord.id,
    })

    await this.agent.modules.proofs.acceptRequest({
      proofRecordId: proofRecord.id,
      proofFormats: requestedCredentials.proofFormats,
    })
    console.log(greenText('\nProof request accepted!\n'))
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

  public async acceptAllCredentialOffers() {
    const records = await this.agent.modules.credentials.findAllByQuery({ state: CredentialState.OfferReceived })
    for (const record of records) {
      await this.agent.modules.credentials.acceptOffer({ credentialRecordId: record.id })
    }
  }

  public async acceptAllProofRequests() {
    const records = await this.agent.modules.proofs.findAllByQuery({ state: ProofState.RequestReceived })
    for (const record of records) {
      await this.acceptProofRequest(record)
    }
  }
}
