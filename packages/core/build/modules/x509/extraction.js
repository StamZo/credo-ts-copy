"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractX509CertificatesFromJwt = extractX509CertificatesFromJwt;
const X509Certificate_1 = require("./X509Certificate");
function extractX509CertificatesFromJwt(jwt) {
    return jwt.header.x5c?.map((cert) => X509Certificate_1.X509Certificate.fromEncodedCertificate(cert));
}
//# sourceMappingURL=extraction.js.map