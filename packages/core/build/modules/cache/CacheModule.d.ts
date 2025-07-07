import type { DependencyManager, Module } from '../../plugins';
import type { CacheModuleConfigOptions } from './CacheModuleConfig';
import { CacheModuleConfig } from './CacheModuleConfig';
export type CacheModuleOptions = CacheModuleConfigOptions;
export declare class CacheModule implements Module {
    readonly config: CacheModuleConfig;
    constructor(config: CacheModuleOptions);
    register(dependencyManager: DependencyManager): void;
}
