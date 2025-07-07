"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuAnonCredsRegistry = void 0;
const core_1 = require("@credo-ts/core");
const ledger_1 = require("../ledger");
const AnonCredsUtils_1 = require("./AnonCredsUtils");
const Trasformers_1 = require("./Trasformers");
class IndyBesuAnonCredsRegistry {
    constructor() {
        this.methodName = 'indy2';
        this.supportedIdentifier = /.*/;
        this.allowsCaching = false;
    }
    async getSchema(agentContext, schemaId) {
        try {
            const schemaRegistry = agentContext.dependencyManager.resolve(ledger_1.SchemaRegistry);
            const schema = (await schemaRegistry.resolveSchema(schemaId));
            return {
                schema,
                schemaId,
                resolutionMetadata: {},
                schemaMetadata: {},
            };
        }
        catch (error) {
            return {
                schemaId,
                resolutionMetadata: {
                    error: 'unknownError',
                    message: `unable to resolve schema: ${error.message}`,
                },
                schemaMetadata: {},
            };
        }
    }
    async registerSchema(agentContext, options) {
        try {
            const schemaRegistry = agentContext.dependencyManager.resolve(ledger_1.SchemaRegistry);
            // Expect the secret key as Uint8Array in options
            const { secretKey } = options.options;
            if (!secretKey) {
                throw new core_1.CredoError(`No secretKey provided in options.`);
            }
            const signer = new ledger_1.IndyBesuSigner(secretKey);
            const schemaId = (0, AnonCredsUtils_1.buildSchemaId)(options.schema);
            await schemaRegistry.createSchema(schemaId, options.schema, signer);
            return {
                schemaState: {
                    state: 'finished',
                    schema: options.schema,
                    schemaId: schemaId,
                },
                registrationMetadata: {},
                schemaMetadata: {},
            };
        }
        catch (error) {
            return {
                schemaMetadata: {},
                registrationMetadata: {},
                schemaState: {
                    state: 'failed',
                    schema: options.schema,
                    reason: `Failed registering schema: ${error.message}`,
                },
            };
        }
    }
    async getCredentialDefinition(agentContext, credentialDefinitionId) {
        try {
            const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(ledger_1.CredentialDefinitionRegistry);
            const credentialDefinition = await credentialDefinitionRegistry.resolveCredentialDefinition(credentialDefinitionId);
            return {
                credentialDefinition: {
                    issuerId: credentialDefinition.issuerId,
                    schemaId: credentialDefinition.schemaId,
                    type: 'CL',
                    tag: credentialDefinition.tag,
                    value: core_1.JsonTransformer.deserialize(credentialDefinition.value, Trasformers_1.CredentialDefinitionValue),
                },
                credentialDefinitionId,
                resolutionMetadata: {},
                credentialDefinitionMetadata: {},
            };
        }
        catch (error) {
            return {
                credentialDefinitionId,
                resolutionMetadata: {
                    error: 'unknownError',
                    message: `unable to resolve credential definition: ${error.message}`,
                },
                credentialDefinitionMetadata: {},
            };
        }
    }
    async registerCredentialDefinition(agentContext, options) {
        try {
            const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(ledger_1.CredentialDefinitionRegistry);
            const createCredentialDefinition = options.credentialDefinition;
            const schema = await this.getSchema(agentContext, createCredentialDefinition.schemaId);
            if (!schema.schema) {
                throw new core_1.CredoError(`Schema not found for schemaId: ${createCredentialDefinition.schemaId}`);
            }
            // Expect the secret key as Uint8Array in options
            const { secretKey } = options.options;
            if (!secretKey) {
                throw new core_1.CredoError(`No secretKey provided in options.`);
            }
            const signer = new ledger_1.IndyBesuSigner(secretKey);
            const createCredentialDefinitionId = (0, AnonCredsUtils_1.buildCredentialDefinitionId)(createCredentialDefinition);
            await credentialDefinitionRegistry.createCredentialDefinition(createCredentialDefinitionId, {
                issuerId: createCredentialDefinition.issuerId,
                schemaId: createCredentialDefinition.schemaId,
                credDefType: 'CL',
                tag: createCredentialDefinition.tag,
                value: core_1.JsonTransformer.serialize(createCredentialDefinition.value),
            }, signer);
            return {
                credentialDefinitionState: {
                    state: 'finished',
                    credentialDefinition: options.credentialDefinition,
                    credentialDefinitionId: createCredentialDefinitionId,
                },
                registrationMetadata: {},
                credentialDefinitionMetadata: {},
            };
        }
        catch (error) {
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
    async registerRevocationRegistryDefinition(agentContext, options) {
        throw new Error('Method not implemented.');
    }
    async registerRevocationStatusList(agentContext, options) {
        throw new Error('Method not implemented.');
    }
    getRevocationRegistryDefinition(agentContext, revocationRegistryDefinitionId) {
        throw new Error('Method not implemented.');
    }
    getRevocationStatusList(agentContext, revocationRegistryId, timestamp) {
        throw new Error('Method not implemented.');
    }
}
exports.IndyBesuAnonCredsRegistry = IndyBesuAnonCredsRegistry;
//# sourceMappingURL=IndyBesuAnonCredsRegistry.js.map