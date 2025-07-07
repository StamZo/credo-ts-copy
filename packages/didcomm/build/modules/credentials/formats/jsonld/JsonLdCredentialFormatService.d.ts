import type { AgentContext } from '@credo-ts/core';
import type { CredentialFormatService } from '../CredentialFormatService';
import type { CredentialFormatAcceptOfferOptions, CredentialFormatAcceptProposalOptions, CredentialFormatAcceptRequestOptions, CredentialFormatAutoRespondCredentialOptions, CredentialFormatAutoRespondOfferOptions, CredentialFormatAutoRespondProposalOptions, CredentialFormatAutoRespondRequestOptions, CredentialFormatCreateOfferOptions, CredentialFormatCreateOfferReturn, CredentialFormatCreateProposalOptions, CredentialFormatCreateProposalReturn, CredentialFormatCreateRequestOptions, CredentialFormatCreateReturn, CredentialFormatProcessCredentialOptions, CredentialFormatProcessOptions } from '../CredentialFormatServiceOptions';
import type { JsonLdCredentialFormat } from './JsonLdCredentialFormat';
import { Attachment } from '../../../../decorators/attachment/Attachment';
export declare class JsonLdCredentialFormatService implements CredentialFormatService<JsonLdCredentialFormat> {
    readonly formatKey: "jsonld";
    readonly credentialRecordType: "w3c";
    /**
     * Create a {@link AttachmentFormats} object dependent on the message type.
     *
     * @param options The object containing all the options for the proposed credential
     * @returns object containing associated attachment, formats and filtersAttach elements
     *
     */
    createProposal(_agentContext: AgentContext, { credentialFormats }: CredentialFormatCreateProposalOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateProposalReturn>;
    /**
     * Method called on reception of a propose credential message
     * @param options the options needed to accept the proposal
     */
    processProposal(_agentContext: AgentContext, { attachment }: CredentialFormatProcessOptions): Promise<void>;
    acceptProposal(_agentContext: AgentContext, { attachmentId, proposalAttachment }: CredentialFormatAcceptProposalOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateOfferReturn>;
    /**
     * Create a {@link AttachmentFormats} object dependent on the message type.
     *
     * @param options The object containing all the options for the credential offer
     * @returns object containing associated attachment, formats and offersAttach elements
     *
     */
    createOffer(_agentContext: AgentContext, { credentialFormats, attachmentId }: CredentialFormatCreateOfferOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateOfferReturn>;
    processOffer(_agentContext: AgentContext, { attachment }: CredentialFormatProcessOptions): Promise<void>;
    acceptOffer(_agentContext: AgentContext, { attachmentId, offerAttachment }: CredentialFormatAcceptOfferOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateReturn>;
    /**
     * Create a credential attachment format for a credential request.
     *
     * @param options The object containing all the options for the credential request is derived
     * @returns object containing associated attachment, formats and requestAttach elements
     *
     */
    createRequest(_agentContext: AgentContext, { credentialFormats }: CredentialFormatCreateRequestOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateReturn>;
    processRequest(_agentContext: AgentContext, { attachment }: CredentialFormatProcessOptions): Promise<void>;
    acceptRequest(agentContext: AgentContext, { credentialFormats, attachmentId, requestAttachment }: CredentialFormatAcceptRequestOptions<JsonLdCredentialFormat>): Promise<CredentialFormatCreateReturn>;
    /**
     * Derive a verification method using the issuer from the given verifiable credential
     * @param credentialAsJson the verifiable credential we want to sign
     * @return the verification method derived from this credential and its associated issuer did, keys etc.
     */
    private deriveVerificationMethod;
    /**
     * Processes an incoming credential - retrieve metadata, retrieve payload and store it in the Indy wallet
     * @param options the issue credential message wrapped inside this object
     * @param credentialRecord the credential exchange record for this credential
     */
    processCredential(agentContext: AgentContext, { credentialRecord, attachment, requestAttachment }: CredentialFormatProcessCredentialOptions): Promise<void>;
    private verifyReceivedCredentialMatchesRequest;
    supportsFormat(format: string): boolean;
    deleteCredentialById(): Promise<void>;
    areCredentialsEqual: (message1: Attachment, message2: Attachment) => boolean;
    shouldAutoRespondToProposal(_agentContext: AgentContext, { offerAttachment, proposalAttachment }: CredentialFormatAutoRespondProposalOptions): Promise<boolean>;
    shouldAutoRespondToOffer(_agentContext: AgentContext, { offerAttachment, proposalAttachment }: CredentialFormatAutoRespondOfferOptions): Promise<boolean>;
    shouldAutoRespondToRequest(_agentContext: AgentContext, { offerAttachment, requestAttachment }: CredentialFormatAutoRespondRequestOptions): Promise<boolean>;
    shouldAutoRespondToCredential(_agentContext: AgentContext, { requestAttachment, credentialAttachment }: CredentialFormatAutoRespondCredentialOptions): Promise<boolean>;
    /**
     * Returns an object of type {@link Attachment} for use in credential exchange messages.
     * It looks up the correct format identifier and encodes the data as a base64 attachment.
     *
     * @param data The data to include in the attach object
     * @param id the attach id from the formats component of the message
     */
    private getFormatData;
}
