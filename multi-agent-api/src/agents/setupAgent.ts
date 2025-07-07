import { Agent, ConsoleLogger, LogLevel } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { IndyBesuModule, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@credo-ts/indy-besu-vdr'
import { DidsModule } from '@credo-ts/core'

export async function setupAgent(): Promise<Agent> {
  const agent = new Agent({
    config: {
      label: 'consentis-agent',
      walletConfig: {
        id: 'consentis-agent',
        key: 'consentis-agent',
      },
      endpoints: [],
      logger: new ConsoleLogger(LogLevel.info),
    },
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ 
        ariesAskar 
      }),
      dids: new DidsModule({
        resolvers: [new IndyBesuDidResolver() as any],
        registrars: [new IndyBesuDidRegistrar() as any],
      }),
      indyBesu: new IndyBesuModule({ 
        nodeAddress: 'http://localhost:8545', 
        chainId: 1337,
        // Add timeout protection to prevent hanging
        transactionTimeoutMs: 30000,
      }) as any,
    },
  })

  await agent.initialize()

  return agent
}