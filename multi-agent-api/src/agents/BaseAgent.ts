import type { InitConfig } from '@credo-ts/core'

import { 
  Agent, 
  DidsModule,
  W3cCredentialsModule
} from '@credo-ts/core'
import { 
  ConnectionsModule, 
  ProofsModule, 
  CredentialsModule, 
  OutOfBandModule, 
  BasicMessagesModule, 
  HttpOutboundTransport,
  AutoAcceptCredential,
  AutoAcceptProof,
  V2CredentialProtocol,
  V2ProofProtocol,
  DidCommModule
} from '@credo-ts/didcomm'

// Import from node package
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node'

// AnonCreds imports
import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
} from '@credo-ts/anoncreds'

// Import Indy Besu from local package
import { IndyBesuModule, IndyBesuAnonCredsRegistry, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@credo-ts/indy-besu-vdr'

// IndyVdr imports
import {
  IndyVdrIndyDidResolver,
  IndyVdrAnonCredsRegistry,
  IndyVdrModule,
  IndyVdrPoolConfig
} from '@credo-ts/indy-vdr'

// Askar wallet imports
import { AskarModule } from '@credo-ts/askar'

// Native bindings
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { askar } from '@openwallet-foundation/askar-nodejs'

import { greenText } from './OutputClass'

import * as fs from 'fs';
import * as path from 'path';

// Load genesis as a string
const bcovrin = fs.readFileSync(path.join(__dirname, 'bcovrin.genesis'), 'utf8');


export const indyNetworkConfig: IndyVdrPoolConfig = {
  genesisTransactions: bcovrin,
  indyNamespace: 'bcovrin:test',
  isProduction: false,
  connectOnStartup: true,
}

type DemoAgent = Agent<any>


export class BaseAgent {
  public port: number
  public name: string
  public config: InitConfig
  public agent: DemoAgent

  public constructor({
    port,
    name,
  }: {
    port: number
    name: string
  }) {
    this.name = name
    this.port = port

    // Ensure the endpoint URL is properly formatted and valid
    const endpoint = `http://localhost:${port}`
    
    // Validate the endpoint format before using it
    const urlRegex = /^https?:\/\/[^\s]+$/
    if (!urlRegex.test(endpoint)) {
      throw new Error(`Invalid endpoint format: ${endpoint}`)
    }
    
    const config = {
      label: name,
      walletConfig: { id: name, key: name },
      endpoints: [endpoint],
    } as InitConfig

    this.config = config

    // Create agent with modules
    this.agent = new Agent({
      config,
      dependencies: agentDependencies,
      modules: getCredoModules() as any,
    })
    
    // Register transports after agent creation
    this.agent.modules.didcomm.registerInboundTransport(new HttpInboundTransport({ port }))
    this.agent.modules.didcomm.registerOutboundTransport(new HttpOutboundTransport())
  }

  public async initializeAgent() {
    await this.agent.initialize()
    console.log(greenText(`\nAgent ${this.name} created!\n`))
  }
}

function getCredoModules() {
  const legacyIndyCredentialFormatService = new LegacyIndyCredentialFormatService()
  const legacyIndyProofFormatService = new LegacyIndyProofFormatService()

  return {
    // Add DidCommModule to provide the config
    didcomm: new DidCommModule(),
    
    connections: new ConnectionsModule({
      // Remove autoAcceptConnections to require manual acceptance
      autoAcceptConnections: false,
    }),
    oob: new OutOfBandModule(),
    basicMessages: new BasicMessagesModule(),
    w3cCredentials: new W3cCredentialsModule(),
    
    credentials: new CredentialsModule({
      // Keep auto-accept for credentials for easier testing
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      credentialProtocols: [
        new V1CredentialProtocol({
          indyCredentialFormat: legacyIndyCredentialFormatService,
        }),
        new V2CredentialProtocol({
          credentialFormats: [
            legacyIndyCredentialFormatService,
            new AnonCredsCredentialFormatService(),
          ],
        }),
      ],
    }),
    
    proofs: new ProofsModule({
      // Keep auto-accept for proofs for easier testing
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
      proofProtocols: [
        new V1ProofProtocol({
          indyProofFormat: legacyIndyProofFormatService,
        }),
        new V2ProofProtocol({
          proofFormats: [legacyIndyProofFormatService, new AnonCredsProofFormatService()],
        }),
      ],
    }),
    
    anoncreds: new AnonCredsModule({
      anoncreds,
      registries: [
        new IndyVdrAnonCredsRegistry(), 
        new IndyBesuAnonCredsRegistry() as any
      ],
    }),
    
    askar: new AskarModule({
      askar,
      // Properly configure the wallet store
      store: {
        id: 'default',
        key: 'defaultkey',
      },
    }),
    
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks: [indyNetworkConfig],
    }),
    
    dids: new DidsModule({
      resolvers: [
        new IndyVdrIndyDidResolver(), 
        new IndyBesuDidResolver() as any
      ],
      registrars: [
        new IndyBesuDidRegistrar() as any
      ],
    }),
    
    indyBesu: new IndyBesuModule({
      chainId: 1337,
      nodeAddress: 'http://localhost:8545',
      transactionTimeoutMs: 30000,
    }) as any,
  }
}
