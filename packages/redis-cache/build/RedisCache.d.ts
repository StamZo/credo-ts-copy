import { AgentContext, Cache } from '@credo-ts/core';
import { RedisOptions } from 'ioredis';
export type RedisCacheOptions = RedisOptions;
export declare class RedisCache implements Cache {
    private readonly _client;
    constructor(options?: RedisCacheOptions);
    private client;
    private getNamespacedKey;
    private serialize;
    private deserialize;
    private getDefaultExpiryInSeconds;
    get<CacheValue>(agentContext: AgentContext, key: string): Promise<CacheValue | null>;
    set<CacheValue>(agentContext: AgentContext, key: string, value: CacheValue, expiresInSeconds?: number | undefined): Promise<void>;
    remove(agentContext: AgentContext, key: string): Promise<void>;
    destroy(agentContext: AgentContext): Promise<void>;
    disconnect(): Promise<void>;
}
