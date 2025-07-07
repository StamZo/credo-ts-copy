"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuSigner = void 0;
const ethers_1 = require("ethers");
class IndyBesuSigner {
    constructor(secretKey) {
        this.signingKey = new ethers_1.SigningKey(secretKey);
        this.address = (0, ethers_1.computeAddress)(this.signingKey.compressedPublicKey);
    }
    signTransaction(transaction) {
        const bytesToSign = transaction.getSigningBytes();
        const signature = this.signingKey.sign(bytesToSign);
        transaction.setSignature({
            recovery_id: signature.yParity,
            signature: (0, ethers_1.getBytes)((0, ethers_1.concat)([signature.r, signature.s])),
        });
    }
}
exports.IndyBesuSigner = IndyBesuSigner;
//# sourceMappingURL=IndyBesuSigner.js.map