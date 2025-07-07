"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToBigint = bytesToBigint;
function bytesToBigint(b) {
    if (b.length === 0) {
        throw new Error('Empty byte array is not supported');
    }
    let value = 0n;
    for (let i = 0; i < b.length; i++) {
        value = (value << 8n) | BigInt(b[i]);
    }
    return value;
}
//# sourceMappingURL=bytesToBigint.js.map