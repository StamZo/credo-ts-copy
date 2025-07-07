import type { TagsBase } from '../../../storage/BaseRecord';
import { BaseRecord } from '../../../storage/BaseRecord';
export interface SingleContextLruCacheItem {
    value: unknown;
    expiresAt?: number;
}
export interface SingleContextLruCacheProps {
    id?: string;
    createdAt?: Date;
    tags?: TagsBase;
    entries: Map<string, SingleContextLruCacheItem>;
}
export declare class SingleContextLruCacheRecord extends BaseRecord {
    entries: Map<string, SingleContextLruCacheItem>;
    static readonly type = "SingleContextLruCacheRecord";
    readonly type = "SingleContextLruCacheRecord";
    constructor(props: SingleContextLruCacheProps);
    getTags(): {
        [key: string]: import("../../../storage/BaseRecord").TagValue;
        [key: number]: never;
    };
}
