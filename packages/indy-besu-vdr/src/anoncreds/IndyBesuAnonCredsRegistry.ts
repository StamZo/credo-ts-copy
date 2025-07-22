import type {
  AnonCredsRegistry,
  GetCredentialDefinitionReturn,
  GetRevocationRegistryDefinitionReturn,
  GetRevocationStatusListReturn,
  GetSchemaReturn,
  RegisterCredentialDefinitionOptions,
  RegisterCredentialDefinitionReturn,
  RegisterRevocationRegistryDefinitionOptions,
  RegisterRevocationRegistryDefinitionReturn,
  RegisterRevocationStatusListOptions,
  RegisterRevocationStatusListReturn,
  RegisterSchemaOptions,
  RegisterSchemaReturn,
  AnonCredsSchema
} from '@credo-ts/anoncreds'
import type { AgentContext } from '@credo-ts/core'
import { CredoError, JsonTransformer } from '@credo-ts/core'
import { CredentialDefinitionRegistry, IndyBesuSigner, SchemaRegistry } from '../ledger'
import { buildCredentialDefinitionId, buildSchemaId } from './AnonCredsUtils'
import { CredentialDefinitionValue } from './Trasformers'

export class IndyBesuAnonCredsRegistry implements AnonCredsRegistry {
  public readonly methodName = 'indy2'
  public readonly supportedIdentifier = /.*/
  public readonly allowsCaching = false

  public async getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn> {
    try {
      const schemaRegistry = agentContext.dependencyManager.resolve(SchemaRegistry)
      const schema = (await schemaRegistry.resolveSchema(schemaId)) as AnonCredsSchema

      return {
        schema,
        schemaId,
        resolutionMetadata: {},
        schemaMetadata: {},
      }
    } catch (error: any) {
      return {
        schemaId,
        resolutionMetadata: {
          error: 'unknownError',
          message: `unable to resolve schema: ${error.message}`,
        },
        schemaMetadata: {},
      }
    }
  }

  public async registerSchema(
    agentContext: AgentContext,
    options: IndyBesuRegisterSchemaOptions
  ): Promise<RegisterSchemaReturn> {
    try {
      const schemaRegistry = agentContext.dependencyManager.resolve(SchemaRegistry)

      // Expect the secret key as Uint8Array in options
      const { secretKey } = options.options
      if (!secretKey) {
        throw new CredoError(`No secretKey provided in options.`)
      }
      const signer = new IndyBesuSigner(secretKey)

      const schemaId = buildSchemaId(options.schema)

      await schemaRegistry.createSchema(schemaId, options.schema, signer)

      return {
        schemaState: {
          state: 'finished',
          schema: options.schema,
          schemaId: schemaId,
        },
        registrationMetadata: {},
        schemaMetadata: {},
      }
    } catch (error: any) {
      return {
        schemaMetadata: {},
        registrationMetadata: {},
        schemaState: {
          state: 'failed',
          schema: options.schema,
          reason: `Failed registering schema: ${error.message}`,
        },
      }
    }
  }

  public async getCredentialDefinition(
    agentContext: AgentContext,
    credentialDefinitionId: string
  ): Promise<GetCredentialDefinitionReturn> {
    try {
      const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(CredentialDefinitionRegistry)
      const credentialDefinition = await credentialDefinitionRegistry.resolveCredentialDefinition(
        credentialDefinitionId
      )

      return {
        credentialDefinition: {
          issuerId: credentialDefinition.issuerId,
          schemaId: credentialDefinition.schemaId,
          type: 'CL',
          tag: credentialDefinition.tag,
          value: JsonTransformer.deserialize(credentialDefinition.value, CredentialDefinitionValue),
        },
        credentialDefinitionId,
        resolutionMetadata: {},
        credentialDefinitionMetadata: {},
      }
    } catch (error: any) {
      return {
        credentialDefinitionId,
        resolutionMetadata: {
          error: 'unknownError',
          message: `unable to resolve credential definition: ${error.message}`,
        },
        credentialDefinitionMetadata: {},
      }
    }
  }

  public async registerCredentialDefinition(
    agentContext: AgentContext,
    options: IndyBesuRegisterCredentialDefinitionOptions
  ): Promise<RegisterCredentialDefinitionReturn> {
    try {
      const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(CredentialDefinitionRegistry)
      const createCredentialDefinition = options.credentialDefinition

      const schema = await this.getSchema(agentContext, createCredentialDefinition.schemaId)
      if (!schema.schema) {
        throw new CredoError(`Schema not found for schemaId: ${createCredentialDefinition.schemaId}`)
      }

      // Expect the secret key as Uint8Array in options
      const { secretKey } = options.options
      if (!secretKey) {
        throw new CredoError(`No secretKey provided in options.`)
      }
      const signer = new IndyBesuSigner(secretKey)
      const createCredentialDefinitionId = buildCredentialDefinitionId(createCredentialDefinition)

      await credentialDefinitionRegistry.createCredentialDefinition(
        createCredentialDefinitionId,
        {
          issuerId: createCredentialDefinition.issuerId,
          schemaId: createCredentialDefinition.schemaId,
          credDefType: 'CL',
          tag: createCredentialDefinition.tag,
          value: JsonTransformer.serialize(createCredentialDefinition.value),
        },
        signer
      )

      return {
        credentialDefinitionState: {
          state: 'finished',
          credentialDefinition: options.credentialDefinition,
          credentialDefinitionId: createCredentialDefinitionId,
        },
        registrationMetadata: {},
        credentialDefinitionMetadata: {},
      }
    } catch (error: any) {
      return {
        credentialDefinitionMetadata: {},
        registrationMetadata: {},
        credentialDefinitionState: {
          state: 'failed',
          credentialDefinition: options.credentialDefinition,
          reason: `unknownError: ${error.message}`,
        },
      }
    }
  }

  public async registerRevocationRegistryDefinition(
    agentContext: AgentContext,
    options: RegisterRevocationRegistryDefinitionOptions
  ): Promise<RegisterRevocationRegistryDefinitionReturn> {
    throw new Error('Method not implemented.')
  }

  public async registerRevocationStatusList(
    agentContext: AgentContext,
    options: RegisterRevocationStatusListOptions
  ): Promise<RegisterRevocationStatusListReturn> {
    throw new Error('Method not implemented.')
  }

  public getRevocationRegistryDefinition(
    agentContext: AgentContext,
    revocationRegistryDefinitionId: string
  ): Promise<GetRevocationRegistryDefinitionReturn> {
    throw new Error('Method not implemented.')
  }

  public getRevocationStatusList(
    agentContext: AgentContext,
    revocationRegistryId: string,
    timestamp: number
  ): Promise<GetRevocationStatusListReturn> {
    throw new Error('Method not implemented.')
  }
}

// ---- UPDATE: options now require secretKey: Uint8Array ----
export interface IndyBesuRegisterSchemaOptions extends RegisterSchemaOptions {
  options: {
    secretKey: Uint8Array
  }
}
export interface IndyBesuRegisterCredentialDefinitionOptions extends RegisterCredentialDefinitionOptions {
  options: {
    secretKey: Uint8Array
  }
}
