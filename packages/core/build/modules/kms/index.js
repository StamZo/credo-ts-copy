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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyKeyIdFromPublicJwk = void 0;
__exportStar(require("./KeyManagementApi"), exports);
__exportStar(require("./KeyManagementModule"), exports);
__exportStar(require("./KeyManagementModuleConfig"), exports);
__exportStar(require("./KeyManagementService"), exports);
__exportStar(require("./options"), exports);
__exportStar(require("./error/KeyManagementError"), exports);
__exportStar(require("./error/KeyManagementKeyExistsError"), exports);
__exportStar(require("./error/KeyManagementKeyNotFoundError"), exports);
__exportStar(require("./error/KeyManagementAlgorithmNotSupportedError"), exports);
__exportStar(require("./jwk"), exports);
var legacy_1 = require("./legacy");
Object.defineProperty(exports, "legacyKeyIdFromPublicJwk", { enumerable: true, get: function () { return legacy_1.legacyKeyIdFromPublicJwk; } });
//# sourceMappingURL=index.js.map