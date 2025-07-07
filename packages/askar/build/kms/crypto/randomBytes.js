"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = randomBytes;
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
function randomBytes(length) {
    const buffer = new Uint8Array(length);
    const CBOX_NONCE_LENGTH = 24;
    const genCount = Math.ceil(length / CBOX_NONCE_LENGTH);
    const buf = new Uint8Array(genCount * CBOX_NONCE_LENGTH);
    for (let i = 0; i < genCount; i++) {
        const randomBytes = askar_shared_1.CryptoBox.randomNonce();
        buf.set(randomBytes, CBOX_NONCE_LENGTH * i);
    }
    buffer.set(buf.subarray(0, length));
    return buffer;
}
//# sourceMappingURL=randomBytes.js.map