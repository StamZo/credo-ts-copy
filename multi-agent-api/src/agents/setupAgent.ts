<<<<<<< HEAD
import { Agent, ConsoleLogger, LogLevel } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { AskarModule } from '@aries-framework/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { IndyBesuModule, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@aries-framework/indy-besu-vdr'
import { DidsModule } from '@aries-framework/core'
=======
import { Agent, ConsoleLogger, LogLevel } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { IndyBesuModule, IndyBesuDidRegistrar, IndyBesuDidResolver } from '@credo-ts/indy-besu-vdr'
import { DidsModule } from '@credo-ts/core'
>>>>>>> cea78ecd (staff ad api)

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
<<<<<<< HEAD
      askar: new AskarModule({ ariesAskar }),
=======
      askar: new AskarModule(),
>>>>>>> cea78ecd (staff ad api)
      dids: new DidsModule({
        resolvers: [new IndyBesuDidResolver()],
        registrars: [new IndyBesuDidRegistrar()],
      }),
<<<<<<< HEAD
      indyBesu: new IndyBesuModule({ nodeAddress: 'http://localhost:8545', chainId: 1337 }),
=======
      indyBesu: new IndyBesuModule({ 
        nodeAddress: 'http://localhost:8545', 
        chainId: 1337,
        // Add timeout protection to prevent hanging
        transactionTimeoutMs: 30000,
      }),
>>>>>>> cea78ecd (staff ad api)
    },
  })

  await agent.initialize()

  return agent
}