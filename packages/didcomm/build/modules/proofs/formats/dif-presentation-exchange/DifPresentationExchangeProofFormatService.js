"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifPresentationExchangeProofFormatService = void 0;
const core_1 = require("@credo-ts/core");
const Attachment_1 = require("../../../../decorators/attachment/Attachment");
const models_1 = require("../../models");
const PRESENTATION_EXCHANGE_PRESENTATION_PROPOSAL = 'dif/presentation-exchange/definitions@v1.0';
const PRESENTATION_EXCHANGE_PRESENTATION_REQUEST = 'dif/presentation-exchange/definitions@v1.0';
const PRESENTATION_EXCHANGE_PRESENTATION = 'dif/presentation-exchange/submission@v1.0';
class DifPresentationExchangeProofFormatService {
    constructor() {
        this.formatKey = 'presentationExchange';
    }
    presentationExchangeService(agentContext) {
        return agentContext.dependencyManager.resolve(core_1.DifPresentationExchangeService);
    }
    supportsFormat(formatIdentifier) {
        return [
            PRESENTATION_EXCHANGE_PRESENTATION_PROPOSAL,
            PRESENTATION_EXCHANGE_PRESENTATION_REQUEST,
            PRESENTATION_EXCHANGE_PRESENTATION,
        ].includes(formatIdentifier);
    }
    async createProposal(agentContext, { proofFormats, attachmentId }) {
        const ps = this.presentationExchangeService(agentContext);
        const pexFormat = proofFormats.presentationExchange;
        if (!pexFormat) {
            throw new core_1.CredoError('Missing Presentation Exchange format in create proposal attachment format');
        }
        const { presentationDefinition } = pexFormat;
        ps.validatePresentationDefinition(presentationDefinition);
        const format = new models_1.ProofFormatSpec({ format: PRESENTATION_EXCHANGE_PRESENTATION_PROPOSAL, attachmentId });
        const attachment = this.getFormatData(presentationDefinition, format.attachmentId);
        return { format, attachment };
    }
    async processProposal(agentContext, { attachment }) {
        const ps = this.presentationExchangeService(agentContext);
        const proposal = attachment.getDataAsJson();
        ps.validatePresentationDefinition(proposal);
    }
    async acceptProposal(agentContext, { attachmentId, proposalAttachment, proofFormats, }) {
        const ps = this.presentationExchangeService(agentContext);
        const presentationExchangeFormat = proofFormats?.presentationExchange;
        const format = new models_1.ProofFormatSpec({
            format: PRESENTATION_EXCHANGE_PRESENTATION_REQUEST,
            attachmentId,
        });
        const presentationDefinition = proposalAttachment.getDataAsJson();
        ps.validatePresentationDefinition(presentationDefinition);
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const attachment = this.getFormatData({
            presentation_definition: presentationDefinition,
            options: {
                // NOTE: we always want to include a challenge to prevent replay attacks
                challenge: presentationExchangeFormat?.options?.challenge ??
                    core_1.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 })),
                domain: presentationExchangeFormat?.options?.domain,
            },
        }, format.attachmentId);
        return { format, attachment };
    }
    async createRequest(agentContext, { attachmentId, proofFormats }) {
        const ps = this.presentationExchangeService(agentContext);
        const presentationExchangeFormat = proofFormats.presentationExchange;
        if (!presentationExchangeFormat) {
            throw Error('Missing presentation exchange format in create request attachment format');
        }
        const { presentationDefinition, options } = presentationExchangeFormat;
        ps.validatePresentationDefinition(presentationDefinition);
        const format = new models_1.ProofFormatSpec({
            format: PRESENTATION_EXCHANGE_PRESENTATION_REQUEST,
            attachmentId,
        });
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const attachment = this.getFormatData({
            presentation_definition: presentationDefinition,
            options: {
                // NOTE: we always want to include a challenge to prevent replay attacks
                challenge: options?.challenge ?? core_1.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 })),
                domain: options?.domain,
            },
        }, format.attachmentId);
        return { attachment, format };
    }
    async processRequest(agentContext, { attachment }) {
        const ps = this.presentationExchangeService(agentContext);
        const { presentation_definition: presentationDefinition } = attachment.getDataAsJson();
        ps.validatePresentationDefinition(presentationDefinition);
    }
    async acceptRequest(agentContext, { attachmentId, requestAttachment, proofFormats, }) {
        const ps = this.presentationExchangeService(agentContext);
        const format = new models_1.ProofFormatSpec({
            format: PRESENTATION_EXCHANGE_PRESENTATION,
            attachmentId,
        });
        const { presentation_definition: presentationDefinition, options } = requestAttachment.getDataAsJson();
        let credentials;
        if (proofFormats?.presentationExchange?.credentials) {
            credentials = proofFormats.presentationExchange.credentials;
        }
        else {
            const credentialsForRequest = await ps.getCredentialsForRequest(agentContext, presentationDefinition);
            credentials = ps.selectCredentialsForRequest(credentialsForRequest);
        }
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const presentation = await ps.createPresentation(agentContext, {
            presentationDefinition,
            credentialsForInputDescriptor: credentials,
            challenge: options?.challenge ?? core_1.TypedArrayEncoder.toBase64URL(kms.randomBytes({ length: 32 })),
            domain: options?.domain,
        });
        if (!presentation) {
            throw new core_1.CredoError('Failed to create presentation for request.');
        }
        if (presentation.verifiablePresentations.length > 1) {
            throw new core_1.CredoError('Invalid amount of verifiable presentations. Only one is allowed.');
        }
        if (presentation.presentationSubmissionLocation === core_1.DifPresentationExchangeSubmissionLocation.EXTERNAL) {
            throw new core_1.CredoError('External presentation submission is not supported.');
        }
        const firstPresentation = presentation.verifiablePresentations[0];
        // TODO: they should all have `encoded` property so it's easy to use the resulting VP
        const encodedFirstPresentation = firstPresentation instanceof core_1.W3cJwtVerifiablePresentation ||
            firstPresentation instanceof core_1.W3cJsonLdVerifiablePresentation
            ? firstPresentation.encoded
            : firstPresentation instanceof core_1.MdocDeviceResponse
                ? firstPresentation.base64Url
                : firstPresentation?.compact;
        const attachment = this.getFormatData(encodedFirstPresentation, format.attachmentId);
        return { attachment, format };
    }
    shouldVerifyUsingAnonCredsDataIntegrity(presentation, presentationSubmission) {
        if (presentation.claimFormat !== core_1.ClaimFormat.LdpVp)
            return false;
        const descriptorMap = presentationSubmission.descriptor_map;
        const verifyUsingDataIntegrity = descriptorMap.every((descriptor) => descriptor.format === core_1.ClaimFormat.DiVp);
        if (!verifyUsingDataIntegrity)
            return false;
        return presentation.dataIntegrityCryptosuites.includes(core_1.ANONCREDS_DATA_INTEGRITY_CRYPTOSUITE);
    }
    async processPresentation(agentContext, { requestAttachment, attachment, proofRecord }) {
        const ps = this.presentationExchangeService(agentContext);
        const w3cCredentialService = agentContext.dependencyManager.resolve(core_1.W3cCredentialService);
        const request = requestAttachment.getDataAsJson();
        const presentation = attachment.getDataAsJson();
        let parsedPresentation;
        let jsonPresentation;
        // TODO: we should probably move this transformation logic into the VC module, so it
        // can be reused in Credo when we need to go from encoded -> parsed
        if (typeof presentation === 'string' && presentation.includes('~')) {
            // NOTE: we need to define in the PEX RFC where to put the presentation_submission
            throw new core_1.CredoError('Received SD-JWT VC in PEX proof format. This is not supported yet.');
        }
        if (typeof presentation === 'string') {
            // If it's a string, we expect it to be a JWT VP
            parsedPresentation = core_1.W3cJwtVerifiablePresentation.fromSerializedJwt(presentation);
            jsonPresentation = parsedPresentation.presentation.toJSON();
        }
        else {
            // Otherwise we expect it to be a JSON-LD VP
            parsedPresentation = core_1.JsonTransformer.fromJSON(presentation, core_1.W3cJsonLdVerifiablePresentation);
            jsonPresentation = parsedPresentation.toJSON();
        }
        if (!jsonPresentation.presentation_submission) {
            agentContext.config.logger.error('Received presentation in PEX proof format without presentation submission. This should not happen.');
            return false;
        }
        if (!request.options?.challenge) {
            agentContext.config.logger.error('Received presentation in PEX proof format without challenge. This should not happen.');
            return false;
        }
        try {
            ps.validatePresentationDefinition(request.presentation_definition);
            ps.validatePresentationSubmission(jsonPresentation.presentation_submission);
            ps.validatePresentation(request.presentation_definition, parsedPresentation);
            let verificationResult;
            // FIXME: for some reason it won't accept the input if it doesn't know
            // whether it's a JWT or JSON-LD VP even though the input is the same.
            // Not sure how to fix
            if (parsedPresentation.claimFormat === core_1.ClaimFormat.JwtVp) {
                const x509Config = agentContext.dependencyManager.resolve(core_1.X509ModuleConfig);
                const certificateChain = (0, core_1.extractX509CertificatesFromJwt)(parsedPresentation.jwt);
                let trustedCertificates;
                if (certificateChain && x509Config.getTrustedCertificatesForVerification) {
                    trustedCertificates = await x509Config.getTrustedCertificatesForVerification?.(agentContext, {
                        certificateChain,
                        verification: {
                            type: 'credential',
                            credential: parsedPresentation,
                            didcommProofRecordId: proofRecord.id,
                        },
                    });
                }
                if (!trustedCertificates) {
                    trustedCertificates = x509Config.trustedCertificates ?? [];
                }
                verificationResult = await w3cCredentialService.verifyPresentation(agentContext, {
                    presentation: parsedPresentation,
                    challenge: request.options.challenge,
                    domain: request.options.domain,
                });
            }
            else if (parsedPresentation.claimFormat === core_1.ClaimFormat.LdpVp) {
                if (this.shouldVerifyUsingAnonCredsDataIntegrity(parsedPresentation, jsonPresentation.presentation_submission)) {
                    const dataIntegrityService = agentContext.dependencyManager.resolve(core_1.AnonCredsDataIntegrityServiceSymbol);
                    const proofVerificationResult = await dataIntegrityService.verifyPresentation(agentContext, {
                        presentation: parsedPresentation,
                        presentationDefinition: request.presentation_definition,
                        presentationSubmission: jsonPresentation.presentation_submission,
                        challenge: request.options.challenge,
                    });
                    verificationResult = {
                        isValid: proofVerificationResult,
                        validations: {},
                        error: {
                            name: 'DataIntegrityError',
                            message: 'Verifying the Data Integrity Proof failed. An unknown error occurred.',
                        },
                    };
                }
                else {
                    verificationResult = await w3cCredentialService.verifyPresentation(agentContext, {
                        presentation: parsedPresentation,
                        challenge: request.options.challenge,
                        domain: request.options.domain,
                    });
                }
            }
            else {
                agentContext.config.logger.error(`Received presentation in PEX proof format with unsupported format ${
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                parsedPresentation.claimFormat}.`);
                return false;
            }
            if (!verificationResult.isValid) {
                agentContext.config.logger.error(`Received presentation in PEX proof format that could not be verified: ${verificationResult.error}`, { verificationResult });
                return false;
            }
            return true;
        }
        catch (e) {
            agentContext.config.logger.error(`Failed to verify presentation in PEX proof format service: ${e.message}`, {
                cause: e,
            });
            return false;
        }
    }
    async getCredentialsForRequest(agentContext, { requestAttachment }) {
        const ps = this.presentationExchangeService(agentContext);
        const { presentation_definition: presentationDefinition } = requestAttachment.getDataAsJson();
        ps.validatePresentationDefinition(presentationDefinition);
        const presentationSubmission = await ps.getCredentialsForRequest(agentContext, presentationDefinition);
        return presentationSubmission;
    }
    async selectCredentialsForRequest(agentContext, { requestAttachment }) {
        const ps = this.presentationExchangeService(agentContext);
        const { presentation_definition: presentationDefinition } = requestAttachment.getDataAsJson();
        const credentialsForRequest = await ps.getCredentialsForRequest(agentContext, presentationDefinition);
        return { credentials: ps.selectCredentialsForRequest(credentialsForRequest) };
    }
    async shouldAutoRespondToProposal(_agentContext, { requestAttachment, proposalAttachment }) {
        const proposalData = proposalAttachment.getDataAsJson();
        const requestData = requestAttachment.getDataAsJson();
        return (0, core_1.deepEquality)(requestData.presentation_definition, proposalData);
    }
    async shouldAutoRespondToRequest(_agentContext, { requestAttachment, proposalAttachment }) {
        const proposalData = proposalAttachment.getDataAsJson();
        const requestData = requestAttachment.getDataAsJson();
        return (0, core_1.deepEquality)(requestData.presentation_definition, proposalData);
    }
    /**
     *
     * The presentation is already verified in processPresentation, so we can just return true here.
     * It's only an ack, so it's just that we received the presentation.
     *
     */
    async shouldAutoRespondToPresentation(_agentContext, _options) {
        return true;
    }
    getFormatData(data, id) {
        const attachment = new Attachment_1.Attachment({
            id,
            mimeType: 'application/json',
            data: new Attachment_1.AttachmentData({
                json: data,
            }),
        });
        return attachment;
    }
}
exports.DifPresentationExchangeProofFormatService = DifPresentationExchangeProofFormatService;
//# sourceMappingURL=DifPresentationExchangeProofFormatService.js.map