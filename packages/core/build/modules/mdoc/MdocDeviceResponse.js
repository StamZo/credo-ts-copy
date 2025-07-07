"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdocDeviceResponse = void 0;
const mdoc_1 = require("@animo-id/mdoc");
const uuid_1 = require("../../utils/uuid");
const vc_1 = require("../vc");
const utils_1 = require("./../../utils");
const Mdoc_1 = require("./Mdoc");
const MdocContext_1 = require("./MdocContext");
const MdocError_1 = require("./MdocError");
const mdocSupportedAlgs_1 = require("./mdocSupportedAlgs");
const mdocUtil_1 = require("./mdocUtil");
class MdocDeviceResponse {
    constructor(base64Url, documents) {
        this.base64Url = base64Url;
        this.documents = documents;
    }
    /**
     * claim format is convenience method added to all credential instances
     */
    get claimFormat() {
        return vc_1.ClaimFormat.MsoMdoc;
    }
    /**
     * Encoded is convenience method added to all credential instances
     */
    get encoded() {
        return this.base64Url;
    }
    /**
     * To support a single DeviceResponse with multiple documents in OpenID4VP
     */
    splitIntoSingleDocumentResponses() {
        const deviceResponses = [];
        if (this.documents.length === 0) {
            throw new MdocError_1.MdocError('mdoc device response does not contain any mdocs');
        }
        for (const document of this.documents) {
            const deviceResponse = new mdoc_1.MDoc();
            deviceResponse.addDocument(document.issuerSignedDocument);
            deviceResponses.push(_a.fromDeviceResponse(deviceResponse));
        }
        return deviceResponses;
    }
    static fromDeviceResponse(mdoc) {
        const documents = mdoc.documents.map((doc) => {
            const prepared = doc.prepare();
            const docType = prepared.get('docType');
            const issuerSigned = (0, mdoc_1.cborEncode)(prepared.get('issuerSigned'));
            const deviceSigned = (0, mdoc_1.cborEncode)(prepared.get('deviceSigned'));
            return Mdoc_1.Mdoc.fromDeviceSignedDocument(utils_1.TypedArrayEncoder.toBase64URL(issuerSigned), utils_1.TypedArrayEncoder.toBase64URL(deviceSigned), docType);
        });
        return new _a(utils_1.TypedArrayEncoder.toBase64URL(mdoc.encode()), documents);
    }
    static fromBase64Url(base64Url) {
        const parsed = (0, mdoc_1.parseDeviceResponse)(utils_1.TypedArrayEncoder.fromBase64(base64Url));
        if (parsed.status !== mdoc_1.MDocStatus.OK) {
            throw new MdocError_1.MdocError('Parsing Mdoc Device Response failed.');
        }
        return _a.fromDeviceResponse(parsed);
    }
    static assertMdocInputDescriptor(inputDescriptor) {
        if (!inputDescriptor.format || !inputDescriptor.format.mso_mdoc) {
            throw new MdocError_1.MdocError(`Input descriptor must contain 'mso_mdoc' format property`);
        }
        if (!inputDescriptor.format.mso_mdoc.alg) {
            throw new MdocError_1.MdocError(`Input descriptor mso_mdoc must contain 'alg' property`);
        }
        if (!inputDescriptor.constraints?.limit_disclosure || inputDescriptor.constraints.limit_disclosure !== 'required') {
            throw new MdocError_1.MdocError(`Input descriptor must contain 'limit_disclosure' constraints property which is set to required`);
        }
        if (!inputDescriptor.constraints?.fields?.every((field) => field.intent_to_retain !== undefined)) {
            throw new MdocError_1.MdocError(`Input descriptor must contain 'intent_to_retain' constraints property`);
        }
        return {
            ...inputDescriptor,
            format: {
                mso_mdoc: inputDescriptor.format.mso_mdoc,
            },
            constraints: {
                ...inputDescriptor.constraints,
                limit_disclosure: 'required',
                fields: (inputDescriptor.constraints.fields ?? []).map((field) => {
                    return {
                        ...field,
                        intent_to_retain: field.intent_to_retain ?? false,
                    };
                }),
            },
        };
    }
    static createPresentationSubmission(input) {
        const { id, presentationDefinition } = input;
        if (presentationDefinition.input_descriptors.length !== 1) {
            throw new MdocError_1.MdocError('Currently Mdoc Presentation Submissions can only be created for a sigle input descriptor');
        }
        return {
            id,
            definition_id: presentationDefinition.id,
            descriptor_map: [
                {
                    id: presentationDefinition.input_descriptors[0].id,
                    format: 'mso_mdoc',
                    path: '$',
                },
            ],
        };
    }
    static limitDisclosureToInputDescriptor(options) {
        const { mdoc } = options;
        const inputDescriptor = _a.assertMdocInputDescriptor(options.inputDescriptor);
        const _mdoc = (0, mdoc_1.parseIssuerSigned)(utils_1.TypedArrayEncoder.fromBase64(mdoc.base64Url), mdoc.docType);
        const disclosure = (0, mdoc_1.limitDisclosureToInputDescriptor)(_mdoc, inputDescriptor);
        const disclosedPayloadAsRecord = Object.fromEntries(Array.from(disclosure.entries()).map(([namespace, issuerSignedItem]) => {
            return [
                namespace,
                Object.fromEntries(issuerSignedItem.map((item) => [item.elementIdentifier, item.elementValue])),
            ];
        }));
        return disclosedPayloadAsRecord;
    }
    static async createPresentationDefinitionDeviceResponse(agentContext, options) {
        const presentationDefinition = _a.partitionPresentationDefinition(options.presentationDefinition).mdocPresentationDefinition;
        const docTypes = options.mdocs.map((i) => i.docType);
        const combinedDeviceResponseMdoc = new mdoc_1.MDoc();
        for (const document of options.mdocs) {
            const deviceKeyJwk = document.deviceKey;
            if (!deviceKeyJwk)
                throw new MdocError_1.MdocError(`Device key is missing in mdoc with doctype ${document.docType}`);
            // Set keyId to legacy key id if it doesn't have a key id set
            if (!deviceKeyJwk.hasKeyId) {
                deviceKeyJwk.keyId = deviceKeyJwk.legacyKeyId;
            }
            const alg = _a.getAlgForDeviceKeyJwk(deviceKeyJwk);
            // We do PEX filtering on a different layer, so we only include the needed input descriptor here
            const presentationDefinitionForDocument = {
                ...presentationDefinition,
                input_descriptors: presentationDefinition.input_descriptors.filter((inputDescriptor) => inputDescriptor.id === document.docType),
            };
            const issuerSignedDocument = (0, mdoc_1.parseIssuerSigned)(utils_1.TypedArrayEncoder.fromBase64(document.base64Url), document.docType);
            const deviceResponseBuilder = mdoc_1.DeviceResponse.from(new mdoc_1.MDoc([issuerSignedDocument]))
                .usingPresentationDefinition(presentationDefinitionForDocument)
                // .usingSessionTranscriptForOID4VP(sessionTranscriptOptions)
                .authenticateWithSignature(deviceKeyJwk.toJson(), alg);
            for (const [nameSpace, nameSpaceValue] of Object.entries(options.deviceNameSpaces ?? {})) {
                deviceResponseBuilder.addDeviceNameSpace(nameSpace, nameSpaceValue);
            }
            _a.usingSessionTranscript(deviceResponseBuilder, options.sessionTranscriptOptions);
            const deviceResponseMdoc = await deviceResponseBuilder.sign((0, MdocContext_1.getMdocContext)(agentContext));
            combinedDeviceResponseMdoc.addDocument(deviceResponseMdoc.documents[0]);
        }
        return {
            deviceResponseBase64Url: utils_1.TypedArrayEncoder.toBase64URL(combinedDeviceResponseMdoc.encode()),
            presentationSubmission: _a.createPresentationSubmission({
                id: `MdocPresentationSubmission ${(0, uuid_1.uuid)()}`,
                presentationDefinition: {
                    ...presentationDefinition,
                    input_descriptors: presentationDefinition.input_descriptors.filter((i) => docTypes.includes(i.id)),
                },
            }),
        };
    }
    static async createDeviceResponse(agentContext, options) {
        const combinedDeviceResponseMdoc = new mdoc_1.MDoc();
        for (const document of options.mdocs) {
            const deviceKeyJwk = document.deviceKey;
            if (!deviceKeyJwk)
                throw new MdocError_1.MdocError(`Device key is missing in mdoc with doctype ${document.docType}`);
            const alg = _a.getAlgForDeviceKeyJwk(deviceKeyJwk);
            // Set keyId to legacy key id if it doesn't have a key id set
            if (!deviceKeyJwk.hasKeyId) {
                deviceKeyJwk.keyId = deviceKeyJwk.legacyKeyId;
            }
            const issuerSignedDocument = (0, mdoc_1.parseIssuerSigned)(utils_1.TypedArrayEncoder.fromBase64(document.base64Url), document.docType);
            const deviceRequestForDocument = mdoc_1.DeviceRequest.from('1.0', options.documentRequests
                .filter((request) => request.docType === issuerSignedDocument.docType)
                .map((request) => ({
                itemsRequestData: {
                    docType: request.docType,
                    nameSpaces: (0, mdocUtil_1.nameSpacesRecordToMap)(request.nameSpaces),
                },
            })));
            const deviceResponseBuilder = mdoc_1.DeviceResponse.from(new mdoc_1.MDoc([issuerSignedDocument]))
                .authenticateWithSignature(deviceKeyJwk.toJson(), alg)
                .usingDeviceRequest(deviceRequestForDocument);
            _a.usingSessionTranscript(deviceResponseBuilder, options.sessionTranscriptOptions);
            for (const [nameSpace, nameSpaceValue] of Object.entries(options.deviceNameSpaces ?? {})) {
                deviceResponseBuilder.addDeviceNameSpace(nameSpace, nameSpaceValue);
            }
            const deviceResponseMdoc = await deviceResponseBuilder.sign((0, MdocContext_1.getMdocContext)(agentContext));
            combinedDeviceResponseMdoc.addDocument(deviceResponseMdoc.documents[0]);
        }
        return combinedDeviceResponseMdoc.encode();
    }
    async verify(agentContext, options) {
        const verifier = new mdoc_1.Verifier();
        const mdocContext = (0, MdocContext_1.getMdocContext)(agentContext);
        (0, mdoc_1.defaultCallback)({
            status: this.documents.length > 0 ? 'PASSED' : 'FAILED',
            check: 'Device Response must include at least one document.',
            category: 'DOCUMENT_FORMAT',
        });
        const deviceResponse = (0, mdoc_1.parseDeviceResponse)(utils_1.TypedArrayEncoder.fromBase64(this.base64Url));
        // NOTE: we do not use the verification from mdoc library, as it checks all documents
        // based on the same trusted certificates
        for (const documentIndex in this.documents) {
            const rawDocument = deviceResponse.documents[documentIndex];
            const document = this.documents[documentIndex];
            const verificationResult = await document.verify(agentContext, {
                now: options.now,
                trustedCertificates: options.trustedCertificates,
            });
            if (!verificationResult.isValid) {
                throw new MdocError_1.MdocError(`Mdoc at index ${documentIndex} is not valid. ${verificationResult.error}`);
            }
            if (!(rawDocument instanceof mdoc_1.DeviceSignedDocument)) {
                (0, mdoc_1.defaultCallback)({
                    status: 'FAILED',
                    category: 'DEVICE_AUTH',
                    check: `The document is not signed by the device. ${document.docType}`,
                });
                continue;
            }
            await verifier.verifyDeviceSignature({
                sessionTranscriptBytes: await _a.getSessionTranscriptBytesForOptions(mdocContext, options.sessionTranscriptOptions),
                deviceSigned: rawDocument,
            }, mdocContext);
        }
        if (deviceResponse.documentErrors.length > 1) {
            throw new MdocError_1.MdocError('Device response verification failed.');
        }
        if (deviceResponse.status !== mdoc_1.MDocStatus.OK) {
            throw new MdocError_1.MdocError('Device response verification failed. An unknown error occurred.');
        }
        return this.documents;
    }
    static async getSessionTranscriptBytesForOptions(context, options) {
        if (options.type === 'sesionTranscriptBytes') {
            return options.sessionTranscriptBytes;
        }
        if (options.type === 'openId4Vp') {
            return await mdoc_1.DeviceResponse.calculateSessionTranscriptBytesForOID4VP({
                ...options,
                context,
            });
        }
        if (options.type === 'openId4VpDcApi') {
            return await mdoc_1.DeviceResponse.calculateSessionTranscriptBytesForOID4VPDCApi({
                ...options,
                context,
            });
        }
        throw new MdocError_1.MdocError('Unsupported session transcript option');
    }
    static usingSessionTranscript(deviceResponse, options) {
        if (options.type === 'sesionTranscriptBytes') {
            return deviceResponse.usingSessionTranscriptBytes(options.sessionTranscriptBytes);
        }
        if (options.type === 'openId4Vp') {
            return deviceResponse.usingSessionTranscriptForOID4VP(options);
        }
        if (options.type === 'openId4VpDcApi') {
            return deviceResponse.usingSessionTranscriptForForOID4VPDCApi(options);
        }
        throw new MdocError_1.MdocError('Unsupported session transcript option');
    }
    static getAlgForDeviceKeyJwk(jwk) {
        const signatureAlgorithm = jwk.supportedSignatureAlgorithms.find(mdocSupportedAlgs_1.isMdocSupportedSignatureAlgorithm);
        if (!signatureAlgorithm) {
            throw new MdocError_1.MdocError(`Unable to create mdoc device response. No supported signature algorithm found to sign device response for jwk  ${jwk.jwkTypehumanDescription}. Key supports algs ${jwk.supportedSignatureAlgorithms.join(', ')}. mdoc supports algs ${mdocSupportedAlgs_1.mdocSupporteSignatureAlgorithms.join(', ')}`);
        }
        return signatureAlgorithm;
    }
}
exports.MdocDeviceResponse = MdocDeviceResponse;
_a = MdocDeviceResponse;
MdocDeviceResponse.partitionPresentationDefinition = (pd) => {
    const nonMdocPresentationDefinition = {
        ...pd,
        input_descriptors: pd.input_descriptors.filter((id) => !Object.keys(id.format ?? {}).includes('mso_mdoc')),
    };
    const mdocPresentationDefinition = {
        ...pd,
        format: { mso_mdoc: pd.format?.mso_mdoc },
        input_descriptors: pd.input_descriptors
            .filter((id) => Object.keys(id.format ?? {}).includes('mso_mdoc'))
            .map(_a.assertMdocInputDescriptor),
    };
    return { mdocPresentationDefinition, nonMdocPresentationDefinition };
};
//# sourceMappingURL=MdocDeviceResponse.js.map