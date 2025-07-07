"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const core_1 = require("@credo-ts/core");
const ioredis_1 = __importDefault(require("ioredis"));
class RedisCache {
    constructor(options = {}) {
        this._client = new ioredis_1.default(options);
    }
    async client() {
        try {
            await this._client.ping();
            return this._client;
        }
        catch {
            await this._client.connect();
            return this._client;
        }
    }
    getNamespacedKey(agentContext, key) {
        return `${agentContext.contextCorrelationId}:${key}`;
    }
    serialize(value) {
        return JSON.stringify(value);
    }
    deserialize(value) {
        return value === null ? value : JSON.parse(value);
    }
    getDefaultExpiryInSeconds(agentContext) {
        try {
            return agentContext.resolve(core_1.CacheModuleConfig).defaultExpiryInSeconds;
        }
        catch {
            return undefined;
        }
    }
    async get(agentContext, key) {
        const client = await this.client();
        const namespacedKey = this.getNamespacedKey(agentContext, key);
        const value = await client.get(namespacedKey);
        return this.deserialize(value);
    }
    async set(agentContext, key, value, expiresInSeconds = this.getDefaultExpiryInSeconds(agentContext)) {
        const client = await this.client();
        const namespacedKey = this.getNamespacedKey(agentContext, key);
        const serializedValue = this.serialize(value);
        if (expiresInSeconds) {
            await client.set(namespacedKey, serializedValue, 'EX', expiresInSeconds);
        }
        else {
            await client.set(namespacedKey, serializedValue);
        }
    }
    async remove(agentContext, key) {
        const client = await this.client();
        const namespacedKey = this.getNamespacedKey(agentContext, key);
        await client.del(namespacedKey);
    }
    async destroy(agentContext) {
        const client = await this.client();
        let cursor = '0';
        do {
            const [nextCursor, keys] = await client.scan(cursor, 'MATCH', `${agentContext.contextCorrelationId}:*`, 'COUNT', '100' // limit
            );
            cursor = nextCursor;
            if (keys.length > 0) {
                await client.del(...keys);
            }
        } while (cursor !== '0');
    }
    // TODO: we should have a method to close the cache, so we can hook into the
    // shutdown method.
    async disconnect() {
        await this._client.quit();
    }
}
exports.RedisCache = RedisCache;
//# sourceMappingURL=RedisCache.js.map