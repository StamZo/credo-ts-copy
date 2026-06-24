# @credo-ts/indy-besu-vdr

A **Verifiable Data Registry (VDR)** package for [Credo](https://github.com/openwallet-foundation/credo-ts) that integrates AnonCreds identity operations with an **Indy-Besu** ledger — a permissioned **EVM** chain (Hyperledger Besu) whose DID, schema, and credential-definition registries are implemented as on-chain Solidity contracts.

It lets a Credo agent create and resolve DIDs and publish AnonCreds schemas and credential definitions by signing and submitting transactions to an EVM ledger.

## Background & attribution

This package is a **migration to Credo of the `indy-besu-vdr` reference implementation** originally built for Aries Framework JavaScript (Credo's predecessor). The original was developed by DSR Corporation as part of a Hyperledger workshop demonstrating an EVM ledger as a non-Indy VDR, and lives on a demo branch of their AFJ fork:

- Reference implementation: [`DSRCorporation/aries-framework-javascript` @ `indy2-vrd-demo`](https://github.com/DSRCorporation/aries-framework-javascript/tree/indy2-vrd-demo/packages/indy-besu-vdr) (and sibling `indy-besu-demo*` branches)
- Underlying ledger: [`hyperledger/indy-besu`](https://github.com/hyperledger/indy-besu) — the Besu/EVM network and the Solidity DID/schema/cred-def registry contracts this package calls into

My work adapts that reference to the current Credo package structure, APIs, and dependency model (Askar/AnonCreds modules, ethers v6, Credo's `DidsModule` registrar/resolver interfaces), and adds the transaction-handling layer described below (timeouts, retries, mock mode).

## What it does

A Credo agent configured with this module can, against a Besu/EVM node:

- **Create & resolve DIDs** via on-chain registry contracts (`IndyBesuDidRegistrar`, `IndyBesuDidResolver`), supporting the EVM-native `EcdsaSecp256k1RecoveryMethod2020` verification method alongside Ed25519/X25519.
- **Register AnonCreds objects** — schemas and credential definitions — through `IndyBesuAnonCredsRegistry`, mapping AnonCreds data into on-chain contract calls.
- **Sign EVM transactions** with secp256k1 keys (`IndyBesuSigner`, using **ethers v6** — `SigningKey`, `computeAddress`, and recovery-id handling).

## How it works

```
Credo Agent
   │
   ├── DidsModule  ──► IndyBesuDidRegistrar / IndyBesuDidResolver
   ├── AnonCredsModule ──► IndyBesuAnonCredsRegistry
   │
   └── IndyBesuModule
         ├── IndyBesuSigner        # secp256k1 tx signing via ethers v6
         └── ledger/contracts/     # ABI-level calls to on-chain registries
               ├── DidRegistry
               ├── SchemaRegistry
               └── CredentialDefinitionRegistry
                     │
                     ▼
            Besu / EVM node (JSON-RPC, e.g. localhost:8545)
```

- **`BaseContract`** wraps transaction submission with sign → submit → await-receipt, plus configurable timeouts, exponential-backoff retries, and a `skipBlockchainWrites` mock mode for fast offline testing.
- **Contract addresses** default to fixed local-dev addresses and are overridable via config.
- Registry ABIs are bundled under `src/ledger/contracts/abi/`.

## Usage

```ts
import { Agent, DidsModule } from '@credo-ts/core'
import { IndyBesuModule } from '@credo-ts/indy-besu-vdr'
import { IndyBesuDidRegistrar, IndyBesuDidResolver } from '@credo-ts/indy-besu-vdr'

const agent = new Agent({
  config: { /* ... */ },
  dependencies,
  modules: {
    indyBesuVdr: new IndyBesuModule({
      chainId: 1337,
      nodeAddress: 'http://localhost:8545',
      transactionTimeoutMs: 10_000,
      // skipBlockchainWrites: true,  // offline/mock mode for tests
    }),
    dids: new DidsModule({
      registrars: [new IndyBesuDidRegistrar()],
      resolvers: [new IndyBesuDidResolver()],
    }),
  },
})

await agent.initialize()
```

## Configuration

`IndyBesuModuleConfig` options: `chainId`, `nodeAddress`, optional registry addresses (`didRegistryAddress`, `schemaRegistryAddress`, `credentialDefinitionRegistryAddress`), `skipBlockchainWrites`, `transactionTimeoutMs`, `connectionTimeoutMs`, `failOnConnectionError`, `gasLimit`, `maxRetries`.

## Tests

```bash
pnpm --filter @credo-ts/indy-besu-vdr test
```

`tests/` includes offline unit tests, verification-key tests, and end-to-end DID and credential flows against a running Besu node. A companion `multi-agent-api/` demo runs an Alice/Faber issuance-and-proof flow over this VDR.

> **Status:** experimental (`0.0.1`). This is a working migration/integration built to get the Indy-Besu VDR functioning under Credo; some test files and logging reflect that development process.

## License

Apache-2.0 (inherited from Credo).
