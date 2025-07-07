"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInvitationShortUrl = exports.oobInvitationFromShortUrl = exports.parseInvitationUrl = exports.parseInvitationJson = void 0;
exports.transformLegacyConnectionlessInvitationToOutOfBandInvitation = transformLegacyConnectionlessInvitationToOutOfBandInvitation;
const core_1 = require("@credo-ts/core");
const query_string_1 = require("query-string");
const AgentMessage_1 = require("../AgentMessage");
const messages_1 = require("../modules/connections/messages");
const converters_1 = require("../modules/oob/converters");
const OutOfBandDidCommService_1 = require("../modules/oob/domain/OutOfBandDidCommService");
const messages_2 = require("../modules/oob/messages");
const messageType_1 = require("./messageType");
const fetchShortUrl = async (invitationUrl, dependencies) => {
    const abortController = new AbortController();
    const id = setTimeout(() => abortController.abort(), 15000);
    let response;
    try {
        response = await dependencies.fetch(invitationUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        throw new core_1.CredoError(`Get request failed on provided url: ${error.message}`, { cause: error });
    }
    clearTimeout(id);
    return response;
};
/**
 * Parses a JSON containing an invitation message and returns an OutOfBandInvitation instance
 *
 * @param invitationJson JSON object containing message
 * @returns OutOfBandInvitation
 */
const parseInvitationJson = (invitationJson) => {
    const messageType = invitationJson['@type'];
    if (!messageType) {
        throw new core_1.CredoError('Invitation is not a valid DIDComm message');
    }
    const parsedMessageType = (0, messageType_1.parseMessageType)(messageType);
    if ((0, messageType_1.supportsIncomingMessageType)(parsedMessageType, messages_2.OutOfBandInvitation.type)) {
        const invitation = core_1.JsonTransformer.fromJSON(invitationJson, messages_2.OutOfBandInvitation);
        core_1.MessageValidator.validateSync(invitation);
        invitation.invitationType = messages_2.InvitationType.OutOfBand;
        return invitation;
    }
    if ((0, messageType_1.supportsIncomingMessageType)(parsedMessageType, messages_1.ConnectionInvitationMessage.type)) {
        const invitation = core_1.JsonTransformer.fromJSON(invitationJson, messages_1.ConnectionInvitationMessage);
        core_1.MessageValidator.validateSync(invitation);
        const outOfBandInvitation = (0, converters_1.convertToNewInvitation)(invitation);
        outOfBandInvitation.invitationType = messages_2.InvitationType.Connection;
        return outOfBandInvitation;
    }
    if (invitationJson['~service']) {
        // This is probably a legacy connectionless invitation
        return transformLegacyConnectionlessInvitationToOutOfBandInvitation(invitationJson);
    }
    throw new core_1.CredoError(`Invitation with '@type' ${parsedMessageType.messageTypeUri} not supported.`);
};
exports.parseInvitationJson = parseInvitationJson;
/**
 * Parses URL containing encoded invitation and returns invitation message.
 *
 * @param invitationUrl URL containing encoded invitation
 *
 * @returns OutOfBandInvitation
 */
const parseInvitationUrl = (invitationUrl) => {
    const parsedUrl = (0, query_string_1.parseUrl)(invitationUrl).query;
    const encodedInvitation = parsedUrl.oob ?? parsedUrl.c_i ?? parsedUrl.d_m;
    if (typeof encodedInvitation === 'string') {
        const invitationJson = core_1.JsonEncoder.fromBase64(encodedInvitation);
        return (0, exports.parseInvitationJson)(invitationJson);
    }
    throw new core_1.CredoError('InvitationUrl is invalid. It needs to contain one, and only one, of the following parameters: `oob`, `c_i` or `d_m`.');
};
exports.parseInvitationUrl = parseInvitationUrl;
// This currently does not follow the RFC because of issues with fetch, currently uses a janky work around
const oobInvitationFromShortUrl = async (response) => {
    if (response) {
        if (response.headers.get('Content-Type')?.startsWith('application/json') && response.ok) {
            const invitationJson = (await response.json());
            return (0, exports.parseInvitationJson)(invitationJson);
        }
        if (response.url) {
            // The following if else is for here for trinsic shorten urls
            // Because the redirect targets a deep link the automatic redirect does not occur
            let responseUrl;
            const location = response.headers.get('Location');
            if ((response.status === 302 || response.status === 301) && location)
                responseUrl = location;
            else
                responseUrl = response.url;
            return (0, exports.parseInvitationUrl)(responseUrl);
        }
    }
    throw new core_1.CredoError('HTTP request time out or did not receive valid response');
};
exports.oobInvitationFromShortUrl = oobInvitationFromShortUrl;
function transformLegacyConnectionlessInvitationToOutOfBandInvitation(messageJson) {
    const agentMessage = core_1.JsonTransformer.fromJSON(messageJson, AgentMessage_1.AgentMessage);
    // ~service is required for legacy connectionless invitations
    if (!agentMessage.service) {
        throw new core_1.CredoError('Invalid legacy connectionless invitation url. Missing ~service decorator.');
    }
    // This destructuring removes the ~service property from the message, and
    // we can can use messageWithoutService to create the out of band invitation
    const { '~service': service, ...messageWithoutService } = messageJson;
    // transform into out of band invitation
    const invitation = new messages_2.OutOfBandInvitation({
        services: [OutOfBandDidCommService_1.OutOfBandDidCommService.fromResolvedDidCommService(agentMessage.service.resolvedDidCommService)],
    });
    invitation.invitationType = messages_2.InvitationType.Connectionless;
    invitation.addRequest(core_1.JsonTransformer.fromJSON(messageWithoutService, AgentMessage_1.AgentMessage));
    return invitation;
}
/**
 * Parses URL containing encoded invitation and returns invitation message. Compatible with
 * parsing short Urls
 *
 * @param invitationUrl URL containing encoded invitation
 *
 * @param dependencies Agent dependencies containing fetch
 *
 * @returns OutOfBandInvitation
 */
const parseInvitationShortUrl = async (invitationUrl, dependencies) => {
    const parsedUrl = (0, query_string_1.parseUrl)(invitationUrl).query;
    if (parsedUrl.oob || parsedUrl.c_i) {
        return (0, exports.parseInvitationUrl)(invitationUrl);
    }
    // Legacy connectionless invitation
    if (parsedUrl.d_m) {
        const messageJson = core_1.JsonEncoder.fromBase64(parsedUrl.d_m);
        return transformLegacyConnectionlessInvitationToOutOfBandInvitation(messageJson);
    }
    try {
        const outOfBandInvitation = await (0, exports.oobInvitationFromShortUrl)(await fetchShortUrl(invitationUrl, dependencies));
        outOfBandInvitation.invitationType = messages_2.InvitationType.OutOfBand;
        return outOfBandInvitation;
    }
    catch (_error) {
        throw new core_1.CredoError('InvitationUrl is invalid. It needs to contain one, and only one, of the following parameters: `oob`, `c_i` or `d_m`, or be valid shortened URL');
    }
};
exports.parseInvitationShortUrl = parseInvitationShortUrl;
//# sourceMappingURL=parseInvitation.js.map