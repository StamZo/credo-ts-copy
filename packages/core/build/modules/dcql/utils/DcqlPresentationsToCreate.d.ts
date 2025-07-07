import type { DcqlMdocCredential, DcqlSdJwtVcCredential, DcqlW3cVcCredential } from 'dcql';
import { JsonObject } from '../../../types';
import { MdocRecord } from '../../mdoc';
import { SdJwtVcRecord } from '../../sd-jwt-vc';
import { ClaimFormat, W3cCredentialRecord } from '../../vc';
import type { DcqlCredentialsForRequest } from '../models';
export interface DcqlSdJwtVcPresentationToCreate {
    claimFormat: ClaimFormat.SdJwtVc;
    subjectIds: [];
    credentialRecord: SdJwtVcRecord;
    disclosedPayload: DcqlSdJwtVcCredential.Claims;
    /**
     * Additional payload to include in the Key Binding JWT
     */
    additionalPayload?: JsonObject;
}
export interface DcqlJwtVpPresentationToCreate {
    claimFormat: ClaimFormat.JwtVp;
    subjectIds: [string];
    credentialRecord: W3cCredentialRecord;
    disclosedPayload: DcqlW3cVcCredential.Claims;
}
export interface DcqlLdpVpPresentationToCreate {
    claimFormat: ClaimFormat.LdpVp;
    subjectIds: undefined | [string];
    credentialRecord: W3cCredentialRecord;
    disclosedPayload: DcqlW3cVcCredential.Claims;
}
export interface DcqlMdocPresentationToCreate {
    claimFormat: ClaimFormat.MsoMdoc;
    subjectIds: [];
    credentialRecord: MdocRecord;
    disclosedPayload: DcqlMdocCredential.NameSpaces;
}
export type DcqlPresentationToCreate = Record<string, DcqlSdJwtVcPresentationToCreate | DcqlJwtVpPresentationToCreate | DcqlLdpVpPresentationToCreate | DcqlMdocPresentationToCreate>;
export declare function dcqlGetPresentationsToCreate(credentialsForInputDescriptor: DcqlCredentialsForRequest): DcqlPresentationToCreate;
