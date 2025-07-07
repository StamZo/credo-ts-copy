"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KeyManagementModuleConfig_defaultBackend, _KeyManagementModuleConfig_backends;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementModuleConfig = void 0;
const KeyManagementError_1 = require("./error/KeyManagementError");
class KeyManagementModuleConfig {
    constructor(options) {
        _KeyManagementModuleConfig_defaultBackend.set(this, void 0);
        _KeyManagementModuleConfig_backends.set(this, void 0);
        __classPrivateFieldSet(this, _KeyManagementModuleConfig_backends, options.backends ?? [], "f");
        if (options.defaultBackend) {
            const defaultBackend = __classPrivateFieldGet(this, _KeyManagementModuleConfig_backends, "f").find((kms) => kms.backend === options.defaultBackend);
            if (!defaultBackend) {
                throw new KeyManagementError_1.KeyManagementError(`Default backend '${options.defaultBackend}' provided in KeyManagementModuleConfig, but not found in 'backends'. Make sure the backend identifier matches with a registered backend.`);
            }
            __classPrivateFieldSet(this, _KeyManagementModuleConfig_defaultBackend, options.defaultBackend, "f");
        }
    }
    get backends() {
        return __classPrivateFieldGet(this, _KeyManagementModuleConfig_backends, "f");
    }
    registerBackend(backend) {
        this.backends.push(backend);
    }
    get defaultBackend() {
        const backend = this.backends.find((kms) => !__classPrivateFieldGet(this, _KeyManagementModuleConfig_defaultBackend, "f") || __classPrivateFieldGet(this, _KeyManagementModuleConfig_defaultBackend, "f") === kms.backend);
        if (!backend) {
            throw new KeyManagementError_1.KeyManagementError('Unable to determine default backend. ');
        }
        return backend;
    }
    toJSON() {
        return {
            defaultBackend: __classPrivateFieldGet(this, _KeyManagementModuleConfig_defaultBackend, "f"),
            backends: this.backends.map((backend) => backend.backend),
        };
    }
}
exports.KeyManagementModuleConfig = KeyManagementModuleConfig;
_KeyManagementModuleConfig_defaultBackend = new WeakMap(), _KeyManagementModuleConfig_backends = new WeakMap();
//# sourceMappingURL=KeyManagementModuleConfig.js.map