import { type IPresentationDefinition, type PEX } from '@animo-id/pex';
import type { DifPexCredentialsForRequest } from '../models';
import { MdocRecord } from '../../mdoc';
import { SdJwtVcRecord } from '../../sd-jwt-vc';
import { W3cCredentialRecord } from '../../vc';
export declare function getCredentialsForRequest(pex: PEX, presentationDefinition: IPresentationDefinition, credentialRecords: Array<W3cCredentialRecord | SdJwtVcRecord | MdocRecord>): Promise<DifPexCredentialsForRequest>;
