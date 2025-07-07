import type { DependencyManager, Module } from '../../plugins';
import type { KeyManagementModuleConfigOptions } from './KeyManagementModuleConfig';
import { KeyManagementApi } from './KeyManagementApi';
import { KeyManagementModuleConfig } from './KeyManagementModuleConfig';
export declare class KeyManagementModule implements Module {
    readonly api: typeof KeyManagementApi;
    readonly config: KeyManagementModuleConfig;
    constructor(config: KeyManagementModuleConfigOptions);
    /**
     * Registers the dependencies of the key management module.
     */
    register(dependencyManager: DependencyManager): void;
}
