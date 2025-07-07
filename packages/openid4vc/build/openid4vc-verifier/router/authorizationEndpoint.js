"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthorizationEndpoint = configureAuthorizationEndpoint;
const oauth2_1 = require("@openid4vc/oauth2");
const core_1 = require("@credo-ts/core");
// FIXME: export parseOpenid4VpAuthorizationResponsePayload from openid4vp
const openid4vp_1 = require("@openid4vc/openid4vp");
const router_1 = require("../../shared/router");
const OpenId4VpVerifierService_1 = require("../OpenId4VpVerifierService");
const repository_1 = require("../repository");
const utils_1 = require("@openid4vc/utils");
function configureAuthorizationEndpoint(router, config) {
    router.post(config.authorizationEndpoint, async (request, response, next) => {
        const { agentContext, verifier } = (0, router_1.getRequestContext)(request);
        const openId4VcVerifierService = agentContext.dependencyManager.resolve(OpenId4VpVerifierService_1.OpenId4VpVerifierService);
        try {
            const result = await getVerificationSession(agentContext, request, response, next, verifier);
            // Response already handled in the method
            if (!result.success)
                return;
            const { verificationSession } = await openId4VcVerifierService.verifyAuthorizationResponse(agentContext, {
                authorizationResponse: request.body,
                verificationSession: result.verificationSession,
            });
            return (0, router_1.sendJsonResponse)(response, next, {
                // Used only for presentation during issuance flow, to prevent session fixation.
                presentation_during_issuance_session: verificationSession.presentationDuringIssuanceSession,
                // TODO: add callback for the user of Credo, where also a redirect_uri can be returned
                // callback should also be called in case of failed verification
                // redirect_uri
            });
        }
        catch (error) {
            if (error instanceof oauth2_1.Oauth2ServerErrorResponseError) {
                return (0, router_1.sendOauth2ErrorResponse)(response, next, agentContext.config.logger, error);
            }
            // FIXME: should throw a Oauth2ServerErrorResponseError in the oid4vp library
            if (error instanceof utils_1.ValidationError) {
                return (0, router_1.sendOauth2ErrorResponse)(response, next, agentContext.config.logger, new oauth2_1.Oauth2ServerErrorResponseError({
                    error: oauth2_1.Oauth2ErrorCodes.InvalidRequest,
                    error_description: error.message,
                }, { cause: error }));
            }
            // FIXME: Many CredoError will result in 500. We should either throw Oauth2ServerErrorResponseError as well
            // Or have a special OpenID4VP verifier error that is similar to Oauth2ServerErrorResponseError
            return (0, router_1.sendUnknownServerErrorResponse)(response, next, agentContext.config.logger, error);
        }
    });
}
async function getVerificationSession(agentContext, request, response, next, verifier) {
    const openId4VcVerificationSessionRepository = agentContext.dependencyManager.resolve(repository_1.OpenId4VcVerificationSessionRepository);
    try {
        if (request.query.session) {
            if (typeof request.query.session !== 'string') {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Unexpected value for 'session' query param`);
                return { success: false };
            }
            const verificationSession = await openId4VcVerificationSessionRepository.findSingleByQuery(agentContext, {
                verifierId: verifier.verifierId,
                authorizationRequestId: request.query.session,
            });
            if (!verificationSession) {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Invalid 'session' parameter`);
                return { success: false };
            }
            return { success: true, verificationSession };
        }
        const parsedResponse = openid4vp_1.zOpenid4vpAuthorizationResponse.safeParse(request.body);
        if (parsedResponse.success) {
            if (!parsedResponse.data.state) {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Missing required 'state' parameter in response without response encryption`);
                return { success: false };
            }
            const verificationSession = await openId4VcVerificationSessionRepository.findSingleByQuery(agentContext, {
                payloadState: parsedResponse.data.state,
                verifierId: verifier.verifierId,
            });
            if (!verificationSession) {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Invalid 'state' parameter`);
                return { success: false };
            }
            return { success: true, verificationSession };
        }
        // Try extracting apv (request nonce), which is used in encrypted responses (for ISO 18013-7/before draft 24)
        if (typeof request.body === 'object' && 'response' in request.body) {
            const { header } = (0, oauth2_1.decodeJwtHeader)({
                jwt: request.body.response,
            });
            if (!header.apv) {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Missing 'session' query param or 'apv' value in header of encrypted JARM response.`);
                return { success: false };
            }
            if (typeof header.apv !== 'string') {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `'apv' value in header of encrypted JARM response is not of type string.`);
                return { success: false };
            }
            const nonce = core_1.TypedArrayEncoder.toUtf8String(core_1.TypedArrayEncoder.fromBase64(header.apv));
            const verificationSession = await openId4VcVerificationSessionRepository.findSingleByQuery(agentContext, {
                nonce,
                verifierId: verifier.verifierId,
            });
            if (!verificationSession) {
                (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, `Invalid 'apv' parameter`);
                return { success: false };
            }
            return { success: true, verificationSession };
        }
        (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, oauth2_1.Oauth2ErrorCodes.InvalidRequest, 'Invalid response');
        return { success: false };
    }
    catch (error) {
        (0, router_1.sendUnknownServerErrorResponse)(response, next, agentContext.config.logger, error);
        return { success: false };
    }
}
//# sourceMappingURL=authorizationEndpoint.js.map