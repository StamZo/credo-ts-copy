import type { AgentContext } from '@credo-ts/core';
import type { AnonCredsCredentialOffer, AnonCredsRevocationStatusList, AnonCredsSchema } from '../models';
import type { AnonCredsIssuerService, CreateCredentialDefinitionOptions, CreateCredentialDefinitionReturn, CreateCredentialOfferOptions, CreateCredentialOptions, CreateCredentialReturn, CreateRevocationRegistryDefinitionOptions, CreateRevocationRegistryDefinitionReturn, CreateRevocationStatusListOptions, CreateSchemaOptions, UpdateRevocationStatusListOptions } from '../services';
export declare class AnonCredsRsIssuerService implements AnonCredsIssuerService {
    createSchema(_agentContext: AgentContext, options: CreateSchemaOptions): Promise<AnonCredsSchema>;
    createCredentialDefinition(_agentContext: AgentContext, options: CreateCredentialDefinitionOptions): Promise<CreateCredentialDefinitionReturn>;
    createRevocationRegistryDefinition(_agentContext: AgentContext, options: CreateRevocationRegistryDefinitionOptions): Promise<CreateRevocationRegistryDefinitionReturn>;
    createRevocationStatusList(agentContext: AgentContext, options: CreateRevocationStatusListOptions): Promise<AnonCredsRevocationStatusList>;
    updateRevocationStatusList(agentContext: AgentContext, options: UpdateRevocationStatusListOptions): Promise<AnonCredsRevocationStatusList>;
    createCredentialOffer(agentContext: AgentContext, options: CreateCredentialOfferOptions): Promise<AnonCredsCredentialOffer>;
    createCredential(agentContext: AgentContext, options: CreateCredentialOptions): Promise<CreateCredentialReturn>;
}
