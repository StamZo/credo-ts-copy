"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyKeyIdFromPublicJwk = legacyKeyIdFromPublicJwk;
const utils_1 = require("../../utils");
const KeyManagementError_1 = require("./error/KeyManagementError");
/**
 * Returns the legacy key id based on the public key encoded as base58
 *
 * This is what was has been used by askar
 */
function legacyKeyIdFromPublicJwk(publicJwk) {
    const publicKey = publicJwk.publicKey;
    if (publicKey.kty === 'RSA') {
        throw new KeyManagementError_1.KeyManagementError('Unable to derive legacy key id from RSA key. Support for RSA keys was only added after explit key ids were added.');
    }
    return utils_1.TypedArrayEncoder.toBase58(publicKey.publicKey);
}
//# sourceMappingURL=legacy.js.map