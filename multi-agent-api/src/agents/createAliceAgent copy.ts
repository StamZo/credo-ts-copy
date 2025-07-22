// // createAliceAgent.ts (corrected)
// import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@credo-ts/core'
// import { CredentialState, ProofState } from '@credo-ts/core'

// import { BaseAgent } from './BaseAgent'
// import { greenText, Output, redText } from './OutputClass'
// import { AnonCredsRequestedAttributeMatch, AnonCredsCredentialInfo } from '@credo-ts/anoncreds'

// export class createAliceAgent extends BaseAgent {
//   public connected: boolean
//   public connectionRecordFaberId?: string

//   public constructor(port: number, name: string) {
//     super({ port, name })
//     this.connected = false
//   }

//   public static async build(): Promise<createAliceAgent> {
//     const alice = new createAliceAgent(9000, 'alice')
//     await alice.initializeAgent()
//     return alice
//   }

//   private async getConnectionRecord() {
//     if (!this.connectionRecordFaberId) {
//       throw Error(redText(Output.MissingConnectionRecord))
//     }
    
//     return await this.agent.connections.getById(this.connectionRecordFaberId)
//   }

//   private async receiveConnectionRequest(invitationUrl: string) {
//     console.log('🔍 Alice receiving invitation URL:', invitationUrl)
    
//     // Decode and inspect the invitation
//     const url = new URL(invitationUrl)
//     const oobParam = url.searchParams.get('oob')
//     if (oobParam) {
//       const invitation = JSON.parse(Buffer.from(oobParam, 'base64').toString())
//       console.log('🔍 Decoded invitation services:', invitation.services)
//     }

//    // In Credo-ts 0.5.x, outOfBand is accessed directly on the agent as agent.oob
//     const outOfBand = this.agent.oob
//     if (!outOfBand) {
//       throw new Error(redText('OutOfBand not found'))
//     }

//     const { connectionRecord } = await outOfBand.receiveInvitationFromUrl(invitationUrl)
    
//     if (!connectionRecord) {
//       throw new Error(redText(Output.NoConnectionRecordFromOutOfBand))
//     }
//     return connectionRecord
//   }

//   private async waitForConnection(connectionRecord: ConnectionRecord) {
//     const connections = this.agent.connections
//     if (!connections) {
//       throw Error(redText('Connections module not found'))
//     }
    
//     const finalConnectionRecord = await connections.returnWhenIsConnected(connectionRecord.id)
//     this.connected = true
//     console.log(greenText(Output.ConnectionEstablished))
//     return finalConnectionRecord.id
//   }

//   public async acceptConnection(invitation_url: string) {
//     try {
//       console.log('Alice receiving invitation URL:', invitation_url)
      
//       const connectionRecord = await this.receiveConnectionRequest(invitation_url)
//       this.connectionRecordFaberId = await this.waitForConnection(connectionRecord)
//     } catch (error) {
//       console.error('Error in acceptConnection:', error)
//       throw error
//     }
//   }

//   public async acceptCredentialOffer(credentialRecord: CredentialExchangeRecord) {
//     const credentials = this.agent.credentials
//     if (!credentials) {
//       throw Error(redText('Credentials module not found'))
//     }
    
//     await credentials.acceptOffer({
//       credentialRecordId: credentialRecord.id,
//     })
//   }

//   // public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
//   //   const proofs = this.agent.proofs
//   //   if (!proofs) {
//   //     throw Error(redText('Proofs module not found'))
//   //   }
    
//   //   const requestedCredentials = await proofs.selectCredentialsForRequest({
//   //     proofRecordId: proofRecord.id,
//   //   })

//   //   await proofs.acceptRequest({
//   //     proofRecordId: proofRecord.id,
//   //     proofFormats: requestedCredentials.proofFormats,
//   //   })
//   //   console.log(greenText('\nProof request accepted!\n'))
//   // }


// public async acceptProofRequest(proofRecord: ProofExchangeRecord) {
//   const proofs = this.agent.proofs
//   if (!proofs) {
//     throw Error(redText('Proofs module not found'))
//   }
  
//   let requestedCredentials
//   try {
//     requestedCredentials = await proofs.selectCredentialsForRequest({
//       proofRecordId: proofRecord.id,
//     })
//   } catch (error) {
//     console.log('Auto-selection failed, trying manual selection...')
//     // Print wallet path
//     console.log(`[acceptProofRequest] Using wallet at: ${this.agent.config.walletConfig?.storage?.path ?? 'default (in-memory or system default)'}`);  // Handle undefined

//     // Fetch and print all credentials
//     const credentials = await this.agent.credentials.getAll()
//     console.log(
//       "All credentials in Alice's wallet:",
//       JSON.stringify(
//         credentials.map((c) => ({
//           id: c.id,
//           state: c.state,
//           credDefId: c.metadata.get('_anoncreds/credential')?.credentialDefinitionId,
//         })),
//         null,
//         2
//       )
//     );

//     // Print requested attributes
//     const formatData = await proofs.getFormatData(proofRecord.id)
//     const requestedAttributes = formatData.request?.anoncreds?.requested_attributes || {}
//     console.log('Requested attributes:', JSON.stringify(requestedAttributes, null, 2))

//     // Manual selection logic
//     const selectedAttrs: Record<string, AnonCredsRequestedAttributeMatch> = {}
//     for (const attrName in requestedAttributes) {
//       const restriction = requestedAttributes[attrName].restrictions?.[0]
//       if (restriction) {
//         console.log('Looking for cred_def_id:', restriction.cred_def_id)
//         const matchingCred = credentials.find(
//           (cred) =>
//             cred.metadata.get('_anoncreds/credential')?.credentialDefinitionId ===
//             restriction.cred_def_id
//         )
//         console.log('Matching cred found?', !!matchingCred, matchingCred ? matchingCred.id : 'none')
//         if (matchingCred) {
//           const credInfo: AnonCredsCredentialInfo = await this.agent.modules.anoncreds.getCredential(
//             matchingCred.id
//           )
//           selectedAttrs[attrName] = {
//             credentialId: matchingCred.id,
//             credentialInfo: credInfo,
//             revealed: true,
//           }
//         }
//       }
//     }

//     if (Object.keys(selectedAttrs).length === 0) {
//       throw new Error('No matching credentials found for proof request')
//     }

//     requestedCredentials = {
//       proofFormats: {
//         anoncreds: {
//           attributes: selectedAttrs,
//           predicates: {},
//           selfAttestedAttributes: {},
//         },
//       },
//     }
//   }

//   await proofs.acceptRequest({
//     proofRecordId: proofRecord.id,
//     proofFormats: requestedCredentials.proofFormats,
//   })
//   console.log(greenText('\nProof request accepted!\n'))
//   // LOG wallet and creds AGAIN
//   const credentialsAfter = await this.agent.credentials.getAll()
//   console.log(`[AFTER acceptRequest] Using wallet at: ${this.agent.config.walletConfig?.storage?.path ?? 'default (in-memory or system default)'}`)
//   console.log('All credentials in Alice\'s wallet AFTER:', JSON.stringify(credentialsAfter.map(c => ({
//     id: c.id,
//     state: c.state,
//     credDefId: c.metadata.get('_anoncreds/credential')?.credentialDefinitionId
//   })), null, 2))
// }




//   public async sendMessage(message: string) {
//     const connectionRecord = await this.getConnectionRecord()
    
//     const basicMessages = this.agent.basicMessages
//     if (!basicMessages) {
//       throw Error(redText('BasicMessages module not found'))
//     }
    
//     await basicMessages.sendMessage(connectionRecord.id, message)
//   }

//   public async exit() {
//     console.log(Output.Exit)
//     await this.agent.shutdown()
//     process.exit(0)
//   }

//   public async restart() {
//     await this.agent.shutdown()
//   }

//   // public async acceptAllCredentialOffers() {
//   //   const credentials = this.agent.credentials
//   //   if (!credentials) {
//   //     throw Error(redText('Credentials module not found'))
//   //   }
    
//   //   const records = await credentials.findAllByQuery({ state: CredentialState.OfferReceived })
//   //   for (const record of records) {
//   //     await credentials.acceptOffer({ credentialRecordId: record.id })
//   //   }
//   // }

//   public async acceptAllCredentialOffers() {
//     const credentials = this.agent.credentials
//     if (!credentials) {
//       throw Error(redText('Credentials module not found'))
//     }
    
//     const records = await credentials.findAllByQuery({ state: CredentialState.OfferReceived })
//     for (const record of records) {
//       await credentials.acceptOffer({ credentialRecordId: record.id })
//       const acceptedCred = await credentials.getById(record.id)
//       console.log('Accepted credential details:', JSON.stringify(acceptedCred, null, 2)) 
//     }
//     console.log(greenText(`All credentials accepted. Total offers accepted: ${records.length}`))
//   }
  
// public async acceptAllProofRequests() {
//   const proofs = this.agent.proofs
//   if (!proofs) {
//     throw Error(redText('Proofs module not found'))
//   }
//   console.log("[Proofs Source] Agent wallet storage path:", this.agent.config.walletConfig?.storage?.path ?? "default (in-memory or system default)");

//   const records = await proofs.findAllByQuery({ state: ProofState.RequestReceived })
//   console.log("[Proofs Source] Storage type:", this.agent.config.walletConfig?.storage?.type ?? "not specified");

//   for (const record of records) {
//     const formatData = await proofs.getFormatData(record.id)
//     console.log({
//       from: this.agent.config.walletConfig?.storage?.path ?? 'unknown',
//       id: record.id,
//       threadId: record.threadId,
//       state: record.state,
//       requestedAttributes: formatData.request?.anoncreds?.requested_attributes
//     })
//   }
//   console.log("[Proofs Source] Agent wallet storage path:", this.agent.config.walletConfig?.storage?.path ?? "default (in-memory or system default)");
//   console.log("[Proofs Source] Storage type:", this.agent.config.walletConfig?.storage?.type ?? "not specified");
//   console.log('CWD:', process.cwd());
//   console.log('Wallet storage path (config):', this.agent.config.walletConfig?.storage?.path);

//   if (records.length === 0) {
//     console.log('No proof requests to accept')
//     return
//   }

//   // Delete old pending proof requests
//   // for (const record of records.slice(0, -1)) {  // All except the last
//   //   await proofs.deleteById(record.id)
//   //   console.log('Deleted old proof request:', record.id)
//   // }

//   // Accept ONLY the last one (the most recent)
//   const lastRecord = records[records.length - 1]
//   await this.acceptProofRequest(lastRecord)
// }





// }