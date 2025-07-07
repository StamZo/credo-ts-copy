"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToNewInvitation = convertToNewInvitation;
exports.convertToOldInvitation = convertToOldInvitation;
exports.outOfBandServiceToNumAlgo4Did = outOfBandServiceToNumAlgo4Did;
const core_1 = require("@credo-ts/core");
const ConnectionInvitationMessage_1 = require("../connections/messages/ConnectionInvitationMessage");
const OutOfBandDidCommService_1 = require("./domain/OutOfBandDidCommService");
const OutOfBandInvitation_1 = require("./messages/OutOfBandInvitation");
function convertToNewInvitation(oldInvitation) {
    let service;
    if (oldInvitation.did) {
        service = oldInvitation.did;
    }
    else if (oldInvitation.serviceEndpoint && oldInvitation.recipientKeys && oldInvitation.recipientKeys.length > 0) {
        service = new OutOfBandDidCommService_1.OutOfBandDidCommService({
            id: '#inline',
            recipientKeys: oldInvitation.recipientKeys?.map(core_1.verkeyToDidKey),
            routingKeys: oldInvitation.routingKeys?.map(core_1.verkeyToDidKey),
            serviceEndpoint: oldInvitation.serviceEndpoint,
        });
    }
    else {
        throw new Error('Missing required serviceEndpoint, routingKeys and/or did fields in connection invitation');
    }
    const options = {
        id: oldInvitation.id,
        label: oldInvitation.label,
        imageUrl: oldInvitation.imageUrl,
        appendedAttachments: oldInvitation.appendedAttachments,
        accept: ['didcomm/aip1', 'didcomm/aip2;env=rfc19'],
        services: [service],
        // NOTE: we hardcode it to 1.0, we won't see support for newer versions of the protocol
        // and we also can process 1.0 if we support newer versions
        handshakeProtocols: ['https://didcomm.org/connections/1.0'],
    };
    const outOfBandInvitation = new OutOfBandInvitation_1.OutOfBandInvitation(options);
    outOfBandInvitation.invitationType = OutOfBandInvitation_1.InvitationType.Connection;
    return outOfBandInvitation;
}
function convertToOldInvitation(newInvitation) {
    // Taking first service, as we can only include one service in a legacy invitation.
    const [service] = newInvitation.getServices();
    let options;
    if (typeof service === 'string') {
        options = {
            id: newInvitation.id,
            // label is optional
            label: newInvitation.label ?? '',
            did: service,
            imageUrl: newInvitation.imageUrl,
            appendedAttachments: newInvitation.appendedAttachments,
        };
    }
    else {
        options = {
            id: newInvitation.id,
            // label is optional
            label: newInvitation.label ?? '',
            recipientKeys: service.recipientKeys.map(core_1.didKeyToVerkey),
            routingKeys: service.routingKeys?.map(core_1.didKeyToVerkey),
            serviceEndpoint: service.serviceEndpoint,
            imageUrl: newInvitation.imageUrl,
            appendedAttachments: newInvitation.appendedAttachments,
        };
    }
    const connectionInvitationMessage = new ConnectionInvitationMessage_1.ConnectionInvitationMessage(options);
    return connectionInvitationMessage;
}
function outOfBandServiceToNumAlgo4Did(service) {
    // FIXME: add the key entries for the recipientKeys to the did document.
    const didDocument = new core_1.DidDocumentBuilder('')
        .addService(new core_1.DidCommV1Service({
        id: service.id,
        serviceEndpoint: service.serviceEndpoint,
        accept: service.accept,
        // FIXME: this should actually be local key references, not did:key:123#456 references
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
    return (0, core_1.didDocumentToNumAlgo4Did)(didDocument);
}
//# sourceMappingURL=converters.js.map