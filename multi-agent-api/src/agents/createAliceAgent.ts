// createAliceAgent.ts (with proof request cleanup)
import type { ConnectionRecord, CredentialExchangeRecord, ProofExchangeRecord } from '@credo-ts/core'
import { CredentialState, ProofState } from '@credo-ts/core'

import { BaseAgent } from './BaseAgent'
import { greenText, Output, redText } from './OutputClass'
import { AnonCredsRequestedAttributeMatch, AnonCredsCredentialInfo } from '@credo-ts/anoncreds'

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
    
    // Clean up old proof requests on startup
    await alice.cleanupOldProofRequests()
    
    return alice
  }

  private async cleanupOldProofRequests() {
    const proofs = this.agent.proofs
    if (!proofs) {
      console.log('Proofs module not found during cleanup')
      return
    }

    try {
      // Get all proof records
      const allProofRecords = await proofs.findAllByQuery({})
      console.log(`Found ${allProofRecords.length} total proof records in wallet`)

      // Delete only old/problematic proof requests
      let cleanedCount = 0
      for (const record of allProofRecords) {
        // Check if this is an old proof request by checking the credential definition ID
        if (record.state === ProofState.RequestReceived) {
          try {
            const formatData = await proofs.getFormatData(record.id)
            const requestedAttributes = formatData.request?.anoncreds?.requested_attributes || {}
            let isOld = false
            
            // Check if any restriction references a non-existent credential definition
            for (const attrName in requestedAttributes) {
              const restriction = requestedAttributes[attrName].restrictions?.[0]
              if (restriction?.cred_def_id) {
                // Check if we have a credential matching this cred_def_id
                const credentials = await this.agent.credentials.getAll()
                const hasMatchingCred = credentials.some(cred => 
                  cred.metadata.get('_anoncreds/credential')?.credentialDefinitionId === restriction.cred_def_id
                )
                if (!hasMatchingCred) {
                  isOld = true
                  console.log(`Found old proof request referencing non-existent cred_def: ${restriction.cred_def_id}`)
                  break
                }
              }
            }
            
            if (isOld) {
              await proofs.deleteById(record.id)
              console.log(`Cleaned up old proof request: ${record.id}`)
              cleanedCount++
            }
          } catch (error) {
            // If we can't check the format data, it's probably corrupted
            await proofs.deleteById(record.id)
            console.log(`Cleaned up corrupted proof request: ${record.id}`)
            cleanedCount++
          }
        } else if (record.state === ProofState.Abandoned || record.state === ProofState.Declined) {
          // Always clean up abandoned or declined proofs
          await proofs.deleteById(record.id)
          console.log(`Cleaned up ${record.state} proof: ${record.id}`)
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        console.log(greenText(`Cleaned up ${cleanedCount} old/invalid proof requests\n`))
      } else {
        console.log('No old proof requests to clean up')
      }
    } catch (error) {
      console.warn('Error during proof request cleanup:', error)
    }
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
    
    try {
      // First try automatic selection
      const requestedCredentials = await proofs.selectCredentialsForRequest({
        proofRecordId: proofRecord.id,
      })

      await proofs.acceptRequest({
        proofRecordId: proofRecord.id,
        proofFormats: requestedCredentials.proofFormats,
      })
      console.log(greenText('\nProof request accepted!\n'))
    } catch (error) {
      console.log('Auto-selection failed, trying manual selection...')
      
      // Get proof request details
      const formatData = await proofs.getFormatData(proofRecord.id)
      const requestedAttributes = formatData.request?.anoncreds?.requested_attributes || {}
      console.log('Requested attributes:', JSON.stringify(requestedAttributes, null, 2))

      // Get all credentials
      const credentials = await this.agent.credentials.getAll()
      console.log(`Found ${credentials.length} credentials in wallet`)

      // Manual selection
      const selectedAttrs: Record<string, AnonCredsRequestedAttributeMatch> = {}
      
      for (const attrName in requestedAttributes) {
        const restriction = requestedAttributes[attrName].restrictions?.[0]
        if (restriction && restriction.cred_def_id) {
          console.log(`Looking for credential with cred_def_id: ${restriction.cred_def_id}`)
          
          const matchingCred = credentials.find(cred => {
            const credDefId = cred.metadata.get('_anoncreds/credential')?.credentialDefinitionId
            return credDefId === restriction.cred_def_id && cred.state === CredentialState.Done
          })

          if (matchingCred) {
            console.log(`Found matching credential: ${matchingCred.id}`)
            const credInfo: AnonCredsCredentialInfo = await this.agent.modules.anoncreds.getCredential(
              matchingCred.id
            )
            selectedAttrs[attrName] = {
              credentialId: matchingCred.id,
              credentialInfo: credInfo,
              revealed: true,
            }
          } else {
            console.log(`No matching credential found for ${restriction.cred_def_id}`)
          }
        }
      }

      if (Object.keys(selectedAttrs).length === 0) {
        throw new Error('No matching credentials found for proof request')
      }

      const requestedCredentials = {
        proofFormats: {
          anoncreds: {
            attributes: selectedAttrs,
            predicates: {},
            selfAttestedAttributes: {},
          },
        },
      }

      await proofs.acceptRequest({
        proofRecordId: proofRecord.id,
        proofFormats: requestedCredentials.proofFormats,
      })
      console.log(greenText('\nProof request accepted with manual selection!\n'))
    }
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
      const acceptedCred = await credentials.getById(record.id)
      console.log('Accepted credential details:', JSON.stringify({
        id: acceptedCred.id,
        credDefId: acceptedCred.metadata.get('_anoncreds/credential')?.credentialDefinitionId,
        state: acceptedCred.state
      }, null, 2)) 
    }
    console.log(greenText(`All credentials accepted. Total offers accepted: ${records.length}`))
  }
  
  public async acceptAllProofRequests() {
    const proofs = this.agent.proofs
    if (!proofs) {
      throw Error(redText('Proofs module not found'))
    }

    // Wait a bit to ensure proof requests have been received
    console.log('Waiting for proof requests to arrive...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // First, clean up any old/stale proof requests
    await this.cleanupOldProofRequests()

    // Now get only the current RequestReceived proof requests
    const records = await proofs.findAllByQuery({ state: ProofState.RequestReceived })
    console.log(`[acceptAllProofRequests] Found ${records.length} proof requests to accept`)

    if (records.length === 0) {
      console.log('No proof requests to accept')
      // Let's check if there are any proof requests in other states
      const allProofs = await proofs.findAllByQuery({})
      console.log('All proof records:')
      for (const proof of allProofs) {
        console.log(`- ${proof.id}: state=${proof.state}, connectionId=${proof.connectionId}`)
      }
      return
    }

    // Process each proof request
    for (const record of records) {
      try {
        console.log(`\nProcessing proof request ${record.id}...`)
        await this.acceptProofRequest(record)
      } catch (error) {
        console.error(`Failed to accept proof request ${record.id}:`, error)
        // Try to delete the problematic proof request
        try {
          await proofs.deleteById(record.id)
          console.log(`Deleted problematic proof request: ${record.id}`)
        } catch (deleteError) {
          console.error(`Failed to delete proof request ${record.id}:`, deleteError)
        }
      }
    }
  }
}