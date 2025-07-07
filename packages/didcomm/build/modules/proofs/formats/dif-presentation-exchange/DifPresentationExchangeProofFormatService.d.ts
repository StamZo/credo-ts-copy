import type { AgentContext, DifPexInputDescriptorToCredentials } from '@credo-ts/core';
import type { ProofFormatService } from '../ProofFormatService';
import type { FormatCreateRequestOptions, ProofFormatAcceptProposalOptions, ProofFormatAcceptRequestOptions, ProofFormatAutoRespondPresentationOptions, ProofFormatAutoRespondProposalOptions, ProofFormatAutoRespondRequestOptions, ProofFormatCreateProposalOptions, ProofFormatCreateReturn, ProofFormatGetCredentialsForRequestOptions, ProofFormatProcessOptions, ProofFormatProcessPresentationOptions, ProofFormatSelectCredentialsForRequestOptions } from '../ProofFormatServiceOptions';
import type { DifPresentationExchangeProofFormat } from './DifPresentationExchangeProofFormat';
export declare class DifPresentationExchangeProofFormatService implements ProofFormatService<DifPresentationExchangeProofFormat> {
    readonly formatKey: "presentationExchange";
    private presentationExchangeService;
    supportsFormat(formatIdentifier: string): boolean;
    createProposal(agentContext: AgentContext, { proofFormats, attachmentId }: ProofFormatCreateProposalOptions<DifPresentationExchangeProofFormat>): Promise<ProofFormatCreateReturn>;
    processProposal(agentContext: AgentContext, { attachment }: ProofFormatProcessOptions): Promise<void>;
    acceptProposal(agentContext: AgentContext, { attachmentId, proposalAttachment, proofFormats, }: ProofFormatAcceptProposalOptions<DifPresentationExchangeProofFormat>): Promise<ProofFormatCreateReturn>;
    createRequest(agentContext: AgentContext, { attachmentId, proofFormats }: FormatCreateRequestOptions<DifPresentationExchangeProofFormat>): Promise<ProofFormatCreateReturn>;
    processRequest(agentContext: AgentContext, { attachment }: ProofFormatProcessOptions): Promise<void>;
    acceptRequest(agentContext: AgentContext, { attachmentId, requestAttachment, proofFormats, }: ProofFormatAcceptRequestOptions<DifPresentationExchangeProofFormat>): Promise<ProofFormatCreateReturn>;
    private shouldVerifyUsingAnonCredsDataIntegrity;
    processPresentation(agentContext: AgentContext, { requestAttachment, attachment, proofRecord }: ProofFormatProcessPresentationOptions): Promise<boolean>;
    getCredentialsForRequest(agentContext: AgentContext, { requestAttachment }: ProofFormatGetCredentialsForRequestOptions<DifPresentationExchangeProofFormat>): Promise<import("@credo-ts/core").DifPexCredentialsForRequest>;
    selectCredentialsForRequest(agentContext: AgentContext, { requestAttachment }: ProofFormatSelectCredentialsForRequestOptions<DifPresentationExchangeProofFormat>): Promise<{
        credentials: DifPexInputDescriptorToCredentials;
    }>;
    shouldAutoRespondToProposal(_agentContext: AgentContext, { requestAttachment, proposalAttachment }: ProofFormatAutoRespondProposalOptions): Promise<boolean>;
    shouldAutoRespondToRequest(_agentContext: AgentContext, { requestAttachment, proposalAttachment }: ProofFormatAutoRespondRequestOptions): Promise<boolean>;
    /**
     *
     * The presentation is already verified in processPresentation, so we can just return true here.
     * It's only an ack, so it's just that we received the presentation.
     *
     */
    shouldAutoRespondToPresentation(_agentContext: AgentContext, _options: ProofFormatAutoRespondPresentationOptions): Promise<boolean>;
    private getFormatData;
}
