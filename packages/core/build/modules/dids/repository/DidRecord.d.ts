import type { TagsBase } from '../../../storage/BaseRecord';
import type { DidRecordMetadata } from './didRecordMetadataTypes';
import { BaseRecord } from '../../../storage/BaseRecord';
import { DidDocument } from '../domain';
import { DidDocumentRole } from '../domain/DidDocumentRole';
import { DidDocumentKey } from '../DidsApiOptions';
export interface DidRecordProps {
    id?: string;
    did: string;
    role: DidDocumentRole;
    didDocument?: DidDocument;
    createdAt?: Date;
    tags?: CustomDidTags;
    /**
     * The kms key ids associated with the did record. Should only be used
     * when role is {@link DidDocumentRole.Created}
     */
    keys?: DidDocumentKey[];
}
export interface CustomDidTags extends TagsBase {
    recipientKeyFingerprints?: string[];
    alternativeDids?: string[];
}
type DefaultDidTags = {
    recipientKeyFingerprints?: string[];
    role: DidDocumentRole;
    method: string;
    legacyUnqualifiedDid?: string;
    methodSpecificIdentifier: string;
    did: string;
};
export declare class DidRecord extends BaseRecord<DefaultDidTags, CustomDidTags, DidRecordMetadata> implements DidRecordProps {
    didDocument?: DidDocument;
    did: string;
    role: DidDocumentRole;
    static readonly type = "DidRecord";
    readonly type = "DidRecord";
    /**
     * The kms key ids associated with the DidRecord. Should only be used
     * when role is {@link DidDocumentRole.Created}.
     */
    keys?: DidDocumentKey[];
    constructor(props: DidRecordProps);
    getTags(): {
        role: DidDocumentRole;
        method: string;
        legacyUnqualifiedDid: string | undefined;
        did: string;
        methodSpecificIdentifier: string;
        recipientKeyFingerprints: string[] | undefined;
        alternativeDids?: string[];
    };
}
export {};
