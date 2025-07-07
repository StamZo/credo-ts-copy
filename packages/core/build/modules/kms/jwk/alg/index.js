"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedKeyDerivationAlgsForKey = exports.assertAllowedKeyDerivationAlgForKey = exports.allowedKeyDerivationAlgsForKey = exports.supportedSigningAlgsForKey = exports.assertAllowedSigningAlgForKey = exports.allowedSigningAlgsForSigningKey = exports.supportedEncryptionAlgsForKey = exports.assertAllowedEncryptionAlgForKey = exports.allowedEncryptionAlgsForKey = void 0;
var encryption_1 = require("./encryption");
Object.defineProperty(exports, "allowedEncryptionAlgsForKey", { enumerable: true, get: function () { return encryption_1.allowedEncryptionAlgsForKey; } });
Object.defineProperty(exports, "assertAllowedEncryptionAlgForKey", { enumerable: true, get: function () { return encryption_1.assertAllowedEncryptionAlgForKey; } });
Object.defineProperty(exports, "supportedEncryptionAlgsForKey", { enumerable: true, get: function () { return encryption_1.supportedEncryptionAlgsForKey; } });
var signing_1 = require("./signing");
Object.defineProperty(exports, "allowedSigningAlgsForSigningKey", { enumerable: true, get: function () { return signing_1.allowedSigningAlgsForSigningKey; } });
Object.defineProperty(exports, "assertAllowedSigningAlgForKey", { enumerable: true, get: function () { return signing_1.assertAllowedSigningAlgForKey; } });
Object.defineProperty(exports, "supportedSigningAlgsForKey", { enumerable: true, get: function () { return signing_1.supportedSigningAlgsForKey; } });
var keyDerivation_1 = require("./keyDerivation");
Object.defineProperty(exports, "allowedKeyDerivationAlgsForKey", { enumerable: true, get: function () { return keyDerivation_1.allowedKeyDerivationAlgsForKey; } });
Object.defineProperty(exports, "assertAllowedKeyDerivationAlgForKey", { enumerable: true, get: function () { return keyDerivation_1.assertAllowedKeyDerivationAlgForKey; } });
Object.defineProperty(exports, "supportedKeyDerivationAlgsForKey", { enumerable: true, get: function () { return keyDerivation_1.supportedKeyDerivationAlgsForKey; } });
//# sourceMappingURL=index.js.map