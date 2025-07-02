import express from 'express'
import { createFaberAgent } from './agents/createFaberAgent'
import { createAliceAgent } from './agents/createAliceAgent'

const app = express()
app.use(express.json())

let agents: any = {}

async function setupAgents() {
  const faber = await createFaberAgent.build()
  const alice = await createAliceAgent.build()

  agents = { faber, alice }
  console.log('Agents initialized.')
}

app.get('/', (req, res) => {
  res.send('Multi-Agent API is running.')
})

app.get('/status', (req, res) => {
  res.json({
    agents: Object.keys(agents),
  })
})

setupAgents().then(() => {
  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000')
  })
})

app.post('/connections/invite', async (req, res) => {
  try {
    // Faber creates an invitation
    const outOfBand = await agents.faber.agent.oob.createInvitation()
    agents.faber.outOfBandId = outOfBand.id

    // Return invitation URL for Alice to use
    const inviteUrl = outOfBand.outOfBandInvitation.toUrl({ domain: `http://localhost:4000` })
    res.json({ inviteUrl })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.post('/connections/accept', async (req, res) => {
  try {
    const { inviteUrl } = req.body
    // Alice accepts the invitation
    await agents.alice.acceptConnection(inviteUrl)
    res.json({ status: 'Alice connected to Faber!' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


app.post('/credentials/register-schema', async (req, res) => {
  try {
    const result = await agents.faber.registerSchema()
    res.json({ schemaId: result.schemaId })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


app.post('/credentials/register-creddef', async (req, res) => {
  try {
    const result = await agents.faber.registerCredentialDefinition()
    res.json({ credDefId: result.credentialDefinitionId })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


app.post('/credentials/issue', async (req, res) => {
  try {
    const { to, type = 'anoncreds', waitForAcceptance = false } = req.body;
    const agent = to === 'alice' ? agents.faber : agents.faber; // (can improve later)
    let record;

    if (type === 'anoncreds') {
      record = await agent.issueAnonCredsCredential({ waitForAcceptance });
    } else if (type === 'jsonld') {
      record = await agent.issueJsonLdCredential({ waitForAcceptance });
    } else {
      throw new Error('Unknown credential type');
    }

    res.json({ status: 'Credential offer sent', credentialRecordId: record.id, type });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


app.get('/credentials/:id/status', async (req, res) => {
  try {
    const record = await agents.faber.agent.credentials.findById(req.params.id)
    res.json({ id: record.id, state: record.state })
  } catch (error) {
    res.status(404).json({ error: "Credential record not found" })
  }
})




app.post('/credentials/accept', async (req, res) => {
  try {
    await agents.alice.acceptAllCredentialOffers()
    res.json({ status: 'Alice accepted all credential offers.' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.post('/agent/create-did', async (req, res) => {
  try {
    const type = req.body?.type || 'anoncreds'
    let did: string

    if (type === 'anoncreds') {
      did = await agents.faber.createIndyBesuDid()
    } else if (type === 'w3c') {
      did = await agents.faber.createW3cIndyBesuDid()
    } else {
      throw new Error('Unknown DID type')
    }

    res.json({ status: `DID created for Faber (${type})`, did })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


app.post('/proof/request', async (req, res) => {
  try {
    const { type = 'anoncreds', waitForPresentation = false } = req.body;
    let record;
    if (type === 'anoncreds') {
      record = await agents.faber.sendAnonCredsProofRequest({ waitForPresentation });
    } else if (type === 'jsonld') {
      record = await agents.faber.sendJsonLdProofRequest({ waitForPresentation });
    } else {
      throw new Error('Unknown proof type');
    }

    if (!record || !record.id) {
      return res.status(500).json({ error: "No proof record returned" });
    }
    res.json({ status: 'Proof request sent', proofRecordId: record.id, type });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


app.post('/proof/accept', async (req, res) => {
  try {
    await agents.alice.acceptAllProofRequests()
    res.json({ status: 'Alice accepted all proof requests.' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/proof/:id/status', async (req, res) => {
  try {
    const id = req.params.id
    const record = await agents.faber.agent.proofs.findById(id)

    let revealedAttributes = undefined

    if (record.state === 'done') {
      // Get the format data
      const formatData = await agents.faber.agent.proofs.getFormatData(id)
      revealedAttributes = formatData.presentation?.anoncreds?.requested_proof?.revealed_attrs || {}
    }

    res.json({
      id: record.id,
      state: record.state,
      ...(revealedAttributes !== undefined && { revealedAttributes }),
    })
  } catch (error) {
    res.status(404).json({ error: 'Proof record not found' })
  }
})

