"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrlDistributionPointsExtension = exports.createBasicConstraintsExtension = exports.createSubjectAlternativeNameExtension = exports.createIssuerAlternativeNameExtension = exports.createAuthorityKeyIdentifierExtension = exports.createExtendedKeyUsagesExtension = exports.createKeyUsagesExtension = exports.createSubjectKeyIdentifierExtension = void 0;
const Hasher_1 = require("../../../crypto/hashes/Hasher");
const x509_1 = require("@peculiar/x509");
const utils_1 = require("../../../crypto/webcrypto/utils");
const utils_2 = require("../../../utils");
const extensions_1 = require("../extensions");
const createSubjectKeyIdentifierExtension = (options, additionalOptions) => {
    if (!options || !options.include)
        return;
    const spki = (0, utils_1.publicJwkToSpki)(additionalOptions.publicJwk);
    const hash = Hasher_1.Hasher.hash(new Uint8Array(spki.subjectPublicKey), 'SHA-1');
    return new x509_1.SubjectKeyIdentifierExtension(utils_2.TypedArrayEncoder.toHex(hash));
};
exports.createSubjectKeyIdentifierExtension = createSubjectKeyIdentifierExtension;
const createKeyUsagesExtension = (options) => {
    if (!options)
        return;
    const flags = options.usages.reduce((prev, curr) => prev | curr, 0);
    return new x509_1.KeyUsagesExtension(flags, options.markAsCritical);
};
exports.createKeyUsagesExtension = createKeyUsagesExtension;
const createExtendedKeyUsagesExtension = (options) => {
    if (!options)
        return;
    return new x509_1.ExtendedKeyUsageExtension(options.usages, options.markAsCritical);
};
exports.createExtendedKeyUsagesExtension = createExtendedKeyUsagesExtension;
const createAuthorityKeyIdentifierExtension = (options, additionalOptions) => {
    if (!options)
        return;
    const spki = (0, utils_1.publicJwkToSpki)(additionalOptions.publicJwk);
    const hash = Hasher_1.Hasher.hash(new Uint8Array(spki.subjectPublicKey), 'SHA-1');
    return new x509_1.AuthorityKeyIdentifierExtension(utils_2.TypedArrayEncoder.toHex(hash), options.markAsCritical);
};
exports.createAuthorityKeyIdentifierExtension = createAuthorityKeyIdentifierExtension;
const createIssuerAlternativeNameExtension = (options) => {
    if (!options)
        return;
    return new extensions_1.IssuerAlternativeNameExtension(options.name, options.markAsCritical);
};
exports.createIssuerAlternativeNameExtension = createIssuerAlternativeNameExtension;
const createSubjectAlternativeNameExtension = (options) => {
    if (!options)
        return;
    return new x509_1.SubjectAlternativeNameExtension(options.name, options.markAsCritical);
};
exports.createSubjectAlternativeNameExtension = createSubjectAlternativeNameExtension;
const createBasicConstraintsExtension = (options) => {
    if (!options)
        return;
    return new x509_1.BasicConstraintsExtension(options.ca, options.pathLenConstraint, options.markAsCritical);
};
exports.createBasicConstraintsExtension = createBasicConstraintsExtension;
const createCrlDistributionPointsExtension = (options) => {
    if (!options)
        return;
    return new x509_1.CRLDistributionPointsExtension(options.urls, options.markAsCritical);
};
exports.createCrlDistributionPointsExtension = createCrlDistributionPointsExtension;
//# sourceMappingURL=extensions.js.map