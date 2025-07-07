"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodeInMemoryKeyManagementStorage_storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeInMemoryKeyManagementStorage = void 0;
class NodeInMemoryKeyManagementStorage {
    constructor() {
        _NodeInMemoryKeyManagementStorage_storage.set(this, new Map());
    }
    async get(agentContext, keyId) {
        return this.storageForContext(agentContext).get(keyId) ?? null;
    }
    has(agentContext, keyId) {
        return this.storageForContext(agentContext).has(keyId);
    }
    set(agentContext, keyId, jwk) {
        this.storageForContext(agentContext).set(keyId, jwk);
    }
    delete(agentContext, keyId) {
        return this.storageForContext(agentContext).delete(keyId);
    }
    storageForContext(agentContext) {
        let storage = __classPrivateFieldGet(this, _NodeInMemoryKeyManagementStorage_storage, "f").get(agentContext.contextCorrelationId);
        if (!storage) {
            storage = new Map();
            __classPrivateFieldGet(this, _NodeInMemoryKeyManagementStorage_storage, "f").set(agentContext.contextCorrelationId, storage);
        }
        return storage;
    }
}
exports.NodeInMemoryKeyManagementStorage = NodeInMemoryKeyManagementStorage;
_NodeInMemoryKeyManagementStorage_storage = new WeakMap();
//# sourceMappingURL=NodeInMemoryKeyManagementStorage.js.map