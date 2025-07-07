export interface AskarPostgresConfig {
    host: string;
    connectTimeout?: number;
    idleTimeout?: number;
    maxConnections?: number;
    minConnections?: number;
}
export interface AskarSqliteConfig {
    maxConnections?: number;
    minConnections?: number;
    inMemory?: boolean;
    path?: string;
}
export interface AskarPostgresCredentials {
    account: string;
    password: string;
    adminAccount?: string;
    adminPassword?: string;
}
export interface AskarPostgresStorageConfig {
    type: 'postgres';
    config: AskarPostgresConfig;
    credentials: AskarPostgresCredentials;
}
export interface AskarSqliteStorageConfig {
    type: 'sqlite';
    config?: AskarSqliteConfig;
}
export type AskarStorageConfig = AskarPostgresStorageConfig | AskarSqliteStorageConfig;
export declare function isAskarSqliteStorageConfig(config?: AskarStorageConfig): config is AskarSqliteStorageConfig;
export declare function isAskarPostgresStorageConfig(config?: AskarStorageConfig): config is AskarPostgresStorageConfig;
