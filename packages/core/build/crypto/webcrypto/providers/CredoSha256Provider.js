"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredoSha256Provider = void 0;
const core = __importStar(require("webcrypto-core"));
const hashes_1 = require("../../hashes");
class CredoSha256Provider extends core.ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = 'SHA-256';
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        switch (algorithm.name.toUpperCase()) {
            case 'SHA-256': {
                const hash = new hashes_1.Sha256().hash(new Uint8Array(data));
                return hash.buffer;
            }
            default:
                throw new Error(`Hashing algorithm: ${JSON.stringify(algorithm)} is not supported`);
        }
    }
}
exports.CredoSha256Provider = CredoSha256Provider;
//# sourceMappingURL=CredoSha256Provider.js.map