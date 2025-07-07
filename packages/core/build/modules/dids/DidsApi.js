"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidsApi = void 0;
const agent_1 = require("../../agent");
const error_1 = require("../../error");
const plugins_1 = require("../../plugins");
const ssi_types_1 = require("@sphereon/ssi-types");
const kms_1 = require("../kms");
const DidsModuleConfig_1 = require("./DidsModuleConfig");
const domain_1 = require("./domain");
const methods_1 = require("./methods");
const repository_1 = require("./repository");
const services_1 = require("./services");
let DidsApi = class DidsApi {
    constructor(didResolverService, didRegistrarService, didRepository, agentContext, config, _keyManagement) {
        this.didResolverService = didResolverService;
        this.didRegistrarService = didRegistrarService;
        this.didRepository = didRepository;
        this.agentContext = agentContext;
        this.config = config;
    }
    /**
     * Resolve a did to a did document.
     *
     * Follows the interface as defined in https://w3c-ccg.github.io/did-resolution/
     */
    resolve(didUrl, options) {
        return this.didResolverService.resolve(this.agentContext, didUrl, options);
    }
    /**
     * Create, register and store a did and did document.
     *
     * Follows the interface as defined in https://identity.foundation/did-registration
     */
    create(options) {
        return this.didRegistrarService.create(this.agentContext, options);
    }
    /**
     * Update an existing did document.
     *
     * Follows the interface as defined in https://identity.foundation/did-registration
     */
    update(options) {
        return this.didRegistrarService.update(this.agentContext, options);
    }
    /**
     * Deactivate an existing did.
     *
     * Follows the interface as defined in https://identity.foundation/did-registration
     */
    deactivate(options) {
        return this.didRegistrarService.deactivate(this.agentContext, options);
    }
    /**
     * Resolve a did to a did document. This won't return the associated metadata as defined
     * in the did resolution specification, and will throw an error if the did document could not
     * be resolved.
     */
    resolveDidDocument(didUrl) {
        return this.didResolverService.resolveDidDocument(this.agentContext, didUrl);
    }
    /**
     * Get a list of all dids created by the agent. This will return a list of {@link DidRecord} objects.
     * Each document will have an id property with the value of the did. Optionally, it will contain a did document,
     * but this is only for documents that can't be resolved from the did itself or remotely.
     *
     * You can call `${@link DidsModule.resolve} to resolve the did document based on the did itself.
     */
    getCreatedDids({ method, did } = {}) {
        return this.didRepository.getCreatedDids(this.agentContext, { method, did });
    }
    /**
     * Import an existing did that was created outside of the DidsApi. This will create a `DidRecord` for the did
     * and will allow the did to be used in other parts of the agent. If you need to create a new did document,
     * you can use the {@link DidsApi.create} method to create and register the did.
     *
     * If no `didDocument` is provided, the did document will be resolved using the did resolver. You can optionally provide a list
     * of private key buffer with the respective private key bytes. These keys will be stored in the wallet, and allows you to use the
     * did for other operations. Providing keys that already exist in the wallet is allowed, and those keys will be skipped from being
     * added to the wallet.
     *
     * By default, this method will throw an error if the did already exists in the wallet. You can override this behavior by setting
     * the `overwrite` option to `true`. This will update the did document in the record, and allows you to update the did over time.
     */
    async import({ did, didDocument, keys = [], overwrite }) {
        if (didDocument && didDocument.id !== did) {
            throw new error_1.CredoError(`Did document id ${didDocument.id} does not match did ${did}`);
        }
        const existingDidRecord = await this.didRepository.findCreatedDid(this.agentContext, did);
        if (existingDidRecord && !overwrite) {
            throw new error_1.CredoError(`A created did ${did} already exists. If you want to override the existing did, set the 'overwrite' option to update the did.`);
        }
        if (!didDocument) {
            didDocument = await this.resolveDidDocument(did);
        }
        for (const key of keys) {
            // Make sure the keys exists in the did document
            didDocument.dereferenceKey(key.didDocumentRelativeKeyId);
        }
        // Update existing did record
        if (existingDidRecord) {
            existingDidRecord.didDocument = didDocument;
            existingDidRecord.keys = keys;
            existingDidRecord.setTags({
                alternativeDids: (0, methods_1.isValidPeerDid)(didDocument.id) ? (0, methods_1.getAlternativeDidsForPeerDid)(did) : undefined,
            });
            await this.didRepository.update(this.agentContext, existingDidRecord);
            return;
        }
        // Create new did record
        await this.didRepository.storeCreatedDid(this.agentContext, {
            did,
            didDocument,
            keys,
            tags: {
                alternativeDids: (0, methods_1.isValidPeerDid)(didDocument.id) ? (0, methods_1.getAlternativeDidsForPeerDid)(did) : undefined,
            },
        });
    }
    async resolveCreatedDidDocumentWithKeys(did) {
        const [didRecord] = await this.didRepository.getCreatedDids(this.agentContext, { did });
        if (!didRecord) {
            throw new error_1.RecordNotFoundError(`Created did '${did}' not found`, { recordType: repository_1.DidRecord.type });
        }
        if (didRecord.didDocument) {
            return {
                keys: didRecord.keys,
                didDocument: didRecord.didDocument,
            };
        }
        // TODO: we should somehow store the did document on the record if the did method allows it
        // E.g. for did:key we don't want to store it, but if we still have a did:indy record we do want to store it
        // If the did document is not stored on the did record, we resolve it
        const didDocument = await this.didResolverService.resolveDidDocument(this.agentContext, didRecord.did);
        return {
            keys: didRecord.keys,
            didDocument,
        };
    }
    async resolveVerificationMethodFromCreatedDidRecord(didUrl, allowedPurposes) {
        const parsedDid = (0, ssi_types_1.parseDid)(didUrl);
        const { didDocument, keys } = await this.resolveCreatedDidDocumentWithKeys(parsedDid.did);
        const verificationMethod = didDocument.dereferenceKey(didUrl, allowedPurposes);
        const publicJwk = (0, domain_1.getPublicJwkFromVerificationMethod)(verificationMethod);
        publicJwk.keyId =
            keys?.find(({ didDocumentRelativeKeyId }) => verificationMethod.id.endsWith(didDocumentRelativeKeyId))
                ?.kmsKeyId ?? publicJwk.legacyKeyId;
        return {
            verificationMethod,
            publicJwk,
        };
    }
    get supportedResolverMethods() {
        return this.didResolverService.supportedMethods;
    }
    get supportedRegistrarMethods() {
        return this.didRegistrarService.supportedMethods;
    }
};
exports.DidsApi = DidsApi;
exports.DidsApi = DidsApi = __decorate([
    (0, plugins_1.injectable)(),
    __metadata("design:paramtypes", [services_1.DidResolverService,
        services_1.DidRegistrarService,
        repository_1.DidRepository,
        agent_1.AgentContext,
        DidsModuleConfig_1.DidsModuleConfig,
        kms_1.KeyManagementApi])
], DidsApi);
//# sourceMappingURL=DidsApi.js.map