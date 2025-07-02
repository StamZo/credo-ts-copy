import { Agent, ConsoleLogger, LogLevel } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { AskarModule } from '@aries-framework/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { IndyBesuModule, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@aries-framework/indy-besu-vdr'
import { DidsModule } from '@aries-framework/core'

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
      askar: new AskarModule({ ariesAskar }),
      dids: new DidsModule({
        resolvers: [new IndyBesuDidResolver()],
        registrars: [new IndyBesuDidRegistrar()],
      }),
      indyBesu: new IndyBesuModule({ nodeAddress: 'http://localhost:8545', chainId: 1337 }),
    },
  })

  await agent.initialize()

  return agent
}