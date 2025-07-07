"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdocSupporteSignatureAlgorithms = void 0;
exports.isMdocSupportedSignatureAlgorithm = isMdocSupportedSignatureAlgorithm;
const kms_1 = require("../kms");
exports.mdocSupporteSignatureAlgorithms = [
    kms_1.KnownJwaSignatureAlgorithms.ES256,
    kms_1.KnownJwaSignatureAlgorithms.ES384,
    kms_1.KnownJwaSignatureAlgorithms.ES512,
    kms_1.KnownJwaSignatureAlgorithms.EdDSA,
];
function isMdocSupportedSignatureAlgorithm(alg) {
    return exports.mdocSupporteSignatureAlgorithms.includes(alg);
}
//# sourceMappingURL=mdocSupportedAlgs.js.map