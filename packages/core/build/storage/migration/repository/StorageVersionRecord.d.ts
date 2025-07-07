import type { VersionString } from '../../../utils/version';
import { BaseRecord } from '../../BaseRecord';
export interface StorageVersionRecordProps {
    createdAt?: Date;
    storageVersion: VersionString;
}
export declare class StorageVersionRecord extends BaseRecord {
    storageVersion: VersionString;
    static readonly type = "StorageVersionRecord";
    readonly type = "StorageVersionRecord";
    constructor(props: StorageVersionRecordProps);
    getTags(): import("../../BaseRecord").TagsBase;
    static get frameworkStorageVersion(): "0.5";
    static get storageVersionRecordId(): string;
}
