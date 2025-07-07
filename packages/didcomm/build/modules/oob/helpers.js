"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outOfBandServiceToInlineKeysNumAlgo2Did = outOfBandServiceToInlineKeysNumAlgo2Did;
exports.outOfBandServiceToNumAlgo2Did = outOfBandServiceToNumAlgo2Did;
const core_1 = require("@credo-ts/core");
// This method is kept to support searching for existing connections created by
// credo-ts <= 0.5.1
// TODO: Remove in 0.6.0 (when ConnectionRecord.invitationDid will be migrated)
function outOfBandServiceToInlineKeysNumAlgo2Did(service) {
    const didDocument = new core_1.DidDocumentBuilder('')
        .addService(new core_1.DidCommV1Service({
        id: service.id,
        serviceEndpoint: service.serviceEndpoint,
        accept: service.accept,
        recipientKeys: service.recipientKeys.map((recipientKey) => {
            const did = core_1.DidKey.fromDid(recipientKey);
            return `${did.did}#${did.publicJwk.fingerprint}`;
        }),
        // Map did:key:xxx to actual did:key:xxx#123
        routingKeys: service.routingKeys?.map((routingKey) => {
            const did = core_1.DidKey.fromDid(routingKey);
            return `${did.did}#${did.publicJwk.fingerprint}`;
        }),
    }))
        .build();
    const did = (0, core_1.didDocumentToNumAlgo2Did)(didDocument);
    return did;
}
function outOfBandServiceToNumAlgo2Did(service) {
    const { didDocument } = (0, core_1.createPeerDidDocumentFromServices)([
        {
            id: service.id,
            recipientKeys: service.recipientKeys.map(core_1.didKeyToEd25519PublicJwk),
            serviceEndpoint: service.serviceEndpoint,
            routingKeys: service.routingKeys?.map(core_1.didKeyToEd25519PublicJwk) ?? [],
        },
    ], false);
    const did = (0, core_1.didDocumentToNumAlgo2Did)(didDocument);
    return did;
}
//# sourceMappingURL=helpers.js.map