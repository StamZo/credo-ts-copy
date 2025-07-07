import type { TagsBase } from '@credo-ts/core';
import { BaseRecord, Kms } from '@credo-ts/core';
export interface MediatorRoutingRecordProps {
    id?: string;
    createdAt?: Date;
    routingKeys?: MediatorRoutingRecordRoutingKey[];
    tags?: TagsBase;
}
export interface MediatorRoutingRecordRoutingKey {
    /**
     * The routing key fingerprint
     */
    routingKeyFingerprint: string;
    /**
     * The key id in the KMS
     */
    kmsKeyId: string;
}
export type DefaultMediatorRoutingRecordTags = {
    routingKeyFingerprints: string[];
};
export declare class MediatorRoutingRecord extends BaseRecord<DefaultMediatorRoutingRecordTags> {
    routingKeys: Array<string | MediatorRoutingRecordRoutingKey>;
    static readonly type = "MediatorRoutingRecord";
    readonly type = "MediatorRoutingRecord";
    static readonly allowCache = true;
    readonly allowCache = true;
    constructor(props: MediatorRoutingRecordProps);
    get routingKeysWithKeyId(): Kms.PublicJwk<Kms.Ed25519PublicJwk>[];
    getTags(): {
        routingKeyFingerprints: string[];
    };
}
