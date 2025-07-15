import 'reflect-metadata';
import express from 'express'
import { createFaberAgent } from './agents/createFaberAgent'
import { createAliceAgent } from './agents/createAliceAgent'

const app: express.Application = express()
app.use(express.json())

let agents: any = {}

async function setupAgents() {
  try {
    console.log('Initializing agents...')
    const faber = await createFaberAgent.build()
    const alice = await createAliceAgent.build()

    agents = { faber, alice }
    console.log('✅ Agents initialized successfully.')
  } catch (error) {
    console.error('❌ Failed to initialize agents:', error)
    throw error
  }
}

app.get('/', (req, res) => {
  res.send('Multi-Agent Credo API is running.')
})

app.get('/status', (req, res) => {
  res.json({
    framework: 'Credo',
    agents: Object.keys(agents),
    indyBesuVdr: 'enabled',
  })
})

// Connection endpoints

// app.post('/connections/invite', async (req, res) => {
//   try {
//     // Faber creates an invitation
//     const outOfBand = await agents.faber.agent.modules.oob.createInvitation()
//     agents.faber.outOfBandId = outOfBand.id

//     // Return invitation URL for Alice to use
//     const inviteUrl = outOfBand.outOfBandInvitation.toUrl({ domain: `http://localhost:4000` })
//     res.json({ inviteUrl })
//   } catch (error) {
//     console.error('Error creating invitation:', error)
//     res.status(500).json({ error: (error as Error).message })
//   }
// })
// Connection endpoints
app.post('/connections/invite', async (req, res) => {
  try {
    // Faber creates an invitation with proper configuration
    const outOfBand = await agents.faber.agent.modules.outOfBand.createInvitation({
      // Ensure we have a proper configuration for the invitation
      multiUseInvitation: false,
      autoAcceptConnection: true,
    })
    agents.faber.outOfBandId = outOfBand.id

    // Return invitation URL for Alice to use
    const inviteUrl = outOfBand.outOfBandInvitation.toUrl({ domain: `http://localhost:9001` })
    res.json({ inviteUrl })
  } catch (error) {
    console.error('Error creating invitation:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})



app.post('/connections/accept', async (req, res) => {
  try {
    const { inviteUrl } = req.body
    if (!inviteUrl) {
      return res.status(400).json({ error: 'inviteUrl is required' })
    }
    
    // Alice accepts the invitation
    await agents.alice.acceptConnection(inviteUrl)
    res.json({ status: 'Alice connected to Faber!' })
  } catch (error) {
    console.error('Error accepting connection:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

// DID endpoints
app.post('/agent/create-did', async (req, res) => {
  try {
    const type = req.body?.type || 'anoncreds'
    let did: string

    if (type === 'anoncreds') {
      did = await agents.faber.createIndyBesuDid()
    } else if (type === 'w3c') {
      did = await agents.faber.createW3cIndyBesuDid()
    } else {
      throw new Error('Unknown DID type. Use "anoncreds" or "w3c"')
    }

    res.json({ status: `DID created for Faber (${type})`, did })
  } catch (error) {
    console.error('Error creating DID:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

// Schema and CredDef endpoints
app.post('/credentials/register-schema', async (req, res) => {
  try {
    if (!agents.faber.issuerId) {
      return res.status(400).json({ error: 'Please create a DID first using /agent/create-did' })
    }
    
    const result = await agents.faber.registerSchema()
    res.json({ schemaId: result.schemaId })
  } catch (error) {
    console.error('Error registering schema:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

app.post('/credentials/register-creddef', async (req, res) => {
  try {
    if (!agents.faber.schema) {
      return res.status(400).json({ error: 'Please register a schema first using /credentials/register-schema' })
    }
    
    const result = await agents.faber.registerCredentialDefinition()
    res.json({ credDefId: result.credentialDefinitionId })
  } catch (error) {
    console.error('Error registering credential definition:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

// Credential endpoints
app.post('/credentials/issue', async (req, res) => {
  try {
    const { to, type = 'anoncreds', waitForAcceptance = false } = req.body
    
    if (to !== 'alice') {
      return res.status(400).json({ error: 'Currently only "alice" is supported as recipient' })
    }
    
    const agent = agents.faber
    let record

    if (type === 'anoncreds') {
      if (!agent.credentialDefinition) {
        return res.status(400).json({ error: 'Please register a credential definition first' })
      }
      record = await agent.issueAnonCredsCredential({ waitForAcceptance })
    } else if (type === 'jsonld') {
      if (!agent.issuerId) {
        return res.status(400).json({ error: 'Please create a DID first' })
      }
      record = await agent.issueJsonLdCredential({ waitForAcceptance })
    } else {
      throw new Error('Unknown credential type. Use "anoncreds" or "jsonld"')
    }

    res.json({ 
      status: 'Credential offer sent', 
      credentialRecordId: record.id, 
      type,
      state: record.state 
    })
  } catch (error) {
    console.error('Error issuing credential:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

app.post('/credentials/accept', async (req, res) => {
  try {
    await agents.alice.acceptAllCredentialOffers()
    res.json({ status: 'Alice accepted all credential offers.' })
  } catch (error) {
    console.error('Error accepting credentials:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/credentials/:id/status', async (req, res) => {
  try {
    const record = await agents.faber.agent.modules.credentials.findById(req.params.id)
    res.json({ 
      id: record.id, 
      state: record.state,
      protocolVersion: record.protocolVersion,
      connectionId: record.connectionId 
    })
  } catch (error) {
    console.error('Error getting credential status:', error)
    res.status(404).json({ error: "Credential record not found" })
  }
})

// Proof endpoints
app.post('/proof/request', async (req, res) => {
  try {
    const { type = 'anoncreds', waitForPresentation = false } = req.body
    let record

    if (type === 'anoncreds') {
      if (!agents.faber.credentialDefinition) {
        return res.status(400).json({ error: 'Please register a credential definition first' })
      }
      record = await agents.faber.sendAnonCredsProofRequest({ waitForPresentation })
    } else if (type === 'jsonld') {
      if (!agents.faber.issuerId) {
        return res.status(400).json({ error: 'Please create a DID first' })
      }
      record = await agents.faber.sendJsonLdProofRequest({ waitForPresentation })
    } else {
      throw new Error('Unknown proof type. Use "anoncreds" or "jsonld"')
    }

    if (!record || !record.id) {
      return res.status(500).json({ error: "No proof record returned" })
    }
    
    res.json({ 
      status: 'Proof request sent', 
      proofRecordId: record.id, 
      type,
      state: record.state 
    })
  } catch (error) {
    console.error('Error requesting proof:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

app.post('/proof/accept', async (req, res) => {
  try {
    await agents.alice.acceptAllProofRequests()
    res.json({ status: 'Alice accepted all proof requests.' })
  } catch (error) {
    console.error('Error accepting proofs:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/proof/:id/status', async (req, res) => {
  try {
    const id = req.params.id
    const record = await agents.faber.agent.modules.proofs.findById(id)

    let revealedAttributes = undefined

    if (record.state === 'done') {
      try {
        // Get the format data
        const formatData = await agents.faber.agent.modules.proofs.getFormatData(id)
        revealedAttributes = formatData.presentation?.anoncreds?.requested_proof?.revealed_attrs || {}
      } catch (formatError) {
        console.warn('Could not get format data:', formatError)
      }
    }

    res.json({
      id: record.id,
      state: record.state,
      protocolVersion: record.protocolVersion,
      connectionId: record.connectionId,
      ...(revealedAttributes !== undefined && { revealedAttributes }),
    })
  } catch (error) {
    console.error('Error getting proof status:', error)
    res.status(404).json({ error: 'Proof record not found' })
  }
})

// Message endpoints
app.post('/messages/send', async (req, res) => {
  try {
    const { from, message } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' })
    }
    
    const agent = from === 'alice' ? agents.alice : agents.faber
    await agent.sendMessage(message)
    
    res.json({ status: `Message sent from ${from}`, message })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

// Health check with more details
app.get('/health', async (req, res) => {
  try {
    const faberStatus = agents.faber ? 'initialized' : 'not initialized'
    const aliceStatus = agents.alice ? 'initialized' : 'not initialized'
    
    res.json({
      status: 'healthy',
      framework: 'Credo',
      agents: {
        faber: faberStatus,
        alice: aliceStatus,
      },
      features: {
        indyBesuVdr: 'enabled',
        anoncreds: 'enabled',
        jsonld: 'enabled',
      }
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: (error as Error).message 
    })
  }
})

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message,
    framework: 'Credo'
  })
})

// Initialize agents and start server
setupAgents()
  .then(() => {
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log('🚀 Multi-Agent Credo API running at http://localhost:' + PORT)
      console.log('📋 Available endpoints:')
      console.log('  GET  /status - Agent status')
      console.log('  POST /agent/create-did - Create DID')
      console.log('  POST /connections/invite - Create invitation')
      console.log('  POST /connections/accept - Accept invitation')
      console.log('  POST /credentials/register-schema - Register schema')
      console.log('  POST /credentials/register-creddef - Register credential definition')
      console.log('  POST /credentials/issue - Issue credential')
      console.log('  POST /credentials/accept - Accept credentials')
      console.log('  POST /proof/request - Request proof')
      console.log('  POST /proof/accept - Accept proof requests')
      console.log('  GET  /health - Health check')
    })
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  })

export default app
