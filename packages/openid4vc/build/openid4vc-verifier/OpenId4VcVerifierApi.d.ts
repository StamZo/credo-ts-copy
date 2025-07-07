import type { Query, QueryOptions } from '@credo-ts/core';
import type { OpenId4VcUpdateVerifierRecordOptions, OpenId4VpCreateAuthorizationRequestOptions, OpenId4VpCreateAuthorizationRequestReturn, OpenId4VpCreateVerifierOptions, OpenId4VpVerifyAuthorizationResponseOptions } from './OpenId4VpVerifierServiceOptions';
import type { OpenId4VcVerificationSessionRecord } from './repository';
import { AgentContext } from '@credo-ts/core';
import { OpenId4VcVerifierModuleConfig } from './OpenId4VcVerifierModuleConfig';
import { OpenId4VpVerifierService } from './OpenId4VpVerifierService';
/**
 * @public
 */
export declare class OpenId4VcVerifierApi {
    readonly config: OpenId4VcVerifierModuleConfig;
    private agentContext;
    private openId4VpVerifierService;
    constructor(config: OpenId4VcVerifierModuleConfig, agentContext: AgentContext, openId4VpVerifierService: OpenId4VpVerifierService);
    /**
     * Retrieve all verifier records from storage
     */
    getAllVerifiers(): Promise<import("./repository").OpenId4VcVerifierRecord[]>;
    /**
     * Retrieve a verifier record from storage by its verified id
     */
    getVerifierByVerifierId(verifierId: string): Promise<import("./repository").OpenId4VcVerifierRecord>;
    /**
     * Create a new verifier and store the new verifier record.
     */
    createVerifier(options?: OpenId4VpCreateVerifierOptions): Promise<import("./repository").OpenId4VcVerifierRecord>;
    updateVerifierMetadata(options: OpenId4VcUpdateVerifierRecordOptions): Promise<void>;
    findVerificationSessionsByQuery(query: Query<OpenId4VcVerificationSessionRecord>, queryOptions?: QueryOptions): Promise<OpenId4VcVerificationSessionRecord[]>;
    getVerificationSessionById(verificationSessionId: string): Promise<OpenId4VcVerificationSessionRecord>;
    /**
     * Create an OpenID4VP authorization request, acting as a Relying Party (RP).
     *
     * See {@link OpenId4VpCreateAuthorizationRequestOptions} for detailed documentation on the options.
     */
    createAuthorizationRequest({ verifierId, ...otherOptions }: OpenId4VpCreateAuthorizationRequestOptions & {
        verifierId: string;
    }): Promise<OpenId4VpCreateAuthorizationRequestReturn>;
    /**
     * Verifies an authorization response, acting as a Relying Party (RP).
     *
     * It validates the ID Token, VP Token and the signature(s) of the received Verifiable Presentation(s)
     * as well as that the structure of the Verifiable Presentation matches the provided presentation definition.
     */
    verifyAuthorizationResponse({ verificationSessionId, ...otherOptions }: OpenId4VpVerifyAuthorizationResponseOptions & {
        verificationSessionId: string;
    }): Promise<import("./OpenId4VpVerifierServiceOptions").OpenId4VpVerifiedAuthorizationResponse>;
    getVerifiedAuthorizationResponse(verificationSessionId: string): Promise<import("./OpenId4VpVerifierServiceOptions").OpenId4VpVerifiedAuthorizationResponse>;
}
