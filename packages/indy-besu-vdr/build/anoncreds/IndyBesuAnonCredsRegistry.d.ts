import type { AnonCredsRegistry, GetCredentialDefinitionReturn, GetRevocationRegistryDefinitionReturn, GetRevocationStatusListReturn, GetSchemaReturn, RegisterCredentialDefinitionOptions, RegisterCredentialDefinitionReturn, RegisterRevocationRegistryDefinitionOptions, RegisterRevocationRegistryDefinitionReturn, RegisterRevocationStatusListOptions, RegisterRevocationStatusListReturn, RegisterSchemaOptions, RegisterSchemaReturn } from '@credo-ts/anoncreds';
import type { AgentContext } from '@credo-ts/core';
export declare class IndyBesuAnonCredsRegistry implements AnonCredsRegistry {
    readonly methodName = "indy2";
    readonly supportedIdentifier: RegExp;
    readonly allowsCaching = false;
    getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn>;
    registerSchema(agentContext: AgentContext, options: IndyBesuRegisterSchemaOptions): Promise<RegisterSchemaReturn>;
    getCredentialDefinition(agentContext: AgentContext, credentialDefinitionId: string): Promise<GetCredentialDefinitionReturn>;
    registerCredentialDefinition(agentContext: AgentContext, options: IndyBesuRegisterCredentialDefinitionOptions): Promise<RegisterCredentialDefinitionReturn>;
    registerRevocationRegistryDefinition(agentContext: AgentContext, options: RegisterRevocationRegistryDefinitionOptions): Promise<RegisterRevocationRegistryDefinitionReturn>;
    registerRevocationStatusList(agentContext: AgentContext, options: RegisterRevocationStatusListOptions): Promise<RegisterRevocationStatusListReturn>;
    getRevocationRegistryDefinition(agentContext: AgentContext, revocationRegistryDefinitionId: string): Promise<GetRevocationRegistryDefinitionReturn>;
    getRevocationStatusList(agentContext: AgentContext, revocationRegistryId: string, timestamp: number): Promise<GetRevocationStatusListReturn>;
}
export interface IndyBesuRegisterSchemaOptions extends RegisterSchemaOptions {
    options: {
        secretKey: Uint8Array;
    };
}
export interface IndyBesuRegisterCredentialDefinitionOptions extends RegisterCredentialDefinitionOptions {
    options: {
        secretKey: Uint8Array;
    };
}
