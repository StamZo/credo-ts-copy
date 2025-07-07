"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DcqlService = void 0;
const dcql_1 = require("dcql");
const tsyringe_1 = require("tsyringe");
const utils_1 = require("../../utils");
const mdoc_1 = require("../mdoc");
const sd_jwt_vc_1 = require("../sd-jwt-vc");
const disclosureFrame_1 = require("../sd-jwt-vc/disclosureFrame");
const vc_1 = require("../vc");
const DcqlError_1 = require("./DcqlError");
const utils_2 = require("./utils");
let DcqlService = class DcqlService {
    /**
     * Queries the wallet for credentials that match the given dcql query. This only does an initial query based on the
     * schema of the input descriptors. It does not do any further filtering based on the constraints in the input descriptors.
     */
    async queryCredentialsForDcqlQuery(agentContext, dcqlQuery) {
        const w3cCredentialRepository = agentContext.dependencyManager.resolve(vc_1.W3cCredentialRepository);
        const formats = new Set(dcqlQuery.credentials.map((c) => c.format));
        const allRecords = [];
        const w3cCredentialRecords = formats.has('jwt_vc_json') || formats.has('ldp_vc') ? await w3cCredentialRepository.getAll(agentContext) : [];
        allRecords.push(...w3cCredentialRecords);
        const mdocDoctypes = dcqlQuery.credentials
            .filter((credentialQuery) => credentialQuery.format === 'mso_mdoc')
            .map((c) => c.meta?.doctype_value);
        const mdocApi = this.getMdocApi(agentContext);
        if (mdocDoctypes.every((doctype) => doctype !== undefined)) {
            const mdocRecords = await mdocApi.findAllByQuery({
                $or: mdocDoctypes.map((docType) => ({
                    docType: docType,
                })),
            });
            allRecords.push(...mdocRecords);
        }
        else {
            const mdocRecords = await mdocApi.getAll();
            allRecords.push(...mdocRecords);
        }
        const sdJwtVctValues = dcqlQuery.credentials
            .filter((credentialQuery) => credentialQuery.format === 'vc+sd-jwt' || credentialQuery.format === 'dc+sd-jwt')
            .flatMap((c) => c.meta?.vct_values);
        const sdJwtVcApi = this.getSdJwtVcApi(agentContext);
        if (sdJwtVctValues.every((vct) => vct !== undefined)) {
            const sdjwtVcRecords = await sdJwtVcApi.findAllByQuery({
                $or: sdJwtVctValues.map((vct) => ({
                    vct: vct,
                })),
            });
            allRecords.push(...sdjwtVcRecords);
        }
        else {
            const sdJwtVcRecords = await sdJwtVcApi.getAll();
            allRecords.push(...sdJwtVcRecords);
        }
        return allRecords;
    }
    getDcqlCredentialRepresentation(presentation, queryCredential) {
        // SD-JWT credential can be used as both dc+sd-jwt and vc+sd-jwt
        // At some point we might want to look at the header value of the sd-jwt (vc+sd-jwt vc dc+sd-jwt)
        if (presentation.claimFormat === vc_1.ClaimFormat.SdJwtVc) {
            return {
                credential_format: queryCredential.format === 'dc+sd-jwt' ? 'dc+sd-jwt' : 'vc+sd-jwt',
                vct: presentation.prettyClaims.vct,
                claims: presentation.prettyClaims,
            };
        }
        if (presentation.claimFormat === vc_1.ClaimFormat.MsoMdoc) {
            if (presentation.documents.length !== 1) {
                throw new DcqlError_1.DcqlError('MDOC presentations must contain exactly one document');
            }
            return {
                credential_format: 'mso_mdoc',
                doctype: presentation.documents[0].docType,
                namespaces: presentation.documents[0].issuerSignedNamespaces,
            };
        }
        throw new DcqlError_1.DcqlError('W3C credentials are not supported yet');
    }
    async getCredentialsForRequest(agentContext, dcqlQuery) {
        const credentialRecords = await this.queryCredentialsForDcqlQuery(agentContext, dcqlQuery);
        const credentialRecordsWithFormatDuplicates = [];
        const dcqlCredentials = credentialRecords.flatMap((record) => {
            if (record.type === 'MdocRecord') {
                credentialRecordsWithFormatDuplicates.push(record);
                const mdoc = mdoc_1.Mdoc.fromBase64Url(record.base64Url);
                return {
                    credential_format: 'mso_mdoc',
                    doctype: record.getTags().docType,
                    namespaces: mdoc.issuerSignedNamespaces,
                };
            }
            if (record.type === 'SdJwtVcRecord') {
                const claims = this.getSdJwtVcApi(agentContext).fromCompact(record.compactSdJwtVc)
                    .prettyClaims;
                // To keep correct mapping of input credential index, we add it twice here (for dc+sd-jwt and vc+sd-jwt)
                credentialRecordsWithFormatDuplicates.push(record, record);
                return [
                    {
                        credential_format: 'dc+sd-jwt',
                        vct: record.getTags().vct,
                        claims,
                    },
                    {
                        credential_format: 'vc+sd-jwt',
                        vct: record.getTags().vct,
                        claims,
                    },
                ];
            }
            // TODO:
            throw new DcqlError_1.DcqlError('W3C credentials are not supported yet');
        });
        const queryResult = dcql_1.DcqlQuery.query(dcql_1.DcqlQuery.parse(dcqlQuery), dcqlCredentials);
        const matchesWithRecord = Object.fromEntries(Object.entries(queryResult.credential_matches).map(([credential_query_id, result]) => {
            const all = result.all.map((entry) => entry.map((inner) => {
                if (!inner || !inner.success)
                    return inner;
                const record = credentialRecordsWithFormatDuplicates[inner.input_credential_index];
                return {
                    ...inner,
                    output: record.type === 'SdJwtVcRecord' &&
                        (inner.output.credential_format === 'dc+sd-jwt' || inner.output.credential_format === 'vc+sd-jwt')
                        ? {
                            ...inner.output,
                            claims: agentContext.dependencyManager
                                .resolve(sd_jwt_vc_1.SdJwtVcService)
                                .applyDisclosuresForPayload(record.compactSdJwtVc, inner.output.claims).prettyClaims,
                        }
                        : inner.output,
                    record: credentialRecordsWithFormatDuplicates[inner.input_credential_index],
                };
            }));
            if (result.success) {
                if (result.output.credential_format === 'vc+sd-jwt' || result.output.credential_format === 'dc+sd-jwt') {
                    const sdJwtVcRecord = credentialRecordsWithFormatDuplicates[result.input_credential_index];
                    const claims = agentContext.dependencyManager
                        .resolve(sd_jwt_vc_1.SdJwtVcService)
                        .applyDisclosuresForPayload(sdJwtVcRecord.compactSdJwtVc, result.output.claims).prettyClaims;
                    return [
                        credential_query_id,
                        {
                            ...result,
                            all,
                            output: { ...result.output, claims },
                            record: credentialRecordsWithFormatDuplicates[result.input_credential_index],
                        },
                    ];
                }
                return [
                    credential_query_id,
                    { ...result, record: credentialRecordsWithFormatDuplicates[result.input_credential_index], all },
                ];
            }
            return [credential_query_id, { ...result, all }];
        }));
        return {
            ...queryResult,
            credential_matches: matchesWithRecord,
        };
    }
    assertValidDcqlPresentation(dcqlPresentation, dcqlQuery) {
        const internalDcqlPresentation = Object.fromEntries(Object.entries(dcqlPresentation).map(([credentialId, value]) => {
            const queryCredential = dcqlQuery.credentials.find((c) => c.id === credentialId);
            if (!queryCredential) {
                throw new DcqlError_1.DcqlError(`DCQL presentation contains presentation entry for credential id '${credentialId}', but this id is not present in the DCQL query`);
            }
            return [credentialId, this.getDcqlCredentialRepresentation(value, queryCredential)];
        }));
        const presentationResult = dcql_1.DcqlPresentationResult.fromDcqlPresentation(internalDcqlPresentation, { dcqlQuery });
        if (!presentationResult.canBeSatisfied) {
            throw new DcqlError_1.DcqlError('Presentations do not satisfy the DCQL query.', {
                additionalMessages: Object.entries(presentationResult.invalid_matches ?? {}).map(([queryId, match]) => `query '${queryId}' does not match. ${
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                JSON.stringify(match.flattened?.nested, null, 2)}`),
            });
        }
        return presentationResult;
    }
    /**
     * Selects the credentials to use based on the output from `getCredentialsForRequest`
     * Use this method if you don't want to manually select the credentials yourself.
     */
    selectCredentialsForRequest(dcqlQueryResult) {
        if (!dcqlQueryResult.canBeSatisfied) {
            throw new DcqlError_1.DcqlError('Cannot select the credentials for the dcql query presentation if the request cannot be satisfied');
        }
        const credentials = {};
        if (dcqlQueryResult.credential_sets) {
            for (const credentialSet of dcqlQueryResult.credential_sets) {
                // undefined defaults to true
                if (credentialSet.required === false)
                    continue;
                const firstFullFillableOption = credentialSet.options.find((option) => option.every((credential_id) => dcqlQueryResult.credential_matches[credential_id].success));
                if (!firstFullFillableOption) {
                    throw new DcqlError_1.DcqlError('Invalid dcql query result. No option is fullfillable');
                }
                for (const credentialQueryId of firstFullFillableOption) {
                    const credential = dcqlQueryResult.credential_matches[credentialQueryId];
                    if (credential.success && credential.record.type === 'MdocRecord' && 'namespaces' in credential.output) {
                        credentials[credentialQueryId] = {
                            claimFormat: vc_1.ClaimFormat.MsoMdoc,
                            credentialRecord: credential.record,
                            disclosedPayload: credential.output.namespaces,
                        };
                    }
                    else if (credential.success &&
                        credential.record.type === 'SdJwtVcRecord' &&
                        'claims' in credential.output) {
                        credentials[credentialQueryId] = {
                            claimFormat: vc_1.ClaimFormat.SdJwtVc,
                            credentialRecord: credential.record,
                            disclosedPayload: credential.output.claims,
                        };
                    }
                    else {
                        throw new DcqlError_1.DcqlError('Invalid dcql query result. Cannot auto-select credentials');
                    }
                }
            }
        }
        else {
            for (const credentialQuery of dcqlQueryResult.credentials) {
                const credential = dcqlQueryResult.credential_matches[credentialQuery.id];
                if (credential.success && credential.record.type === 'MdocRecord' && 'namespaces' in credential.output) {
                    credentials[credentialQuery.id] = {
                        claimFormat: vc_1.ClaimFormat.MsoMdoc,
                        credentialRecord: credential.record,
                        disclosedPayload: credential.output.namespaces,
                    };
                }
                else if (credential.success && credential.record.type === 'SdJwtVcRecord' && 'claims' in credential.output) {
                    credentials[credentialQuery.id] = {
                        claimFormat: vc_1.ClaimFormat.SdJwtVc,
                        credentialRecord: credential.record,
                        disclosedPayload: credential.output.claims,
                    };
                }
                else {
                    throw new DcqlError_1.DcqlError('Invalid dcql query result. Cannot auto-select credentials');
                }
            }
        }
        return credentials;
    }
    validateDcqlQuery(dcqlQuery) {
        return dcql_1.DcqlQuery.parse(dcqlQuery);
    }
    async createPresentation(agentContext, options) {
        const { domain, challenge, openid4vp } = options;
        const dcqlPresentation = {};
        const encodedDcqlPresentation = {};
        const vcPresentationsToCreate = (0, utils_2.dcqlGetPresentationsToCreate)(options.credentialQueryToCredential);
        for (const [credentialQueryId, presentationToCreate] of Object.entries(vcPresentationsToCreate)) {
            if (presentationToCreate.claimFormat === vc_1.ClaimFormat.MsoMdoc) {
                const mdocRecord = presentationToCreate.credentialRecord;
                if (!openid4vp) {
                    throw new DcqlError_1.DcqlError('Missing openid4vp options for creating MDOC presentation.');
                }
                const deviceResponse = await mdoc_1.MdocDeviceResponse.createDeviceResponse(agentContext, {
                    mdocs: [mdoc_1.Mdoc.fromBase64Url(mdocRecord.base64Url)],
                    documentRequests: [
                        {
                            docType: mdocRecord.getTags().docType,
                            nameSpaces: Object.fromEntries(Object.entries(presentationToCreate.disclosedPayload).map(([key, value]) => {
                                // FIXME: we need the DCQL query here to get the intent_to_retain from query (currnetly hardcoded to false)
                                return [key, Object.fromEntries(Object.entries(value).map(([key]) => [key, false]))];
                            })),
                        },
                    ],
                    sessionTranscriptOptions: {
                        ...openid4vp,
                        verifierGeneratedNonce: challenge,
                    },
                });
                const deviceResponseBase64Url = utils_1.TypedArrayEncoder.toBase64URL(deviceResponse);
                encodedDcqlPresentation[credentialQueryId] = deviceResponseBase64Url;
                dcqlPresentation[credentialQueryId] = mdoc_1.MdocDeviceResponse.fromBase64Url(deviceResponseBase64Url);
            }
            else if (presentationToCreate.claimFormat === vc_1.ClaimFormat.SdJwtVc) {
                const presentationFrame = (0, disclosureFrame_1.buildDisclosureFrameForPayload)(presentationToCreate.disclosedPayload);
                if (!domain) {
                    throw new DcqlError_1.DcqlError('Missing domain property for creating SdJwtVc presentation.');
                }
                const sdJwtVcApi = this.getSdJwtVcApi(agentContext);
                const presentation = await sdJwtVcApi.present({
                    compactSdJwtVc: presentationToCreate.credentialRecord.compactSdJwtVc,
                    presentationFrame,
                    verifierMetadata: {
                        audience: domain,
                        nonce: challenge,
                        issuedAt: Math.floor(Date.now() / 1000),
                    },
                    additionalPayload: presentationToCreate.additionalPayload,
                });
                encodedDcqlPresentation[credentialQueryId] = presentation;
                dcqlPresentation[credentialQueryId] = sdJwtVcApi.fromCompact(presentation);
            }
            else {
                throw new DcqlError_1.DcqlError('W3c Presentation are not yet supported in combination with DCQL.');
            }
        }
        return {
            dcqlPresentation: dcqlPresentation,
            encodedDcqlPresentation: encodedDcqlPresentation,
        };
    }
    getEncodedPresentations(dcqlPresentation) {
        return Object.fromEntries(Object.entries(dcqlPresentation).map(([key, value]) => [key, value.encoded]));
    }
    getSdJwtVcApi(agentContext) {
        return agentContext.dependencyManager.resolve(sd_jwt_vc_1.SdJwtVcApi);
    }
    getMdocApi(agentContext) {
        return agentContext.dependencyManager.resolve(mdoc_1.MdocApi);
    }
};
exports.DcqlService = DcqlService;
exports.DcqlService = DcqlService = __decorate([
    (0, tsyringe_1.injectable)()
], DcqlService);
//# sourceMappingURL=DcqlService.js.map