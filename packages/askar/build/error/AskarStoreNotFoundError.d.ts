import { AskarStoreError } from './AskarStoreError';
export declare class AskarStoreNotFoundError extends AskarStoreError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
