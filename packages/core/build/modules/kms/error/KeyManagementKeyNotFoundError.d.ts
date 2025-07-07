import { KeyManagementError } from './KeyManagementError';
export declare class KeyManagementKeyNotFoundError extends KeyManagementError {
    constructor(keyId: string, backend: string);
}
