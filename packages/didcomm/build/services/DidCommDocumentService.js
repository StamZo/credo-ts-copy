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
exports.DidCommDocumentService = void 0;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
let DidCommDocumentService = class DidCommDocumentService {
    constructor(didResolverService, didRepository) {
        this.didResolverService = didResolverService;
        this.didRepository = didRepository;
    }
    async resolveServicesFromDid(agentContext, did) {
        const didDocument = await this.didResolverService.resolveDidDocument(agentContext, did);
        const resolvedServices = [];
        // If did specifies a particular service, filter by its id
        const didCommServices = (0, core_2.parseDid)(did).fragment
            ? didDocument.didCommServices.filter((service) => service.id === did)
            : didDocument.didCommServices;
        // FIXME: we currently retrieve did documents for all didcomm services in the did document, and we don't have caching
        // yet so this will re-trigger ledger resolves for each one. Should we only resolve the first service, then the second service, etc...?
        for (const didCommService of didCommServices) {
            if (didCommService.type === core_2.IndyAgentService.type) {
                // IndyAgentService (DidComm v0) has keys encoded as raw publicKeyBase58 (verkeys)
                resolvedServices.push({
                    id: didCommService.id,
                    recipientKeys: didCommService.recipientKeys.map(core_2.verkeyToPublicJwk),
                    routingKeys: didCommService.routingKeys?.map(core_2.verkeyToPublicJwk) || [],
                    serviceEndpoint: didCommService.serviceEndpoint,
                });
            }
            else if (didCommService.type === core_2.DidCommV1Service.type) {
                // Resolve dids to DIDDocs to retrieve routingKeys
                const routingKeys = [];
                for (const routingKey of didCommService.routingKeys ?? []) {
                    const routingDidDocument = await this.didResolverService.resolveDidDocument(agentContext, routingKey);
                    const publicJwk = (0, core_2.getPublicJwkFromVerificationMethod)(routingDidDocument.dereferenceKey(routingKey, ['authentication', 'keyAgreement']));
                    // FIXME: we should handle X25519 here as well
                    if (!publicJwk.is(core_2.Kms.Ed25519PublicJwk)) {
                        throw new core_2.CredoError(`Expected Ed25519PublicJwk but found ${publicJwk.JwkClass.name}`);
                    }
                    routingKeys.push(publicJwk);
                }
                // DidCommV1Service has keys encoded as key references
                // Dereference recipientKeys
                const recipientKeys = didCommService.recipientKeys.map((recipientKeyReference) => {
                    // FIXME: we allow authentication keys as historically ed25519 keys have been used in did documents
                    // for didcomm. In the future we should update this to only be allowed for IndyAgent and DidCommV1 services
                    // as didcomm v2 doesn't have this issue anymore
                    const publicJwk = (0, core_2.getPublicJwkFromVerificationMethod)(didDocument.dereferenceKey(recipientKeyReference, ['authentication', 'keyAgreement']));
                    // try to find a matching Ed25519 key (https://sovrin-foundation.github.io/sovrin/spec/did-method-spec-template.html#did-document-notes)
                    // FIXME: Now that indy-sdk is deprecated, we should look into the possiblty of using the X25519 key directly
                    // removing the need to also include the Ed25519 key in the did document.
                    if (publicJwk.is(core_2.Kms.X25519PublicJwk)) {
                        const matchingEd25519Key = (0, core_1.findMatchingEd25519Key)(publicJwk, didDocument);
                        if (matchingEd25519Key)
                            return matchingEd25519Key.publicJwk;
                    }
                    if (!publicJwk.is(core_2.Kms.Ed25519PublicJwk)) {
                        throw new core_2.CredoError(`Expected Ed25519PublicJwk but found ${publicJwk.JwkClass.name}`);
                    }
                    return publicJwk;
                });
                resolvedServices.push({
                    id: didCommService.id,
                    recipientKeys,
                    routingKeys,
                    serviceEndpoint: didCommService.serviceEndpoint,
                });
            }
        }
        return resolvedServices;
    }
    async resolveCreatedDidDocumentWithKeysByRecipientKey(agentContext, publicJwk) {
        const didRecord = await this.didRepository.findCreatedDidByRecipientKey(agentContext, publicJwk);
        if (!didRecord) {
            throw new core_2.RecordNotFoundError(`Created did for public jwk ${publicJwk.jwkTypehumanDescription} not found`, {
                recordType: core_2.DidRecord.type,
            });
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
        const didDocument = await this.didResolverService.resolveDidDocument(agentContext, didRecord.did);
        return {
            keys: didRecord.keys,
            didDocument,
        };
    }
};
exports.DidCommDocumentService = DidCommDocumentService;
exports.DidCommDocumentService = DidCommDocumentService = __decorate([
    (0, core_2.injectable)(),
    __metadata("design:paramtypes", [core_2.DidResolverService, core_2.DidRepository])
], DidCommDocumentService);
//# sourceMappingURL=DidCommDocumentService.js.map