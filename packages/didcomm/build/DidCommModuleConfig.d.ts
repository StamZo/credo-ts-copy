import { QueueTransportRepository } from './transport';
/**
 * MediatorModuleConfigOptions defines the interface for the options of the MediatorModuleConfig class.
 * This can contain optional parameters that have default values in the config class itself.
 */
export interface DidCommModuleConfigOptions {
    endpoints?: string[];
    useDidSovPrefixWhereAllowed?: boolean;
    connectionImageUrl?: string;
    processDidCommMessagesConcurrently?: boolean;
    didCommMimeType?: string;
    useDidKeyInProtocols?: boolean;
    queueTransportRepository?: QueueTransportRepository;
}
export declare class DidCommModuleConfig {
    private options;
    private _endpoints?;
    private _queueTransportRepository;
    constructor(options?: DidCommModuleConfigOptions);
    get endpoints(): [string, ...string[]];
    set endpoints(endpoints: string[]);
    get useDidSovPrefixWhereAllowed(): boolean;
    /**
     * @todo move to context configuration
     */
    get connectionImageUrl(): string | undefined;
    get processDidCommMessagesConcurrently(): boolean;
    get didCommMimeType(): string;
    /**
     * Encode keys in did:key format instead of 'naked' keys, as stated in Aries RFC 0360.
     *
     * This setting will not be taken into account if the other party has previously used naked keys
     * in a given protocol (i.e. it does not support Aries RFC 0360).
     */
    get useDidKeyInProtocols(): boolean;
    /**
     * Allows to specify a custom queue transport queue. It defaults to an in-memory queue
     *
     */
    get queueTransportRepository(): QueueTransportRepository;
}
