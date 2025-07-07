import type { TagsBase } from '../../../storage/BaseRecord';
import { BaseRecord } from '../../../storage/BaseRecord';
import { KnownJwaSignatureAlgorithm } from '../../kms';
import { Mdoc } from '../Mdoc';
export type DefaultMdocRecordTags = {
    docType: string;
    /**
     *
     * The Jwa Signature Algorithm used to sign the Mdoc.
     */
    alg: KnownJwaSignatureAlgorithm;
};
export type MdocRecordStorageProps = {
    id?: string;
    createdAt?: Date;
    tags?: TagsBase;
    mdoc: Mdoc;
};
export declare class MdocRecord extends BaseRecord<DefaultMdocRecordTags> {
    static readonly type = "MdocRecord";
    readonly type = "MdocRecord";
    base64Url: string;
    constructor(props: MdocRecordStorageProps);
    getTags(): {
        docType: string;
        alg: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    };
    clone(): this;
    /**
     * credential is convenience method added to all credential records
     */
    get credential(): Mdoc;
    /**
     * encoded is convenience method added to all credential records
     */
    get encoded(): string;
}
