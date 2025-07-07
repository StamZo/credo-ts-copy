import { KeyManagementError } from './KeyManagementError';
export declare class KeyManagementKeyExistsError extends KeyManagementError {
    constructor(keyId: string, backend: string);
}
