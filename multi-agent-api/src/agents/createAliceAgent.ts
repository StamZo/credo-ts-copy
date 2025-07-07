<<<<<<< HEAD
import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@aries-framework/core'
import { CredentialState, ProofState } from '@aries-framework/core'

=======
import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@credo-ts/core'
import { CredentialState, ProofState } from '@credo-ts/core'
>>>>>>> cea78ecd (staff ad api)

import { BaseAgent } from './BaseAgent'
import { greenText, Output, redText } from './OutputClass'

export class createAliceAgent extends BaseAgent {
  public connected: boolean
  public connectionRecordFaberId?: string

  public constructor(port: number, name: string) {
<<<<<<< HEAD
    super({ port, name, useLegacyIndySdk: true })
=======
    super({ port, name })
>>>>>>> cea78ecd (staff ad api)
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
<<<<<<< HEAD
    return await this.agent.connections.getById(this.connectionRecordFaberId)
  }

  private async receiveConnectionRequest(invitationUrl: string) {
    const { connectionRecord } = await this.agent.oob.receiveInvitationFromUrl(invitationUrl)
=======
    return await this.agent.modules.connections.getById(this.connectionRecordFaberId)
  }

  private async receiveConnectionRequest(invitationUrl: string) {
    const { connectionRecord } = await this.agent.modules.oob.receiveInvitationFromUrl(invitationUrl)
>>>>>>> cea78ecd (staff ad api)
    if (!connectionRecord) {
      throw new Error(redText(Output.NoConnectionRecordFromOutOfBand))
    }
    return connectionRecord
  }

  private async waitForConnection(connectionRecord: ConnectionRecord) {
<<<<<<< HEAD
    connectionRecord = await this.agent.connections.returnWhenIsConnected(connectionRecord.id)
=======
    connectionRecord = await this.agent.modules.connections.returnWhenIsConnected(connectionRecord.id)
>>>>>>> cea78ecd (staff ad api)
    this.connected = true
    console.log(greenText(Output.ConnectionEstablished))
    return connectionRecord.id
  }

  public async acceptConnection(invitation_url: string) {
    const connectionRecord = await this.receiveConnectionRequest(invitation_url)
    this.connectionRecordFaberId = await this.waitForConnection(connectionRecord)
  }

  public async acceptCredentialOffer(credentialRecord: CredentialExchangeRecord) {
<<<<<<< HEAD
    await this.agent.credentials.acceptOffer({
=======
    await this.agent.modules.credentials.acceptOffer({
>>>>>>> cea78ecd (staff ad api)
      credentialRecordId: credentialRecord.id,
    })
  }

  public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
<<<<<<< HEAD
    const requestedCredentials = await this.agent.proofs.selectCredentialsForRequest({
      proofRecordId: proofRecord.id,
    })

    await this.agent.proofs.acceptRequest({
=======
    const requestedCredentials = await this.agent.modules.proofs.selectCredentialsForRequest({
      proofRecordId: proofRecord.id,
    })

    await this.agent.modules.proofs.acceptRequest({
>>>>>>> cea78ecd (staff ad api)
      proofRecordId: proofRecord.id,
      proofFormats: requestedCredentials.proofFormats,
    })
    console.log(greenText('\nProof request accepted!\n'))
  }

  public async sendMessage(message: string) {
    const connectionRecord = await this.getConnectionRecord()
<<<<<<< HEAD
    await this.agent.basicMessages.sendMessage(connectionRecord.id, message)
=======
    await this.agent.modules.basicMessages.sendMessage(connectionRecord.id, message)
>>>>>>> cea78ecd (staff ad api)
  }

  public async exit() {
    console.log(Output.Exit)
    await this.agent.shutdown()
    process.exit(0)
  }

  public async restart() {
    await this.agent.shutdown()
  }

<<<<<<< HEAD
 public async acceptAllCredentialOffers() {
  const records = await this.agent.credentials.findAllByQuery({ state: CredentialState.OfferReceived })
  for (const record of records) {
    await this.agent.credentials.acceptOffer({ credentialRecordId: record.id })
  }
}

public async acceptAllProofRequests() {
  const records = await this.agent.proofs.findAllByQuery({ state: ProofState.RequestReceived })
  for (const record of records) {
    await this.acceptProofRequest(record)
  }
}



=======
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
>>>>>>> cea78ecd (staff ad api)
}