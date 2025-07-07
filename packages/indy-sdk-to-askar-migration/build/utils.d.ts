import type { TagsBase } from '@credo-ts/core';
/**
 * Adopted from `AskarStorageService` implementation and should be kept in sync.
 */
export declare const transformFromRecordTagValues: (tags: TagsBase) => {
    [key: string]: string | undefined;
};
