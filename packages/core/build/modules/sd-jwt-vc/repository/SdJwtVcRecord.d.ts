import type { TagsBase } from '../../../storage/BaseRecord';
import type { SdJwtVc } from '../SdJwtVcService';
import type { SdJwtVcTypeMetadata } from '../typeMetadata';
import { BaseRecord } from '../../../storage/BaseRecord';
import { KnownJwaSignatureAlgorithm } from '../../kms';
export type DefaultSdJwtVcRecordTags = {
    vct: string;
    /**
     * The sdAlg is the alg used for creating digests for selective disclosures
     */
    sdAlg: string;
    /**
     * The alg is the alg used to sign the SD-JWT
     */
    alg: KnownJwaSignatureAlgorithm;
};
export type SdJwtVcRecordStorageProps = {
    id?: string;
    createdAt?: Date;
    tags?: TagsBase;
    compactSdJwtVc: string;
    typeMetadata?: SdJwtVcTypeMetadata;
};
export declare class SdJwtVcRecord extends BaseRecord<DefaultSdJwtVcRecordTags> {
    static readonly type = "SdJwtVcRecord";
    readonly type = "SdJwtVcRecord";
    compactSdJwtVc: string;
    typeMetadata?: SdJwtVcTypeMetadata;
    constructor(props: SdJwtVcRecordStorageProps);
    get sdJwtVc(): SdJwtVc;
    getTags(): {
        vct: string;
        sdAlg: string;
        alg: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | "ES256K";
    };
    clone(): this;
    /**
     * credential is convenience method added to all credential records
     */
    get credential(): SdJwtVc;
    /**
     * encoded is convenience method added to all credential records
     */
    get encoded(): string;
}
