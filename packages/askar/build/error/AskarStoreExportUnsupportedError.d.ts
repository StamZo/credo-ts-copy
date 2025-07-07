import { AskarStoreError } from './AskarStoreError';
export declare class AskarStoreExportUnsupportedError extends AskarStoreError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
