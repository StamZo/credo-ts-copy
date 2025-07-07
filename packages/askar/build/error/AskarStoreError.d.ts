import { CredoError } from '@credo-ts/core';
export declare class AskarStoreError extends CredoError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
