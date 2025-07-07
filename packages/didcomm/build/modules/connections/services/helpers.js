"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToNewDidDocument = convertToNewDidDocument;
exports.routingToServices = routingToServices;
exports.assertNoCreatedDidExistsForKeys = assertNoCreatedDidExistsForKeys;
exports.createPeerDidFromServices = createPeerDidFromServices;
exports.getResolvedDidcommServiceWithSigningKeyId = getResolvedDidcommServiceWithSigningKeyId;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const models_1 = require("../models");
function convertToNewDidDocument(didDoc, keys) {
    const didDocumentBuilder = new core_2.DidDocumentBuilder('');
    const oldIdNewIdMapping = {};
    for (const auth of didDoc.authentication) {
        const { publicKey: pk } = auth;
        // did:peer did documents can only use referenced keys.
        if (pk.type === 'Ed25519VerificationKey2018' && pk.value) {
            const ed25519VerificationMethod = convertPublicKeyToVerificationMethod(pk);
            const oldKeyId = normalizeId(pk.id);
            oldIdNewIdMapping[oldKeyId] = ed25519VerificationMethod.id;
            didDocumentBuilder.addAuthentication(ed25519VerificationMethod.id);
            // Only the auth is embedded, we also need to add the key to the verificationMethod
            // for referenced authentication this should already be the case
            if (auth instanceof models_1.EmbeddedAuthentication) {
                didDocumentBuilder.addVerificationMethod(ed25519VerificationMethod);
            }
        }
    }
    for (const pk of didDoc.publicKey) {
        if (pk.type === 'Ed25519VerificationKey2018' && pk.value) {
            const ed25519VerificationMethod = convertPublicKeyToVerificationMethod(pk);
            const oldKeyId = normalizeId(pk.id);
            oldIdNewIdMapping[oldKeyId] = ed25519VerificationMethod.id;
            didDocumentBuilder.addVerificationMethod(ed25519VerificationMethod);
        }
    }
    // FIXME: we reverse the didCommServices here, as the previous implementation was wrong
    // and we need to keep the same order to not break the did creation process.
    // When we implement the migration to did:peer:2 and did:peer:3 according to the
    // RFCs we can change it.
    for (let service of didDoc.didCommServices.reverse()) {
        const serviceId = normalizeId(service.id);
        // For didcommv1, we need to replace the old id with the new ones
        if (service instanceof core_2.DidCommV1Service) {
            const recipientKeys = service.recipientKeys.map((keyId) => {
                const oldKeyId = normalizeId(keyId);
                return oldIdNewIdMapping[oldKeyId];
            });
            service = new core_2.DidCommV1Service({
                id: serviceId,
                recipientKeys,
                serviceEndpoint: service.serviceEndpoint,
                routingKeys: service.routingKeys,
                accept: service.accept,
                priority: service.priority,
            });
        }
        else if (service instanceof core_2.IndyAgentService) {
            service = new core_2.IndyAgentService({
                id: serviceId,
                recipientKeys: service.recipientKeys,
                serviceEndpoint: service.serviceEndpoint,
                routingKeys: service.routingKeys,
                priority: service.priority,
            });
        }
        didDocumentBuilder.addService(service);
    }
    const didDocument = didDocumentBuilder.build();
    const peerDid = (0, core_2.didDocumentJsonToNumAlgo1Did)(didDocument.toJSON());
    didDocument.id = peerDid;
    return {
        didDocument,
        keys: keys?.map((key) => ({
            ...key,
            didDocumentRelativeKeyId: oldIdNewIdMapping[key.didDocumentRelativeKeyId],
        })),
    };
}
function normalizeId(fullId) {
    // Some old dids use `;` as the delimiter for the id. If we can't find a `#`
    // and a `;` exists, we will parse everything after `;` as the id.
    if (!fullId.includes('#') && fullId.includes(';')) {
        const [, ...ids] = fullId.split(';');
        return `#${ids.join(';')}`;
    }
    const [, ...ids] = fullId.split('#');
    return `#${ids.length ? ids.join('#') : fullId}`;
}
function convertPublicKeyToVerificationMethod(publicKey) {
    if (!publicKey.value) {
        throw new core_2.CredoError(`Public key ${publicKey.id} does not have value property`);
    }
    const publicKeyBase58 = publicKey.value;
    const ed25519Key = core_1.Kms.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'Ed25519',
        publicKey: core_2.TypedArrayEncoder.fromBase58(publicKeyBase58),
    });
    return (0, core_2.getEd25519VerificationKey2018)({
        id: `#${publicKeyBase58.slice(0, 8)}`,
        publicJwk: ed25519Key,
        controller: '#id',
    });
}
function routingToServices(routing) {
    return routing.endpoints.map((endpoint, index) => ({
        id: `#inline-${index}`,
        serviceEndpoint: endpoint,
        recipientKeys: [routing.recipientKey],
        routingKeys: routing.routingKeys,
    }));
}
/**
 * Asserts that the keys we are going to use for creating a did document haven't already been used in another did document
 * Due to how DIDComm v1 works (only reference the key not the did in encrypted message) we can't have multiple dids containing
 * the same key as we won't know which did (and thus which connection) a message is intended for.
 */
async function assertNoCreatedDidExistsForKeys(agentContext, recipientKeys) {
    const didRepository = agentContext.dependencyManager.resolve(core_2.DidRepository);
    const recipientKeyFingerprints = recipientKeys.map((key) => key.fingerprint);
    const didsForServices = await didRepository.findByQuery(agentContext, {
        role: core_2.DidDocumentRole.Created,
        // We want an $or query so we query for each key individually, not one did document
        // containing exactly the same keys as the did document we are trying to create
        $or: recipientKeyFingerprints.map((fingerprint) => ({
            recipientKeyFingerprints: [fingerprint],
        })),
    });
    if (didsForServices.length > 0) {
        const allDidRecipientKeys = didsForServices.flatMap((did) => did.getTags().recipientKeyFingerprints ?? []);
        const matchingFingerprints = allDidRecipientKeys.filter((f) => recipientKeyFingerprints.includes(f));
        throw new core_2.CredoError(`A did already exists for some of the keys in the provided services. DIDComm v1 uses key based routing, and therefore it is not allowed to re-use the same key in multiple did documents for DIDComm. If you use the same 'routing' object for multiple invitations, instead provide an 'invitationDid' to the create invitation method. The following fingerprints are already in use: ${matchingFingerprints.join(',')}`);
    }
}
async function createPeerDidFromServices(agentContext, services, numAlgo) {
    const didsApi = agentContext.dependencyManager.resolve(core_2.DidsApi);
    // Create did document without the id property
    const { didDocument, keys } = (0, core_2.createPeerDidDocumentFromServices)(services, true);
    // Assert that the keys we are going to use for creating a did document haven't already been used in another did document
    await assertNoCreatedDidExistsForKeys(agentContext, didDocument.recipientKeys);
    // Register did:peer document. This will generate the id property and save it to a did record
    const result = await didsApi.create({
        method: 'peer',
        didDocument,
        options: {
            numAlgo,
            keys,
        },
    });
    if (result.didState?.state !== 'finished') {
        throw new core_2.CredoError(`Did document creation failed: ${JSON.stringify(result.didState)}`);
    }
    // FIXME: didApi.create should return the did document
    return didsApi.resolveCreatedDidDocumentWithKeys(result.didState.did);
}
function getResolvedDidcommServiceWithSigningKeyId(outOfBandDidcommService, 
/**
 * Optional keys for the inline services
 */
inlineServiceKeys) {
    const resolvedService = outOfBandDidcommService.resolvedDidCommService;
    // Make sure the key id is set for service keys
    for (const recipientKey of resolvedService.recipientKeys) {
        const kmsKeyId = inlineServiceKeys?.find(({ recipientKeyFingerprint }) => recipientKeyFingerprint === recipientKey.fingerprint)?.kmsKeyId;
        recipientKey.keyId = kmsKeyId ?? recipientKey.legacyKeyId;
    }
    return resolvedService;
}
//# sourceMappingURL=helpers.js.map