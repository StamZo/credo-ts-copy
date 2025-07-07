"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthorizationRequestEndpoint = configureAuthorizationRequestEndpoint;
const core_1 = require("@credo-ts/core");
const router_1 = require("../../shared/router");
const OpenId4VcVerificationSessionState_1 = require("../OpenId4VcVerificationSessionState");
const OpenId4VcVerifierModuleConfig_1 = require("../OpenId4VcVerifierModuleConfig");
const OpenId4VpVerifierService_1 = require("../OpenId4VpVerifierService");
function configureAuthorizationRequestEndpoint(router, config) {
    router.get((0, core_1.joinUriParts)(config.authorizationRequestEndpoint, [':authorizationRequestId']), async (request, response, next) => {
        const { agentContext, verifier } = (0, router_1.getRequestContext)(request);
        if (!request.params.authorizationRequestId || typeof request.params.authorizationRequestId !== 'string') {
            return (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, 'invalid_request', 'Invalid authorization request url');
        }
        try {
            const verifierService = agentContext.dependencyManager.resolve(OpenId4VpVerifierService_1.OpenId4VpVerifierService);
            const verifierConfig = agentContext.dependencyManager.resolve(OpenId4VcVerifierModuleConfig_1.OpenId4VcVerifierModuleConfig);
            // We always use shortened URIs currently
            const fullAuthorizationRequestUri = (0, core_1.joinUriParts)(verifierConfig.baseUrl, [
                verifier.verifierId,
                verifierConfig.authorizationRequestEndpoint,
                request.params.authorizationRequestId,
            ]);
            const [verificationSession] = await verifierService.findVerificationSessionsByQuery(agentContext, {
                verifierId: verifier.verifierId,
                $or: [
                    {
                        authorizationRequestId: request.params.authorizationRequestId,
                    },
                    // NOTE: this can soon be removed, authorization request id is cleaner,
                    // but only introduced since 0.6
                    {
                        authorizationRequestUri: fullAuthorizationRequestUri,
                    },
                ],
            });
            // Not all requets are signed, and those are not fetcheable
            if (!verificationSession || !verificationSession.authorizationRequestJwt) {
                return (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 404, 'not_found', 'Authorization request not found');
            }
            if (![
                OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestCreated,
                OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestUriRetrieved,
            ].includes(verificationSession.state)) {
                return (0, router_1.sendErrorResponse)(response, next, agentContext.config.logger, 400, 'invalid_request', 'Invalid state for authorization request');
            }
            if (verificationSession.expiresAt && Date.now() > verificationSession.expiresAt.getTime()) {
                return (0, router_1.sendNotFoundResponse)(response, next, agentContext.config.logger, 'Session expired');
            }
            // It's okay to retrieve the offer multiple times. So we only update the state if it's not already retrieved
            if (verificationSession.state !== OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestUriRetrieved) {
                await verifierService.updateState(agentContext, verificationSession, OpenId4VcVerificationSessionState_1.OpenId4VcVerificationSessionState.RequestUriRetrieved);
            }
            response.type('application/oauth-authz-req+jwt').status(200).send(verificationSession.authorizationRequestJwt);
            next();
        }
        catch (error) {
            return (0, router_1.sendUnknownServerErrorResponse)(response, next, agentContext.config.logger, error);
        }
    });
}
//# sourceMappingURL=authorizationRequestEndpoint.js.map