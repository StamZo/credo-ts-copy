import type { AgentContext, DifPresentationExchangeSubmission } from '@credo-ts/core';
import type { OpenId4VpAcceptAuthorizationRequestOptions, OpenId4VpResolvedAuthorizationRequest, ResolveOpenId4VpAuthorizationRequestOptions } from './OpenId4vpHolderServiceOptions';
import { DcqlService, DifPresentationExchangeService } from '@credo-ts/core';
export declare class OpenId4VpHolderService {
    private presentationExchangeService;
    private dcqlService;
    constructor(presentationExchangeService: DifPresentationExchangeService, dcqlService: DcqlService);
    private getOpenid4vpClient;
    private handlePresentationExchangeRequest;
    private handleDcqlRequest;
    resolveAuthorizationRequest(agentContext: AgentContext, 
    /**
     * Can be:
     * - JWT
     * - URI containing request or request_uri param
     * - Request payload
     */
    authorizationRequest: string | Record<string, unknown>, options?: ResolveOpenId4VpAuthorizationRequestOptions): Promise<OpenId4VpResolvedAuthorizationRequest>;
    private extendCredentialsWithTransactionDataHashes;
    acceptAuthorizationRequest(agentContext: AgentContext, options: OpenId4VpAcceptAuthorizationRequestOptions): Promise<{
        readonly ok: true;
        readonly authorizationResponse: ({
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        }) | {
            response: string;
        };
        readonly authorizationResponsePayload: {
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        };
        readonly serverResponse?: undefined;
        readonly redirectUri?: undefined;
        readonly presentationDuringIssuanceSession?: undefined;
    } | {
        readonly ok: false;
        readonly serverResponse: {
            readonly status: number;
            readonly body: string | Record<string, unknown> | null;
        };
        readonly authorizationResponse: ({
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        }) | {
            response: string;
        };
        readonly authorizationResponsePayload: {
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        };
        readonly redirectUri?: undefined;
        readonly presentationDuringIssuanceSession?: undefined;
    } | {
        readonly ok: true;
        readonly serverResponse: {
            readonly status: number;
            readonly body: Record<string, unknown>;
        };
        readonly authorizationResponse: ({
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        }) | {
            response: string;
        };
        readonly authorizationResponsePayload: {
            vp_token: string | Record<string, any> | Record<string, string | Record<string, any>> | [string | Record<string, any>, ...(string | Record<string, any>)[]];
            presentation_submission?: any;
            access_token?: string | undefined;
            token_type?: string | undefined;
            expires_in?: number | undefined;
            state?: string | undefined;
            refresh_token?: string | undefined;
            id_token?: string | undefined;
        } & {
            [k: string]: unknown;
        } & {
            presentation_submission?: DifPresentationExchangeSubmission;
        };
        readonly redirectUri: string | undefined;
        readonly presentationDuringIssuanceSession: string | undefined;
    }>;
}
