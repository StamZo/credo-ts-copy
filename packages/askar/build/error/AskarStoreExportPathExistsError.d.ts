import { AskarStoreError } from './AskarStoreError';
export declare class AskarStoreExportPathExistsError extends AskarStoreError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
