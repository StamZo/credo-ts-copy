"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAskarSqliteStorageConfig = isAskarSqliteStorageConfig;
exports.isAskarPostgresStorageConfig = isAskarPostgresStorageConfig;
function isAskarSqliteStorageConfig(config) {
    return config?.type === 'sqlite';
}
function isAskarPostgresStorageConfig(config) {
    return config?.type === 'postgres';
}
//# sourceMappingURL=AskarStorageConfig.js.map