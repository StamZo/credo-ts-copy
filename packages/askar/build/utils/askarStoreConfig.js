"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uriFromStoreConfig = void 0;
exports.keyDerivationMethodFromStoreConfig = keyDerivationMethodFromStoreConfig;
exports.isSqliteInMemoryUri = isSqliteInMemoryUri;
exports.isSqliteFileUri = isSqliteFileUri;
exports.isPostgresUri = isPostgresUri;
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const AskarStorageConfig_1 = require("../AskarStorageConfig");
const error_1 = require("../error");
/**
 * Creates an askar wallet URI value based on store config
 * @param credoDataPath framework data path (used in case walletConfig.storage.path is undefined)
 * @returns string containing the askar wallet URI
 */
const uriFromStoreConfig = (storeConfig, credoDataPath) => {
    let uri = '';
    let path;
    const urlParams = [];
    const database = storeConfig.database ?? { type: 'sqlite' };
    if ((0, AskarStorageConfig_1.isAskarSqliteStorageConfig)(database)) {
        if (database.config?.inMemory) {
            uri = 'sqlite://:memory:';
        }
        else {
            path = database.config?.path ?? `${credoDataPath}/wallet/${storeConfig.id}/sqlite.db`;
            uri = `sqlite://${path}`;
        }
    }
    else if ((0, AskarStorageConfig_1.isAskarPostgresStorageConfig)(database)) {
        if (!database.config || !database.credentials) {
            throw new error_1.AskarError('Invalid storage configuration for postgres wallet');
        }
        if (database.config.connectTimeout !== undefined) {
            urlParams.push(`connect_timeout=${encodeURIComponent(database.config.connectTimeout)}`);
        }
        if (database.config.idleTimeout !== undefined) {
            urlParams.push(`idle_timeout=${encodeURIComponent(database.config.idleTimeout)}`);
        }
        if (database.credentials.adminAccount !== undefined) {
            urlParams.push(`admin_account=${encodeURIComponent(database.credentials.adminAccount)}`);
        }
        if (database.credentials.adminPassword !== undefined) {
            urlParams.push(`admin_password=${encodeURIComponent(database.credentials.adminPassword)}`);
        }
        uri = `postgres://${encodeURIComponent(database.credentials.account)}:${encodeURIComponent(database.credentials.password)}@${database.config.host}/${encodeURIComponent(storeConfig.id)}`;
    }
    else {
        // @ts-expect-error
        throw new WalletError(`Storage type not supported: ${database.type}`);
    }
    // Common config options
    if (database.config?.maxConnections !== undefined) {
        urlParams.push(`max_connections=${encodeURIComponent(database.config.maxConnections)}`);
    }
    if (database.config?.minConnections !== undefined) {
        urlParams.push(`min_connections=${encodeURIComponent(database.config.minConnections)}`);
    }
    if (urlParams.length > 0) {
        uri = `${uri}?${urlParams.join('&')}`;
    }
    return { uri, path };
};
exports.uriFromStoreConfig = uriFromStoreConfig;
function keyDerivationMethodFromStoreConfig(keyDerivationMethod) {
    return new askar_shared_1.StoreKeyMethod((keyDerivationMethod ?? askar_shared_1.KdfMethod.Argon2IMod));
}
function isSqliteInMemoryUri(uri) {
    return uri.startsWith('sqlite://:memory:');
}
function isSqliteFileUri(uri) {
    return uri.startsWith('sqlite://') && !isSqliteInMemoryUri(uri);
}
function isPostgresUri(uri) {
    return uri.startsWith('postgres://');
}
//# sourceMappingURL=askarStoreConfig.js.map