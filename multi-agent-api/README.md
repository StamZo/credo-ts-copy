<<<<<<< HEAD
<h1 align="center"><b>DEMO</b></h1>

This is the Aries Framework Javascript demo. Walk through the AFJ flow yourself together with agents Alice and Faber.
=======
# Multi-Agent Credo API Demo

This is the Credo Framework JavaScript demo, migrated from Aries Framework JavaScript. Walk through the Credo flow with agents Alice and Faber using the new Indy Besu VDR package.
>>>>>>> cea78ecd (staff ad api)

Alice, a former student of Faber College, connects with the College, is issued a credential about her degree and then is asked by the College for a proof.

## Features

<<<<<<< HEAD
- ✅ Creating a connection
- ✅ Offering a credential
- ✅ Requesting a proof
- ✅ Sending basic messages

## Getting Started

### Platform Specific Setup

In order to use Aries Framework JavaScript some platform specific dependencies and setup is required. See our guides below to quickly set up you project with Aries Framework JavaScript for NodeJS, React Native and Electron.

- [NodeJS](https://aries.js.org/guides/getting-started/installation/nodejs)

### Run the demo

These are the steps for running the AFJ demo:

Clone the AFJ git repository:

```sh
git clone https://github.com/hyperledger/aries-framework-javascript.git
```

Open two different terminals next to each other and in both, go to the demo folder:

```sh
cd aries-framework-javascript/demo
```

Install the project in one of the terminals:

```sh
yarn install
```

In the left terminal run Alice:

```sh
yarn alice
```

In the right terminal run Faber:

```sh
yarn faber
```

### Usage

To set up a connection:

- Select 'receive connection invitation' in Alice and 'create connection invitation' in Faber
- Faber will print a invitation link which you then copy and paste to Alice
- You have now set up a connection!

To offer a credential:

- Select 'offer credential' in Faber
- Faber will start with registering a schema and the credential definition accordingly
- You have now send a credential offer to Alice!
- Go to Alice to accept the incoming credential offer by selecting 'yes'.

To request a proof:

- Select 'request proof' in Faber
- Faber will create a new proof attribute and will then send a proof request to Alice!
- Go to Alice to accept the incoming proof request

To send a basic message:

- Select 'send message' in either one of the Agents
- Type your message and press enter
- Message sent!

Exit:

- Select 'exit' to shutdown the agent.

Restart:

- Select 'restart', to shutdown the current agent and start a new one
=======
- ✅ Creating connections
- ✅ Creating DIDs on Indy Besu (Ethereum-based ledger)
- ✅ Registering schemas and credential definitions
- ✅ Offering AnonCreds and JSON-LD credentials
- ✅ Requesting AnonCreds and JSON-LD proofs
- ✅ Sending basic messages
- ✅ RESTful API for automation

## Prerequisites

Before running the demo, you need:

1. **Node.js** (v18 or higher)
2. **Yarn** package manager
3. **Running Indy Besu network** on `http://localhost:8545`
4. **Deployed smart contracts** for DID registry, schema registry, and credential definition registry

### Indy Besu Network Setup

Make sure you have a local Indy Besu network running with the required smart contracts deployed at these addresses:
- DID Registry: `0x0000000000000000000000000000000000018888`
- Schema Registry: `0x0000000000000000000000000000000000005555`
- Credential Definition Registry: `0x0000000000000000000000000000000000004444`

## Getting Started

### Installation

1. Clone the repository and navigate to the multi-agent-api folder:
```bash
cd multi-agent-api
```

2. Install dependencies:
```bash
yarn install
```

### Running the API Server

Start the API server:
```bash
yarn dev
```

The server will start at `http://localhost:4000`

### API Endpoints

#### Health Check
```bash
GET /health
GET /status
```

#### DID Management
```bash
# Create a DID for Faber (required before issuing credentials)
POST /agent/create-did
{
  "type": "anoncreds" // or "w3c"
}
```

#### Connection Management
```bash
# 1. Faber creates an invitation
POST /connections/invite

# 2. Alice accepts the invitation
POST /connections/accept
{
  "inviteUrl": "http://localhost:4000?oob=..."
}
```

#### Schema and Credential Definition
```bash
# 3. Register a schema (required for AnonCreds)
POST /credentials/register-schema

# 4. Register a credential definition (required for AnonCreds)
POST /credentials/register-creddef
```

#### Credential Issuance
```bash
# 5. Issue a credential
POST /credentials/issue
{
  "to": "alice",
  "type": "anoncreds", // or "jsonld"
  "waitForAcceptance": false
}

# 6. Alice accepts credentials
POST /credentials/accept

# Check credential status
GET /credentials/{id}/status
```

#### Proof Requests
```bash
# 7. Request a proof
POST /proof/request
{
  "type": "anoncreds", // or "jsonld"
  "waitForPresentation": false
}

# 8. Alice accepts proof requests
POST /proof/accept

# Check proof status
GET /proof/{id}/status
```

#### Messaging
```bash
# Send a message
POST /messages/send
{
  "from": "faber", // or "alice"
  "message": "Hello!"
}
```

### Complete Workflow Example

Here's a complete workflow using curl commands:

```bash
# 1. Check status
curl http://localhost:4000/status

# 2. Create DID for Faber
curl -X POST http://localhost:4000/agent/create-did \
  -H "Content-Type: application/json" \
  -d '{"type": "anoncreds"}'

# 3. Create connection invitation
curl -X POST http://localhost:4000/connections/invite

# 4. Accept connection (use the inviteUrl from step 3)
curl -X POST http://localhost:4000/connections/accept \
  -H "Content-Type: application/json" \
  -d '{"inviteUrl": "YOUR_INVITE_URL_HERE"}'

# 5. Register schema
curl -X POST http://localhost:4000/credentials/register-schema

# 6. Register credential definition
curl -X POST http://localhost:4000/credentials/register-creddef

# 7. Issue credential
curl -X POST http://localhost:4000/credentials/issue \
  -H "Content-Type: application/json" \
  -d '{"to": "alice", "type": "anoncreds"}'

# 8. Accept credential
curl -X POST http://localhost:4000/credentials/accept

# 9. Request proof
curl -X POST http://localhost:4000/proof/request \
  -H "Content-Type: application/json" \
  -d '{"type": "anoncreds"}'

# 10. Accept proof request
curl -X POST http://localhost:4000/proof/accept
```

## Key Changes from Aries Framework JavaScript

1. **Package Names**: All imports changed from `@aries-framework/*` to `@credo-ts/*`
2. **Indy Besu VDR**: Added support for Ethereum-based ledger using your custom `@credo-ts/indy-besu-vdr` package
3. **DID Creation**: Now supports creating DIDs on Indy Besu with blockchain operations
4. **Timeout Protection**: Added timeout mechanisms to prevent hanging on blockchain operations
5. **Improved Error Handling**: Better error messages and status reporting

## Architecture

- **Framework**: Credo TypeScript
- **Ledger**: Indy Besu (Ethereum-based)
- **VDR**: Custom Indy Besu VDR package with WASM bindings
- **Wallet**: Aries Askar
- **Credentials**: AnonCreds and JSON-LD support
- **Transport**: HTTP

## Troubleshooting

### Common Issues

1. **Blockchain Connection Failed**: Make sure your Indy Besu network is running on `http://localhost:8545`
2. **Smart Contracts Not Found**: Ensure the required contracts are deployed at the expected addresses
3. **Transaction Timeouts**: The system includes 30-second timeouts to prevent hanging operations
4. **Memory Leaks**: If you experience memory issues, restart the agents

### Debug Mode

To enable debug logging, set the log level to debug in the agent configuration:

```typescript
logger: new ConsoleLogger(LogLevel.debug)
```

### Logs

The application provides extensive logging:
- 🚀 Agent initialization
- 📦 Module loading
- ⛓️ Blockchain operations
- 🔐 Signing operations
- 📡 Network communications

## Development

### Project Structure

```
multi-agent-api/
├── src/
│   ├── agents/
│   │   ├── BaseAgent.ts         # Base agent configuration
│   │   ├── createAliceAgent.ts  # Alice agent implementation
│   │   ├── createFaberAgent.ts  # Faber agent implementation
│   │   ├── Listener.ts          # Event listeners
│   │   ├── OutputClass.ts       # Console output utilities
│   │   └── setupAgent.ts        # Agent setup utilities
│   └── app.ts                   # Express API server
├── package.json
└── tsconfig.json
```

### Testing

The system includes built-in timeout protection and graceful error handling. Test the API endpoints individually to ensure proper functionality.

## Contributing

This demo showcases the migration from Aries Framework JavaScript to Credo with custom Indy Besu VDR integration. Feel free to extend it with additional features or improvements.

## License

Apache-2.0
>>>>>>> cea78ecd (staff ad api)
