"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheqdAnonCredsRegistry = void 0;
const core_1 = require("@credo-ts/core");
const dids_1 = require("../../dids");
const identifiers_1 = require("../utils/identifiers");
const transform_1 = require("../utils/transform");
class CheqdAnonCredsRegistry {
    constructor() {
        this.methodName = 'cheqd';
        /**
         * This class supports resolving and registering objects with cheqd identifiers.
         * It needs to include support for the schema, credential definition, revocation registry as well
         * as the issuer id (which is needed when registering objects).
         */
        this.supportedIdentifier = identifiers_1.cheqdSdkAnonCredsRegistryIdentifierRegex;
    }
    async getSchema(agentContext, schemaId) {
        try {
            const cheqdDidResolver = agentContext.dependencyManager.resolve(dids_1.CheqdDidResolver);
            const parsedDid = (0, identifiers_1.parseCheqdDid)(schemaId);
            if (!parsedDid)
                throw new core_1.CredoError(`Invalid schemaId: ${schemaId}`);
            agentContext.config.logger.trace(`Submitting get schema request for schema '${schemaId}' to ledger`);
            const response = await cheqdDidResolver.resolveResource(agentContext, schemaId);
            const schema = core_1.JsonTransformer.fromJSON(response.resource, transform_1.CheqdSchema);
            return {
                schema: {
                    attrNames: schema.attrNames,
                    name: schema.name,
                    version: schema.version,
                    issuerId: parsedDid.did,
                },
                schemaId,
                resolutionMetadata: {},
                schemaMetadata: {},
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error retrieving schema '${schemaId}'`, {
                error,
                schemaId,
            });
            return {
                schemaId,
                resolutionMetadata: {
                    error: 'notFound',
                    message: `unable to resolve schema: ${error.message}`,
                },
                schemaMetadata: {},
            };
        }
    }
    async registerSchema(agentContext, options) {
        try {
            const cheqdDidRegistrar = agentContext.dependencyManager.resolve(dids_1.CheqdDidRegistrar);
            const schema = options.schema;
            const schemaResource = {
                id: core_1.utils.uuid(),
                name: `${schema.name}-Schema`,
                resourceType: identifiers_1.cheqdAnonCredsResourceTypes.schema,
                data: {
                    name: schema.name,
                    version: schema.version,
                    attrNames: schema.attrNames,
                },
                version: schema.version,
            };
            const response = await cheqdDidRegistrar.createResource(agentContext, schema.issuerId, schemaResource);
            if (response.resourceState.state !== 'finished') {
                throw new core_1.CredoError(response.resourceState.reason ?? 'Unknown error');
            }
            return {
                schemaState: {
                    state: 'finished',
                    schema,
                    schemaId: `${schema.issuerId}/resources/${schemaResource.id}`,
                },
                registrationMetadata: {},
                schemaMetadata: {},
            };
        }
        catch (error) {
            agentContext.config.logger.debug(`Error registering schema for did '${options.schema.issuerId}'`, {
                error,
                did: options.schema.issuerId,
                schema: options,
            });
            return {
                schemaMetadata: {},
                registrationMetadata: {},
                schemaState: {
                    state: 'failed',
                    schema: options.schema,
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async registerCredentialDefinition(agentContext, options) {
        try {
            const cheqdDidRegistrar = agentContext.dependencyManager.resolve(dids_1.CheqdDidRegistrar);
            const { credentialDefinition } = options;
            const schema = await this.getSchema(agentContext, credentialDefinition.schemaId);
            if (!schema.schema)
                throw new core_1.CredoError(`Schema not found for schemaId: ${credentialDefinition.schemaId}`);
            const credDefName = `${schema.schema.name}-${credentialDefinition.tag}`;
            const credDefNameHashBuffer = core_1.Hasher.hash(credDefName, 'sha-256');
            const credDefResource = {
                id: core_1.utils.uuid(),
                name: core_1.TypedArrayEncoder.toHex(credDefNameHashBuffer),
                resourceType: identifiers_1.cheqdAnonCredsResourceTypes.credentialDefinition,
                data: {
                    type: credentialDefinition.type,
                    tag: credentialDefinition.tag,
                    value: credentialDefinition.value,
                    schemaId: credentialDefinition.schemaId,
                },
                version: core_1.utils.uuid(),
            };
            const response = await cheqdDidRegistrar.createResource(agentContext, credentialDefinition.issuerId, credDefResource);
            if (response.resourceState.state !== 'finished')
                throw new core_1.CredoError(response.resourceState.reason ?? 'Unknown error');
            return {
                credentialDefinitionState: {
                    state: 'finished',
                    credentialDefinition,
                    credentialDefinitionId: `${credentialDefinition.issuerId}/resources/${credDefResource.id}`,
                },
                registrationMetadata: {},
                credentialDefinitionMetadata: {},
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error registering credential definition for did '${options.credentialDefinition.issuerId}'`, {
                error,
                did: options.credentialDefinition.issuerId,
                schema: options,
            });
            return {
                credentialDefinitionMetadata: {},
                registrationMetadata: {},
                credentialDefinitionState: {
                    state: 'failed',
                    credentialDefinition: options.credentialDefinition,
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async getCredentialDefinition(agentContext, credentialDefinitionId) {
        try {
            const cheqdDidResolver = agentContext.dependencyManager.resolve(dids_1.CheqdDidResolver);
            const parsedDid = (0, identifiers_1.parseCheqdDid)(credentialDefinitionId);
            if (!parsedDid)
                throw new core_1.CredoError(`Invalid credentialDefinitionId: ${credentialDefinitionId}`);
            agentContext.config.logger.trace(`Submitting get credential definition request for '${credentialDefinitionId}' to ledger`);
            const response = await cheqdDidResolver.resolveResource(agentContext, credentialDefinitionId);
            const credentialDefinition = core_1.JsonTransformer.fromJSON(response.resource, transform_1.CheqdCredentialDefinition);
            return {
                credentialDefinition: {
                    ...credentialDefinition,
                    issuerId: parsedDid.did,
                },
                credentialDefinitionId,
                resolutionMetadata: {},
                credentialDefinitionMetadata: (response.resourceMetadata ?? {}),
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error retrieving credential definition '${credentialDefinitionId}'`, {
                error,
                credentialDefinitionId,
            });
            return {
                credentialDefinitionId,
                resolutionMetadata: {
                    error: 'notFound',
                    message: `unable to resolve credential definition: ${error.message}`,
                },
                credentialDefinitionMetadata: {},
            };
        }
    }
    async getRevocationRegistryDefinition(agentContext, revocationRegistryDefinitionId) {
        try {
            const cheqdDidResolver = agentContext.dependencyManager.resolve(dids_1.CheqdDidResolver);
            const parsedDid = (0, identifiers_1.parseCheqdDid)(revocationRegistryDefinitionId);
            if (!parsedDid)
                throw new core_1.CredoError(`Invalid revocationRegistryDefinitionId: ${revocationRegistryDefinitionId}`);
            agentContext.config.logger.trace(`Submitting get revocation registry definition request for '${revocationRegistryDefinitionId}' to ledger`);
            const searchDid = parsedDid.path
                ? revocationRegistryDefinitionId
                : `${revocationRegistryDefinitionId}${revocationRegistryDefinitionId.includes('?') ? '&' : '?'}resourceType=${identifiers_1.cheqdAnonCredsResourceTypes.revocationRegistryDefinition}`;
            const response = await cheqdDidResolver.resolveResource(agentContext, searchDid);
            const revocationRegistryDefinition = core_1.JsonTransformer.fromJSON(response.resource, transform_1.CheqdRevocationRegistryDefinition);
            return {
                revocationRegistryDefinition: {
                    ...revocationRegistryDefinition,
                    issuerId: parsedDid.did,
                },
                revocationRegistryDefinitionId,
                resolutionMetadata: {},
                revocationRegistryDefinitionMetadata: (response.resourceMetadata ?? {}),
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error retrieving revocation registry definition '${revocationRegistryDefinitionId}'`, {
                error,
                revocationRegistryDefinitionId,
            });
            return {
                revocationRegistryDefinitionId,
                resolutionMetadata: {
                    error: 'notFound',
                    message: `unable to resolve revocation registry definition: ${error.message}`,
                },
                revocationRegistryDefinitionMetadata: {},
            };
        }
    }
    async registerRevocationRegistryDefinition(agentContext, { revocationRegistryDefinition, options }) {
        try {
            const credentialDefinition = await this.getCredentialDefinition(agentContext, revocationRegistryDefinition.credDefId);
            if (!credentialDefinition.credentialDefinition)
                throw new core_1.CredoError(`Credential definition not found for id: ${revocationRegistryDefinition.credDefId}`);
            const credentialDefinitionName = credentialDefinition.credentialDefinitionMetadata.name;
            if (!credentialDefinitionName)
                throw new core_1.CredoError(`Credential definition name not found for id: ${revocationRegistryDefinition.credDefId}`);
            const cheqdDidRegistrar = agentContext.dependencyManager.resolve(dids_1.CheqdDidRegistrar);
            const revocDefName = `${credentialDefinitionName}-${revocationRegistryDefinition.tag}`;
            const revocDefNameHashedBuffer = core_1.Hasher.hash(revocDefName, 'sha-256');
            const revocationRegistryDefinitionResource = {
                id: core_1.utils.uuid(),
                name: core_1.TypedArrayEncoder.toHex(revocDefNameHashedBuffer),
                resourceType: identifiers_1.cheqdAnonCredsResourceTypes.revocationRegistryDefinition,
                data: {
                    credDefId: revocationRegistryDefinition.credDefId,
                    revocDefType: revocationRegistryDefinition.revocDefType,
                    tag: revocationRegistryDefinition.tag,
                    value: revocationRegistryDefinition.value,
                },
                version: core_1.utils.uuid(),
            };
            const response = await cheqdDidRegistrar.createResource(agentContext, revocationRegistryDefinition.issuerId, revocationRegistryDefinitionResource);
            if (response.resourceState.state !== 'finished')
                throw new core_1.CredoError(response.resourceState.reason ?? 'Unknown error');
            return {
                revocationRegistryDefinitionState: {
                    state: 'finished',
                    revocationRegistryDefinition,
                    revocationRegistryDefinitionId: `${revocationRegistryDefinition.issuerId}/resources/${revocationRegistryDefinitionResource.id}`,
                },
                registrationMetadata: {},
                revocationRegistryDefinitionMetadata: (response.resourceMetadata ?? {}),
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error registering revocation registry definition for did '${revocationRegistryDefinition.issuerId}'`, {
                error,
                did: revocationRegistryDefinition.issuerId,
                options,
            });
            return {
                revocationRegistryDefinitionMetadata: {},
                registrationMetadata: {},
                revocationRegistryDefinitionState: {
                    state: 'failed',
                    revocationRegistryDefinition,
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async getRevocationStatusList(agentContext, revocationRegistryId, timestamp) {
        try {
            const cheqdDidResolver = agentContext.dependencyManager.resolve(dids_1.CheqdDidResolver);
            const parsedDid = (0, identifiers_1.parseCheqdDid)(revocationRegistryId);
            if (!parsedDid)
                throw new core_1.CredoError(`Invalid revocationRegistryId: ${revocationRegistryId}`);
            agentContext.config.logger.trace(`Submitting get revocation status request for '${revocationRegistryId}' to ledger`);
            const revocationRegistryDefinition = await this.getRevocationRegistryDefinition(agentContext, revocationRegistryId);
            if (!revocationRegistryDefinition.revocationRegistryDefinition)
                throw new core_1.CredoError(`Revocation registry definition not found for id: ${revocationRegistryId}`);
            const revocationRegistryDefinitionName = revocationRegistryDefinition.revocationRegistryDefinitionMetadata.name;
            if (!revocationRegistryDefinitionName)
                throw new core_1.CredoError(`Revocation registry definition name not found for id: ${revocationRegistryId}`);
            const response = await cheqdDidResolver.resolveResource(agentContext, `${parsedDid.did}?resourceType=${identifiers_1.cheqdAnonCredsResourceTypes.revocationStatusList}&resourceVersionTime=${timestamp}&resourceName=${revocationRegistryDefinitionName}`);
            const revocationStatusList = core_1.JsonTransformer.fromJSON(response.resource, transform_1.CheqdRevocationStatusList);
            const statusListTimestamp = response.resourceMetadata?.created
                ? Math.floor(response.resourceMetadata.created.getTime() / 1000)
                : undefined;
            if (statusListTimestamp === undefined)
                throw new core_1.CredoError(`Unable to extract revocation status list timestamp from resource ${revocationRegistryId}`);
            return {
                revocationStatusList: {
                    ...revocationStatusList,
                    issuerId: parsedDid.did,
                    timestamp: statusListTimestamp,
                },
                resolutionMetadata: {},
                revocationStatusListMetadata: (response.resourceMetadata ?? {}),
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error retrieving revocation registry status list '${revocationRegistryId}'`, {
                error,
                revocationRegistryId,
            });
            return {
                resolutionMetadata: {
                    error: 'notFound',
                    message: `unable to resolve revocation registry status list: ${error.message}`,
                },
                revocationStatusListMetadata: {},
            };
        }
    }
    async registerRevocationStatusList(agentContext, { revocationStatusList, options }) {
        try {
            const revocationRegistryDefinition = await this.getRevocationRegistryDefinition(agentContext, revocationStatusList.revRegDefId);
            if (!revocationRegistryDefinition.revocationRegistryDefinition) {
                throw new core_1.CredoError(`Revocation registry definition not found for id: ${revocationStatusList.revRegDefId}`);
            }
            const revocationRegistryDefinitionName = revocationRegistryDefinition.revocationRegistryDefinitionMetadata.name;
            if (!revocationRegistryDefinitionName)
                throw new core_1.CredoError(`Revocation registry definition name not found for id: ${revocationStatusList.revRegDefId}`);
            const cheqdDidRegistrar = agentContext.dependencyManager.resolve(dids_1.CheqdDidRegistrar);
            const revocationStatusListResource = {
                id: core_1.utils.uuid(),
                name: revocationRegistryDefinitionName,
                resourceType: identifiers_1.cheqdAnonCredsResourceTypes.revocationStatusList,
                data: {
                    currentAccumulator: revocationStatusList.currentAccumulator,
                    revRegDefId: revocationStatusList.revRegDefId,
                    revocationList: revocationStatusList.revocationList,
                },
                version: core_1.utils.uuid(),
            };
            const response = await cheqdDidRegistrar.createResource(agentContext, revocationStatusList.issuerId, revocationStatusListResource);
            if (response.resourceState.state !== 'finished')
                throw new core_1.CredoError(response.resourceState.reason ?? 'Unknown error');
            // It's not possible to get the timestamp from the response, so we set it to the current time
            const nowTimestamp = Math.floor(Date.now() / 1000);
            return {
                revocationStatusListState: {
                    state: 'finished',
                    revocationStatusList: {
                        ...revocationStatusList,
                        timestamp: nowTimestamp,
                    },
                },
                registrationMetadata: {},
                revocationStatusListMetadata: (response.resourceMetadata ?? {}),
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error registering revocation status list for did '${revocationStatusList.issuerId}'`, {
                error,
                did: revocationStatusList.issuerId,
                options,
            });
            return {
                revocationStatusListMetadata: {},
                registrationMetadata: {},
                revocationStatusListState: {
                    state: 'failed',
                    revocationStatusList,
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
}
exports.CheqdAnonCredsRegistry = CheqdAnonCredsRegistry;
//# sourceMappingURL=CheqdAnonCredsRegistry.js.map