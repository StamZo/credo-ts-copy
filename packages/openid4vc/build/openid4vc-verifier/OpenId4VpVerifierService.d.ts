import { AgentContext, Query, QueryOptions } from '@credo-ts/core';
import { Logger, W3cCredentialService } from '@credo-ts/core';
import { OpenId4VcVerificationSessionState } from './OpenId4VcVerificationSessionState';
import { OpenId4VcVerifierModuleConfig } from './OpenId4VcVerifierModuleConfig';
import type { OpenId4VpCreateAuthorizationRequestOptions, OpenId4VpCreateAuthorizationRequestReturn, OpenId4VpCreateVerifierOptions, OpenId4VpVerifiedAuthorizationResponse, OpenId4VpVerifyAuthorizationResponseOptions } from './OpenId4VpVerifierServiceOptions';
import { OpenId4VcVerificationSessionRecord, OpenId4VcVerificationSessionRepository, OpenId4VcVerifierRecord, OpenId4VcVerifierRepository } from './repository';
/**
 * @internal
 */
export declare class OpenId4VpVerifierService {
    private logger;
    private w3cCredentialService;
    private openId4VcVerifierRepository;
    private config;
    private openId4VcVerificationSessionRepository;
    constructor(logger: Logger, w3cCredentialService: W3cCredentialService, openId4VcVerifierRepository: OpenId4VcVerifierRepository, config: OpenId4VcVerifierModuleConfig, openId4VcVerificationSessionRepository: OpenId4VcVerificationSessionRepository);
    private getOpenid4vpVerifier;
    createAuthorizationRequest(agentContext: AgentContext, options: OpenId4VpCreateAuthorizationRequestOptions & {
        verifier: OpenId4VcVerifierRecord;
    }): Promise<OpenId4VpCreateAuthorizationRequestReturn>;
    private getDcqlVerifiedResponse;
    private parseAuthorizationResponse;
    verifyAuthorizationResponse(agentContext: AgentContext, options: OpenId4VpVerifyAuthorizationResponseOptions & {
        /**
         * The verification session associated with the response
         */
        verificationSession: OpenId4VcVerificationSessionRecord;
    }): Promise<OpenId4VpVerifiedAuthorizationResponse>;
    /**
     * Get the format based on an encoded presentation. This is mostly leveraged for
     * PEX where it's not known based on the request which format to expect
     */
    private claimFormatFromEncodedPresentation;
    getVerifiedAuthorizationResponse(agentContext: AgentContext, verificationSession: OpenId4VcVerificationSessionRecord): Promise<OpenId4VpVerifiedAuthorizationResponse>;
    private getVerifiedTransactionData;
    getAllVerifiers(agentContext: AgentContext): Promise<OpenId4VcVerifierRecord[]>;
    getVerifierByVerifierId(agentContext: AgentContext, verifierId: string): Promise<OpenId4VcVerifierRecord>;
    updateVerifier(agentContext: AgentContext, verifier: OpenId4VcVerifierRecord): Promise<void>;
    createVerifier(agentContext: AgentContext, options?: OpenId4VpCreateVerifierOptions): Promise<OpenId4VcVerifierRecord>;
    findVerificationSessionsByQuery(agentContext: AgentContext, query: Query<OpenId4VcVerificationSessionRecord>, queryOptions?: QueryOptions): Promise<OpenId4VcVerificationSessionRecord[]>;
    getVerificationSessionById(agentContext: AgentContext, verificationSessionId: string): Promise<OpenId4VcVerificationSessionRecord>;
    private getClientMetadata;
    private decodePresentation;
    private verifyPresentation;
    /**
     * Update the record to a new state and emit an state changed event. Also updates the record
     * in storage.
     */
    updateState(agentContext: AgentContext, verificationSession: OpenId4VcVerificationSessionRecord, newState: OpenId4VcVerificationSessionState): Promise<void>;
    protected emitStateChangedEvent(agentContext: AgentContext, verificationSession: OpenId4VcVerificationSessionRecord, previousState: OpenId4VcVerificationSessionState | null): void;
}
