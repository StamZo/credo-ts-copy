import { AskarStoreError } from './AskarStoreError';
export declare class AskarStoreImportPathExistsError extends AskarStoreError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
