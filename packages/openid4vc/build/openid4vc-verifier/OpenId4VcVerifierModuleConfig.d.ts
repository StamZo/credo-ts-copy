import type { Router } from 'express';
export interface OpenId4VcVerifierModuleConfigOptions {
    /**
     * Base url at which the verifier endpoints will be hosted. All endpoints will be exposed with
     * this path as prefix.
     */
    baseUrl: string;
    /**
     * Express router on which the verifier endpoints will be registered. If
     * no router is provided, a new one will be created.
     *
     * NOTE: you must manually register the router on your express app and
     * expose this on a public url that is reachable when `baseUrl` is called.
     */
    router?: Router;
    /**
     * The number of seconds after which a created authorization request will expire.
     *
     * This is used for the `exp` field of a signed authorization request.
     *
     * @default 300
     */
    authorizationRequestExpirationInSeconds?: number;
    endpoints?: {
        /**
         * @default /authorize
         */
        authorization?: string;
        /**
         * @default /authorization-requests
         */
        authorizationRequest?: string;
    };
}
export declare class OpenId4VcVerifierModuleConfig {
    private options;
    readonly router: Router;
    constructor(options: OpenId4VcVerifierModuleConfigOptions);
    get baseUrl(): string;
    /**
     * @default /authorize
     */
    get authorizationRequestEndpoint(): string;
    /**
     * @default /authorize
     */
    get authorizationEndpoint(): string;
    /**
     * Time in seconds after which an authorization request will expire
     *
     * @default 300
     */
    get authorizationRequestExpiresInSeconds(): number;
}
