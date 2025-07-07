import type { KeyManagementService } from './KeyManagementService';
export interface KeyManagementModuleConfigOptions {
    /**
     * The backends to use for key management and cryptographic operations.
     */
    backends?: KeyManagementService[];
    /**
     * The default backend to use, indicated by the `backend` property
     * on the `KeyManagementService` instance.
     *
     * If provided and it doesn't match an entry in the `backends` array
     * an error will be thrown.
     *
     * If not provided, the first backend from the `backends` array will be used.
     */
    defaultBackend?: string;
}
export declare class KeyManagementModuleConfig {
    #private;
    constructor(options: KeyManagementModuleConfigOptions);
    get backends(): KeyManagementService[];
    registerBackend(backend: KeyManagementService): void;
    get defaultBackend(): KeyManagementService;
    private toJSON;
}
