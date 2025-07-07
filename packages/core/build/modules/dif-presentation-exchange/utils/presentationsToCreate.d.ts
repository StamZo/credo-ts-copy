import type { DifPexInputDescriptorToCredentials } from '../models';
import { JsonObject } from '../../../types';
import { MdocRecord } from '../../mdoc';
import { SdJwtVcRecord } from '../../sd-jwt-vc';
import { ClaimFormat, W3cCredentialRecord } from '../../vc';
export interface SdJwtVcPresentationToCreate {
    claimFormat: ClaimFormat.SdJwtVc;
    subjectIds: [];
    verifiableCredentials: [
        {
            credential: SdJwtVcRecord;
            inputDescriptorId: string;
            /**
             * Additional payload to include in the Key Binding JWT
             */
            additionalPayload?: JsonObject;
        }
    ];
}
export interface JwtVpPresentationToCreate {
    claimFormat: ClaimFormat.JwtVp;
    subjectIds: [string];
    verifiableCredentials: Array<{
        credential: W3cCredentialRecord;
        inputDescriptorId: string;
    }>;
}
export interface LdpVpPresentationToCreate {
    claimFormat: ClaimFormat.LdpVp;
    subjectIds: undefined | [string];
    verifiableCredentials: Array<{
        credential: W3cCredentialRecord;
        inputDescriptorId: string;
    }>;
}
export interface MdocPresentationToCreate {
    claimFormat: ClaimFormat.MsoMdoc;
    subjectIds: [];
    verifiableCredentials: [
        {
            credential: MdocRecord;
            inputDescriptorId: string;
        }
    ];
}
export type PresentationToCreate = SdJwtVcPresentationToCreate | JwtVpPresentationToCreate | LdpVpPresentationToCreate | MdocPresentationToCreate;
export declare function getPresentationsToCreate(credentialsForInputDescriptor: DifPexInputDescriptorToCredentials): PresentationToCreate[];
