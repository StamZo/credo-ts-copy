"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuDidRegistrar = void 0;
// packages/indy-besu-vdr/src/dids/IndyBesuDidRegistrar.ts
const core_1 = require("@credo-ts/core");
const ledger_1 = require("../ledger");
const DidUtils_1 = require("./DidUtils");
const ethers_1 = require("ethers");
const IndyBesuModuleConfig_1 = require("../IndyBesuModuleConfig");
class IndyBesuDidRegistrar {
    constructor() {
        this.supportedMethods = ['ethr'];
    }
    async create(agentContext, options) {
        agentContext.config.logger.info('Creating DID...');
        try {
            const didRegistry = agentContext.dependencyManager.resolve(ledger_1.DidRegistry);
            const config = agentContext.dependencyManager.resolve(IndyBesuModuleConfig_1.IndyBesuModuleConfig);
            const didPrivateKey = options.secret?.didPrivateKey;
            if (!didPrivateKey) {
                return (0, DidUtils_1.failedResult)('Missing didPrivateKey in secret');
            }
            // Convert Buffer to Uint8Array if needed
            const privateKeyBytes = core_1.Buffer.isBuffer(didPrivateKey) ?
                new Uint8Array(didPrivateKey) :
                didPrivateKey;
            // Create signing key and derive public key
            const signingKey = new ethers_1.SigningKey(privateKeyBytes);
            const publicKeyHex = signingKey.publicKey.slice(2); // Remove '0x' prefix
            const publicKey = core_1.Buffer.from(publicKeyHex, 'hex');
            // Build DID
            const did = (0, DidUtils_1.buildDid)(options.method, publicKey);
            agentContext.config.logger.debug(`Built DID: ${did}`);
            // Create signer
            const signer = new ledger_1.IndyBesuSigner(privateKeyBytes);
            // Skip blockchain operations if in mock mode
            if (config.skipBlockchainWrites) {
                agentContext.config.logger.info('Mock mode: Skipping blockchain writes');
            }
            else {
                // Process verification keys
                if (options?.options?.verificationKeys) {
                    agentContext.config.logger.info(`Setting ${options.options.verificationKeys.length} verification keys...`);
                    for (let i = 0; i < options.options.verificationKeys.length; i++) {
                        const verificationKey = options.options.verificationKeys[i];
                        try {
                            const materialPropertyName = (0, DidUtils_1.getVerificationMaterialPropertyName)(verificationKey.type);
                            const material = (0, DidUtils_1.getVerificationMaterial)(verificationKey.type, verificationKey.key);
                            const purpose = (0, DidUtils_1.getVerificationPurpose)(verificationKey.purpose);
                            const keyAttribute = {
                                [materialPropertyName]: material,
                                purpose,
                                type: DidUtils_1.VerificationKeyType[verificationKey.type],
                            };
                            agentContext.config.logger.debug(`Setting attribute for key ${i + 1}...`);
                            await didRegistry.setAttribute(did, keyAttribute, BigInt(100000), signer);
                            agentContext.config.logger.debug(`Attribute set for key ${i + 1}`);
                        }
                        catch (error) {
                            agentContext.config.logger.warn(`Failed to set verification key ${i + 1}: ${error.message}`);
                            if (config.failOnConnectionError) {
                                throw error;
                            }
                            // Continue with other keys
                        }
                    }
                }
                // Process endpoints
                if (options?.options?.endpoints) {
                    agentContext.config.logger.info(`Setting ${options.options.endpoints.length} endpoints...`);
                    for (let i = 0; i < options.options.endpoints.length; i++) {
                        const endpoint = options.options.endpoints[i];
                        try {
                            const serviceAttribute = {
                                serviceEndpoint: endpoint.endpoint,
                                type: endpoint.type,
                            };
                            agentContext.config.logger.debug(`Setting endpoint ${i + 1}...`);
                            await didRegistry.setAttribute(did, serviceAttribute, BigInt(100000), signer);
                            agentContext.config.logger.debug(`Endpoint set ${i + 1}`);
                        }
                        catch (error) {
                            agentContext.config.logger.warn(`Failed to set endpoint ${i + 1}: ${error.message}`);
                            if (config.failOnConnectionError) {
                                throw error;
                            }
                            // Continue with other endpoints
                        }
                    }
                }
            }
            // Build DID document
            const didDocument = (0, DidUtils_1.buildDidDocument)(did, { publicKey: publicKey }, options?.options?.endpoints, options?.options?.verificationKeys);
            agentContext.config.logger.info('DID creation completed successfully');
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: 'finished',
                    did: didDocument.id,
                    didDocument: didDocument,
                    secret: {
                        didPrivateKey: didPrivateKey,
                        didKey: { privateKey: privateKeyBytes }
                    },
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error('DID creation failed:', error);
            return (0, DidUtils_1.failedResult)(`Failed to create DID: ${error.message}`);
        }
    }
    async update(agentContext, options) {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notImplemented: updating did:ethr not implemented yet',
            },
        };
    }
    async deactivate(agentContext, options) {
        return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
                state: 'failed',
                reason: 'notImplemented: deactivating did:ethr not implemented yet',
            },
        };
    }
}
exports.IndyBesuDidRegistrar = IndyBesuDidRegistrar;
//# sourceMappingURL=IndyBesuDidRegistrar.js.map