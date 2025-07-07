import { KeyManagementError } from './KeyManagementError';
export declare class KeyManagementAlgorithmNotSupportedError extends KeyManagementError {
    backend: string;
    constructor(notSupported: string, backend: string);
}
