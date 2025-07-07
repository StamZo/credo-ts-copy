import type { OpenId4VpAuthorizationRequestPayload, OpenId4VpAuthorizationResponsePayload } from '../../shared/models';
import type { OpenId4VcVerificationSessionState } from '../OpenId4VcVerificationSessionState';
import { BaseRecord, RecordTags, TagsBase } from '@credo-ts/core';
export type OpenId4VcVerificationSessionRecordTags = RecordTags<OpenId4VcVerificationSessionRecord>;
export type DefaultOpenId4VcVerificationSessionRecordTags = {
    verifierId: string;
    state: OpenId4VcVerificationSessionState;
    nonce: string;
    payloadState?: string;
    authorizationRequestUri?: string;
    authorizationRequestId?: string;
};
export interface OpenId4VcVerificationSessionRecordProps {
    id?: string;
    createdAt?: Date;
    tags?: TagsBase;
    verifierId: string;
    state: OpenId4VcVerificationSessionState;
    errorMessage?: string;
    authorizationRequestJwt?: string;
    authorizationRequestUri?: string;
    authorizationRequestId: string;
    authorizationRequestPayload?: OpenId4VpAuthorizationRequestPayload;
    expiresAt: Date;
    authorizationResponsePayload?: OpenId4VpAuthorizationResponsePayload;
    /**
     * Presentation during issuance session. This is used when issuance of a credential requires a presentation, and helps
     * prevent session fixation attacks
     */
    presentationDuringIssuanceSession?: string;
}
export declare class OpenId4VcVerificationSessionRecord extends BaseRecord<DefaultOpenId4VcVerificationSessionRecordTags> {
    static readonly type = "OpenId4VcVerificationSessionRecord";
    readonly type = "OpenId4VcVerificationSessionRecord";
    /**
     * The id of the verifier that this session is for.
     */
    verifierId: string;
    /**
     * The state of the verification session.
     */
    state: OpenId4VcVerificationSessionState;
    /**
     * Optional error message of the error that occurred during the verification session. Will be set when state is {@link OpenId4VcVerificationSessionState.Error}
     */
    errorMessage?: string;
    /**
     * The signed JWT containing the authorization request
     */
    authorizationRequestJwt?: string;
    /**
     * Authorization request payload. This should be used only for unsigned requests
     */
    authorizationRequestPayload?: OpenId4VpAuthorizationRequestPayload;
    /**
     * URI of the authorization request. This is the url that can be used to
     * retrieve the authorization request.
     *
     * Not used for requests with response_mode of dc_api or dc_api.jwt
     */
    authorizationRequestUri?: string;
    /**
     * The public id for the authorization request. This is used in the authorization
     * request uri.
     *
     * @since 0.6
     */
    authorizationRequestId?: string;
    /**
     * The time at which the authorization request expires.
     *
     * @since 0.6
     */
    expiresAt?: Date;
    /**
     * The payload of the received authorization response
     */
    authorizationResponsePayload?: OpenId4VpAuthorizationResponsePayload;
    /**
     * Presentation during issuance session. This is used when issuance of a credential requires a presentation, and helps
     * prevent session fixation attacks
     */
    presentationDuringIssuanceSession?: string;
    constructor(props: OpenId4VcVerificationSessionRecordProps);
    get request(): string | OpenId4VpAuthorizationRequestPayload;
    get requestPayload(): OpenId4VpAuthorizationRequestPayload;
    assertState(expectedStates: OpenId4VcVerificationSessionState | OpenId4VcVerificationSessionState[]): void;
    getTags(): {
        verifierId: string;
        state: OpenId4VcVerificationSessionState;
        nonce: string;
        payloadState: string | undefined;
        authorizationRequestUri: string | undefined;
        authorizationRequestId: string | undefined;
    };
}
