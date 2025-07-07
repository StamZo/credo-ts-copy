import type { AskarModuleConfigStoreOptions } from '../AskarModuleConfig';
import { StoreKeyMethod } from '@openwallet-foundation/askar-shared';
/**
 * Creates an askar wallet URI value based on store config
 * @param credoDataPath framework data path (used in case walletConfig.storage.path is undefined)
 * @returns string containing the askar wallet URI
 */
export declare const uriFromStoreConfig: (storeConfig: AskarModuleConfigStoreOptions, credoDataPath: string) => {
    uri: string;
    path?: string;
};
export declare function keyDerivationMethodFromStoreConfig(keyDerivationMethod?: AskarModuleConfigStoreOptions['keyDerivationMethod']): StoreKeyMethod;
export declare function isSqliteInMemoryUri(uri: string): boolean;
export declare function isSqliteFileUri(uri: string): boolean;
export declare function isPostgresUri(uri: string): boolean;
