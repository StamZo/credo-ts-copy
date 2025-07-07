import type { AgentContext } from '@credo-ts/core';
import type { CredentialFormatAcceptOfferOptions, CredentialFormatAcceptProposalOptions, CredentialFormatAcceptRequestOptions, CredentialFormatAutoRespondCredentialOptions, CredentialFormatAutoRespondOfferOptions, CredentialFormatAutoRespondProposalOptions, CredentialFormatAutoRespondRequestOptions, CredentialFormatCreateOfferOptions, CredentialFormatCreateOfferReturn, CredentialFormatCreateProposalOptions, CredentialFormatCreateProposalReturn, CredentialFormatCreateReturn, CredentialFormatProcessCredentialOptions, CredentialFormatProcessOptions, CredentialFormatService, DataIntegrityCredentialFormat } from '@credo-ts/didcomm';
import { Attachment, CredentialFormatSpec } from '@credo-ts/didcomm';
export declare class DataIntegrityCredentialFormatService implements CredentialFormatService<DataIntegrityCredentialFormat> {
    /** formatKey is the key used when calling agent.credentials.xxx with credentialFormats.anoncreds */
    readonly formatKey: "dataIntegrity";
    /**
     * credentialRecordType is the type of record that stores the credential. It is stored in the credential
     * record binding in the credential exchange record.
     */
    readonly credentialRecordType: "w3c";
    /**
     * Create a {@link AttachmentFormats} object dependent on the message type.
     *
     * @param options The object containing all the options for the proposed credential
     * @returns object containing associated attachment, format and optionally the credential preview
     *
     */
    createProposal(_agentContext: AgentContext, { credentialFormats, credentialRecord }: CredentialFormatCreateProposalOptions<DataIntegrityCredentialFormat>): Promise<CredentialFormatCreateProposalReturn>;
    processProposal(_agentContext: AgentContext, { attachment }: CredentialFormatProcessOptions): Promise<void>;
    acceptProposal(_agentContext: AgentContext, _input: CredentialFormatAcceptProposalOptions<DataIntegrityCredentialFormat>): Promise<CredentialFormatCreateOfferReturn>;
    /**
     * Create a credential attachment format for a credential request.
     *
     * @param options The object containing all the options for the credential offer
     * @returns object containing associated attachment, formats and offersAttach elements
     *
     */
    createOffer(agentContext: AgentContext, { credentialFormats, credentialRecord, attachmentId, }: CredentialFormatCreateOfferOptions<DataIntegrityCredentialFormat>): Promise<CredentialFormatCreateOfferReturn>;
    private getCredentialVersion;
    processOffer(agentContext: AgentContext, { attachment, credentialRecord }: CredentialFormatProcessOptions): Promise<void>;
    private createSignedAttachment;
    private getSignedAttachmentPayload;
    acceptOffer(agentContext: AgentContext, { credentialRecord, attachmentId, offerAttachment, credentialFormats, }: CredentialFormatAcceptOfferOptions<DataIntegrityCredentialFormat>): Promise<CredentialFormatCreateReturn>;
    /**
     * Starting from a request is not supported for anoncreds credentials, this method only throws an error.
     */
    createRequest(): Promise<CredentialFormatCreateReturn>;
    /**
     * We don't have any models to validate an anoncreds request object, for now this method does nothing
     */
    processRequest(_agentContext: AgentContext, _options: CredentialFormatProcessOptions): Promise<void>;
    private createCredentialWithAnonCredsDataIntegrityProof;
    private getSignatureMetadata;
    private assertAndSetCredentialSubjectId;
    private signCredential;
    acceptRequest(agentContext: AgentContext, { credentialFormats, credentialRecord, attachmentId, offerAttachment, requestAttachment, requestAppendAttachments, }: CredentialFormatAcceptRequestOptions<DataIntegrityCredentialFormat>): Promise<CredentialFormatCreateReturn>;
    private storeAnonCredsCredential;
    /**
     * Processes an incoming credential - retrieve metadata, retrieve payload and store it in wallet
     * @param options the issue credential message wrapped inside this object
     * @param credentialRecord the credential exchange record for this credential
     */
    processCredential(agentContext: AgentContext, { credentialRecord, attachment, requestAttachment, offerAttachment }: CredentialFormatProcessCredentialOptions): Promise<void>;
    supportsFormat(format: string): boolean;
    /**
     * Gets the attachment object for a given attachmentId. We need to get out the correct attachmentId for
     * anoncreds and then find the corresponding attachment (if there is one)
     * @param formats the formats object containing the attachmentId
     * @param messageAttachments the attachments containing the payload
     * @returns The Attachment if found or undefined
     *
     */
    getAttachment(formats: CredentialFormatSpec[], messageAttachments: Attachment[]): Attachment | undefined;
    deleteCredentialById(agentContext: AgentContext, credentialRecordId: string): Promise<void>;
    shouldAutoRespondToProposal(_agentContext: AgentContext, // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    { offerAttachment, proposalAttachment }: CredentialFormatAutoRespondProposalOptions): Promise<boolean>;
    shouldAutoRespondToOffer(_agentContext: AgentContext, { offerAttachment }: CredentialFormatAutoRespondOfferOptions): Promise<boolean>;
    shouldAutoRespondToRequest(_agentContext: AgentContext, { offerAttachment, requestAttachment }: CredentialFormatAutoRespondRequestOptions): Promise<boolean>;
    shouldAutoRespondToCredential(_agentContext: AgentContext, { credentialRecord, requestAttachment, credentialAttachment }: CredentialFormatAutoRespondCredentialOptions): Promise<boolean>;
    private createDataIntegrityCredentialOffer;
    private previewAttributesFromCredential;
    private assertCredentialAttributesMatchSchemaAttributes;
    /**
     * Returns an object of type {@link Attachment} for use in credential exchange messages.
     * It looks up the correct format identifier and encodes the data as a base64 attachment.
     *
     * @param data The data to include in the attach object
     * @param id the attach id from the formats component of the message
     */
    getFormatData(data: unknown, id: string): Attachment;
    /**
     * Returns the JWA Signature Algorithms that are supported by the agent.
     */
    private getSupportedJwaSignatureAlgorithms;
}
