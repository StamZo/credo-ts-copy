import { AskarStoreError } from './AskarStoreError';
export declare class AskarStoreDuplicateError extends AskarStoreError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
