// import type { InitConfig } from '@credo-ts/core'

// import { 
//   Agent, 
//   DidsModule,
//   W3cCredentialsModule,
//   ConnectionsModule, 
//   CredentialsModule, 
//   OutOfBandModule, 
//   BasicMessagesModule, 
//   ProofsModule,
//   AutoAcceptCredential,
//   AutoAcceptProof,
//   HttpOutboundTransport,
//   V2CredentialProtocol,
//   V2ProofProtocol
// } from '@credo-ts/core'

// // Import from node package
// import { agentDependencies, HttpInboundTransport } from '@credo-ts/node'

// // AnonCreds imports
// import {
//   AnonCredsCredentialFormatService,
//   AnonCredsModule,
//   AnonCredsProofFormatService,
//   LegacyIndyCredentialFormatService,
//   LegacyIndyProofFormatService,
//   V1CredentialProtocol,
//   V1ProofProtocol,
// } from '@credo-ts/anoncreds'

// // Import Indy Besu from local package
// import { IndyBesuModule, IndyBesuAnonCredsRegistry, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@credo-ts/indy-besu-vdr'

// // IndyVdr imports
// import {
//   IndyVdrIndyDidResolver,
//   IndyVdrAnonCredsRegistry,
//   IndyVdrModule,
//   IndyVdrPoolConfig
// } from '@credo-ts/indy-vdr'

// // Askar wallet imports
// import { AskarModule } from '@credo-ts/askar'

// // Native bindings
// import { anoncreds } from '@hyperledger/anoncreds-nodejs'
// import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
// import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
// import { JsonLdCredentialFormatService } from '@credo-ts/core'
// import { greenText } from './OutputClass'

// import * as fs from 'fs';
// import * as path from 'path';

// // Load genesis as a string
// const bcovrin = fs.readFileSync(path.join(__dirname, 'bcovrin.genesis'), 'utf8');

// export const indyNetworkConfig: IndyVdrPoolConfig = {
//   genesisTransactions: bcovrin,
//   indyNamespace: 'bcovrin:test',
//   isProduction: false,
//   connectOnStartup: true,
// }

// type Modules = ReturnType<typeof getCredoModules>;
// type DemoAgent = Agent<Modules>;

// export class BaseAgent {
//   public port: number
//   public name: string
//   public config: InitConfig
//   public agent: DemoAgent;

//   public constructor({
//     port,
//     name,
//   }: {
//     port: number
//     name: string
//   }) {
//     this.name = name
//     this.port = port

//     // Ensure the endpoint URL is properly formatted and valid
//     const endpoint = `http://localhost:${port}`
    
//     // Validate the endpoint format before using it
//     const urlRegex = /^https?:\/\/[^\s]+$/
//     if (!urlRegex.test(endpoint)) {
//       throw new Error(`Invalid endpoint format: ${endpoint}`)
//     }
    
//     const config = {
//       label: name,
//       walletConfig: { 
//         id: name,
//         key: name,
//         storage: {
//           type: 'sqlite',
//           path: `/tmp/credo_${name}_${Date.now()}.db` // Use temp directory with unique name
//         }
//       },
//       autoUpdateStorageOnStartup: true, // Force storage update
//       endpoints: [endpoint],
//     } as InitConfig

//     this.config = config

//     // Create agent with modules
//     this.agent = new Agent({
//       config,
//       dependencies: agentDependencies,
//       modules: getCredoModules(),
//     })
    
//     // Register transports after agent creation (Credo 0.5.x way)
//     this.agent.registerInboundTransport(new HttpInboundTransport({ port }))
//     this.agent.registerOutboundTransport(new HttpOutboundTransport())
//   }

//   public async initializeAgent() {
//     await this.agent.initialize()
//     console.log(greenText(`\nAgent ${this.name} created!\n`))
    
//     // Debug: Check what modules are actually available after initialization
//     console.log(`${this.name} available modules:`, {
//       connections: !!this.agent.connections,
//       oob: !!this.agent.oob,
//       basicMessages: !!this.agent.basicMessages,
//       credentials: !!this.agent.credentials,
//       proofs: !!this.agent.proofs,
//       wallet: !!this.agent.wallet,
//       dids: !!this.agent.dids,
//       anoncreds: !!this.agent.modules?.anoncreds,
//       indyVdr: !!this.agent.modules?.indyVdr
//     })
//   }
// }

// function getCredoModules() {
//   const legacyIndyCredentialFormatService = new LegacyIndyCredentialFormatService()
//   const legacyIndyProofFormatService = new LegacyIndyProofFormatService()

//   const modules = {
//     connections: new ConnectionsModule({
//       autoAcceptConnections: true,
//     }),
//     outOfBand: new OutOfBandModule(),
//     basicMessages: new BasicMessagesModule(),
//     w3cCredentials: new W3cCredentialsModule(),
    
//     credentials: new CredentialsModule({
//       autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
//       credentialProtocols: [
//         new V1CredentialProtocol({
//           indyCredentialFormat: legacyIndyCredentialFormatService,
//         }),
//         new V2CredentialProtocol({
//           credentialFormats: [
//             legacyIndyCredentialFormatService,
//             new AnonCredsCredentialFormatService(),
//             new JsonLdCredentialFormatService(),
//           ],
//         }),
//       ],
//     }),
    
//     proofs: new ProofsModule({
//       autoAcceptProofs: AutoAcceptProof.ContentApproved,
//       proofProtocols: [
//         new V1ProofProtocol({
//           indyProofFormat: legacyIndyProofFormatService,
//         }),
//         new V2ProofProtocol({
//           proofFormats: [legacyIndyProofFormatService, new AnonCredsProofFormatService()],
//         }),
//       ],
//     }),
    
//     anoncreds: new AnonCredsModule({
//       anoncreds,
//       registries: [
//         new IndyVdrAnonCredsRegistry(), 
//         new IndyBesuAnonCredsRegistry() as any
//       ],
//     }),
    
//     askar: new AskarModule({
//       ariesAskar,
//     }),
    
//     indyVdr: new IndyVdrModule({
//       indyVdr,
//       networks: [indyNetworkConfig],
//     }),
    
//     dids: new DidsModule({
//       resolvers: [
//         new IndyVdrIndyDidResolver(), 
//         new IndyBesuDidResolver() as any
//       ],
//       registrars: [
//         new IndyBesuDidRegistrar() as any
//       ],
//     }),
    
//     indyBesu: new IndyBesuModule({
//       chainId: 1337,
//       nodeAddress: 'http://localhost:8545',
//       transactionTimeoutMs: 30000,
//     }) as any,
//   }

//   // Debug: Log what modules we're creating
//   console.log('Creating modules:', Object.keys(modules))
  
//   return modules
// }