import { CredoError } from '@credo-ts/core';
export declare class AskarError extends CredoError {
    constructor(message: string, { cause }?: {
        cause?: Error;
    });
}
