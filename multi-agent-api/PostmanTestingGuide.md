# Postman Testing Guide for Credo Multi-Agent API

## 🚀 Quick Start

### Prerequisites
1. Make sure your Indy Besu network is running on `http://localhost:8545`
2. Install dependencies: `yarn install`
3. Start the API server: `yarn dev` or `yarn api`

### Setup Postman
1. Import the corrected Postman collection
2. Set the `baseUrl` variable to `http://localhost:4000`
3. Follow the step-by-step workflow below

## 📋 Step-by-Step Workflow

### 1. Health Check
**GET** `/health`
- Verifies the API is running
- Shows framework and agent status

### 2. Agent Status  
**GET** `/status`
- Shows current agent configuration
- Confirms Credo framework is loaded

### 3. Create DID (Required First!)
**POST** `/agent/create-did`
```json
{
  "type": "anoncreds"
}
```
- Creates a DID on Indy Besu blockchain
- Required before issuing AnonCreds credentials
- Use `"type": "w3c"` for JSON-LD credentials

### 4. Create Connection Invitation
**POST** `/connections/invite`
- Faber creates an invitation for Alice
- **Copy the `inviteUrl` from the response!**

### 5. Accept Connection
**POST** `/connections/accept`
```json
{
  "inviteUrl": "PASTE_THE_URL_FROM_STEP_4_HERE"
}
```
- Alice accepts Faber's invitation
- Connection is now established

## 🎓 AnonCreds Workflow (Traditional SSI)

### 6. Register Schema
**POST** `/credentials/register-schema`
```json
{}
```
- Registers a schema on Indy Besu
- Required before creating credential definitions

### 7. Register Credential Definition  
**POST** `/credentials/register-creddef`
```json
{}
```
- Registers a credential definition
- Links to the schema from step 6

### 8a. Issue AnonCreds Credential
**POST** `/credentials/issue`
```json
{
  "to": "alice",
  "type": "anoncreds",
  "waitForAcceptance": false
}
```
- Faber issues a credential to Alice
- **Save the `credentialRecordId` from response**

### 9. Accept Credentials
**POST** `/credentials/accept`
```json
{}
```
- Alice accepts all pending credential offers

### 10. Check Credential Status
**GET** `/credentials/{credentialRecordId}/status`
- Replace `{credentialRecordId}` with ID from step 8a
- Verify credential state is "done"

### 11a. Request AnonCreds Proof
**POST** `/proof/request`
```json
{
  "type": "anoncreds",
  "waitForPresentation": false
}
```
- Faber requests proof from Alice
- **Save the `proofRecordId` from response**

### 12. Accept Proof Requests
**POST** `/proof/accept`
```json
{}
```
- Alice accepts all pending proof requests

### 13. Check Proof Status
**GET** `/proof/{proofRecordId}/status`
- Replace `{proofRecordId}` with ID from step 11a
- View revealed attributes when state is "done"

## 🌐 JSON-LD Workflow (W3C Standards)

For JSON-LD credentials, skip steps 6-7 and use these alternatives:

### 8b. Issue JSON-LD Credential
**POST** `/credentials/issue`
```json
{
  "to": "alice", 
  "type": "jsonld",
  "waitForAcceptance": false
}
```

### 11b. Request JSON-LD Proof
**POST** `/proof/request`
```json
{
  "type": "jsonld",
  "waitForPresentation": false
}
```

## 💬 Messaging

### 14. Send Message
**POST** `/messages/send`
```json
{
  "from": "faber",
  "message": "Hello Alice!"
}
```

## 🔧 Tips for Testing

### Setting Variables in Postman
1. After step 8, copy the `credentialRecordId` and set it as a Postman variable
2. After step 11, copy the `proofRecordId` and set it as a Postman variable
3. Use `{{credentialId}}` and `{{proofId}}` in subsequent requests

### Troubleshooting Common Issues

**"Please create a DID first"**
- Run step 3 (Create DID) before attempting credentials

**"Please register a schema first"**  
- For AnonCreds: Run step 6 (Register Schema) first

**"Please register a credential definition first"**
- For AnonCreds: Run step 7 (Register CredDef) first

**"No connection found"**
- Run steps 4-5 (Create and Accept Connection) first

**Blockchain timeouts**
- The system has 30-second timeouts built-in
- If operations hang, check your Indy Besu network

### Expected Response States

- **Credentials**: `offer-sent` → `done`
- **Proofs**: `request-sent` → `done`  
- **Connections**: `invitation-sent` → `completed`

## 🎯 Complete Test Sequence

1. Health Check → 2. Status → 3. Create DID → 4. Invite → 5. Accept Connection → 6. Register Schema → 7. Register CredDef → 8a. Issue Credential → 9. Accept Credential → 10. Check Status → 11a. Request Proof → 12. Accept Proof → 13. Check Proof Status → 14. Send Message

This sequence tests the complete AnonCreds workflow from DID creation to proof verification! 🎉