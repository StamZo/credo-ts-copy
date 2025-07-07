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
exports.X509Certificate = exports.X509ExtendedKeyUsage = exports.X509KeyUsage = void 0;
const asn1_schema_1 = require("@peculiar/asn1-schema");
const asn1_x509_1 = require("@peculiar/asn1-x509");
const x509 = __importStar(require("@peculiar/x509"));
const webcrypto_1 = require("../../crypto/webcrypto");
const utils_1 = require("../../crypto/webcrypto/utils");
const utils_2 = require("../../utils");
const kms_1 = require("../kms");
const X509Error_1 = require("./X509Error");
const utils_3 = require("./utils");
var X509KeyUsage;
(function (X509KeyUsage) {
    X509KeyUsage[X509KeyUsage["DigitalSignature"] = 1] = "DigitalSignature";
    X509KeyUsage[X509KeyUsage["NonRepudiation"] = 2] = "NonRepudiation";
    X509KeyUsage[X509KeyUsage["KeyEncipherment"] = 4] = "KeyEncipherment";
    X509KeyUsage[X509KeyUsage["DataEncipherment"] = 8] = "DataEncipherment";
    X509KeyUsage[X509KeyUsage["KeyAgreement"] = 16] = "KeyAgreement";
    X509KeyUsage[X509KeyUsage["KeyCertSign"] = 32] = "KeyCertSign";
    X509KeyUsage[X509KeyUsage["CrlSign"] = 64] = "CrlSign";
    X509KeyUsage[X509KeyUsage["EncipherOnly"] = 128] = "EncipherOnly";
    X509KeyUsage[X509KeyUsage["DecipherOnly"] = 256] = "DecipherOnly";
})(X509KeyUsage || (exports.X509KeyUsage = X509KeyUsage = {}));
var X509ExtendedKeyUsage;
(function (X509ExtendedKeyUsage) {
    X509ExtendedKeyUsage["ServerAuth"] = "1.3.6.1.5.5.7.3.1";
    X509ExtendedKeyUsage["ClientAuth"] = "1.3.6.1.5.5.7.3.2";
    X509ExtendedKeyUsage["CodeSigning"] = "1.3.6.1.5.5.7.3.3";
    X509ExtendedKeyUsage["EmailProtection"] = "1.3.6.1.5.5.7.3.4";
    X509ExtendedKeyUsage["TimeStamping"] = "1.3.6.1.5.5.7.3.8";
    X509ExtendedKeyUsage["OcspSigning"] = "1.3.6.1.5.5.7.3.9";
    X509ExtendedKeyUsage["MdlDs"] = "1.0.18013.5.1.2";
})(X509ExtendedKeyUsage || (exports.X509ExtendedKeyUsage = X509ExtendedKeyUsage = {}));
class X509Certificate {
    constructor(options) {
        this.publicJwk = options.publicJwk;
        this.privateKey = options.privateKey;
        this.x509Certificate = options.x509Certificate;
    }
    set keyId(keyId) {
        this.publicJwk.keyId = keyId;
    }
    get keyId() {
        return this.publicJwk.keyId;
    }
    get hasKeyId() {
        return this.publicJwk.hasKeyId;
    }
    static fromRawCertificate(rawCertificate) {
        const certificate = new x509.X509Certificate(rawCertificate);
        return X509Certificate.parseCertificate(certificate);
    }
    static fromEncodedCertificate(encodedCertificate) {
        const certificate = new x509.X509Certificate(encodedCertificate);
        return X509Certificate.parseCertificate(certificate);
    }
    static parseCertificate(certificate) {
        const spki = asn1_schema_1.AsnParser.parse(certificate.publicKey.rawData, asn1_x509_1.SubjectPublicKeyInfo);
        const privateKey = certificate.privateKey ? new Uint8Array(certificate.privateKey.rawData) : undefined;
        const publicJwk = (0, utils_1.spkiToPublicJwk)(spki);
        return new X509Certificate({
            publicJwk,
            privateKey,
            x509Certificate: certificate,
        });
    }
    getMatchingExtensions(objectIdentifier) {
        return this.x509Certificate.extensions.filter((e) => e.type === objectIdentifier);
    }
    get rawCertificate() {
        return new Uint8Array(this.x509Certificate.rawData);
    }
    get subjectAlternativeNames() {
        const san = this.getMatchingExtensions(asn1_x509_1.id_ce_subjectAltName);
        return san?.flatMap((s) => s.names.items).map((i) => ({ type: i.type, value: i.value })) ?? [];
    }
    get issuerAlternativeNames() {
        const ian = this.getMatchingExtensions(asn1_x509_1.id_ce_issuerAltName);
        return ian?.flatMap((i) => i.names.items).map((i) => ({ type: i.type, value: i.value })) ?? [];
    }
    get sanDnsNames() {
        return this.subjectAlternativeNames.filter((san) => san.type === 'dns').map((san) => san.value);
    }
    get sanUriNames() {
        return this.subjectAlternativeNames.filter((ian) => ian.type === 'url').map((ian) => ian.value);
    }
    get ianDnsNames() {
        return this.issuerAlternativeNames.filter((san) => san.type === 'dns').map((san) => san.value);
    }
    get ianUriNames() {
        return this.issuerAlternativeNames.filter((ian) => ian.type === 'url').map((ian) => ian.value);
    }
    get authorityKeyIdentifier() {
        const keyIds = this.getMatchingExtensions(asn1_x509_1.id_ce_authorityKeyIdentifier)?.map((e) => e.keyId);
        if (keyIds && keyIds.length > 1) {
            throw new X509Error_1.X509Error('Multiple Authority Key Identifiers are not allowed');
        }
        return keyIds?.[0];
    }
    get subjectKeyIdentifier() {
        const keyIds = this.getMatchingExtensions(asn1_x509_1.id_ce_subjectKeyIdentifier)?.map((e) => e.keyId);
        if (keyIds && keyIds.length > 1) {
            throw new X509Error_1.X509Error('Multiple Subject Key Identifiers are not allowed');
        }
        return keyIds?.[0];
    }
    // biome-ignore lint/suspicious/useGetterReturn: <explanation>
    get keyUsage() {
        const keyUsages = this.getMatchingExtensions(asn1_x509_1.id_ce_keyUsage)?.map((e) => e.usages);
        if (keyUsages && keyUsages.length > 1) {
            throw new X509Error_1.X509Error('Multiple Key Usages are not allowed');
        }
        if (keyUsages) {
            return Object.values(X509KeyUsage)
                .filter((key) => typeof key === 'number')
                .filter((flagValue) => (keyUsages[0] & flagValue) === flagValue)
                .map((flagValue) => flagValue);
        }
    }
    get extendedKeyUsage() {
        const extendedKeyUsages = this.getMatchingExtensions(asn1_x509_1.id_ce_extKeyUsage)?.map((e) => e.usages);
        if (extendedKeyUsages && extendedKeyUsages.length > 1) {
            throw new X509Error_1.X509Error('Multiple Key Usages are not allowed');
        }
        return extendedKeyUsages?.[0];
    }
    isExtensionCritical(id) {
        const extension = this.getMatchingExtensions(id);
        if (!extension) {
            throw new X509Error_1.X509Error(`extension with id '${id}' is not found`);
        }
        return !!extension[0].critical;
    }
    static async create(options, webCrypto) {
        const subjectPublicKey = options.subjectPublicKey ?? options.authorityKey;
        const isSelfSignedCertificate = (0, kms_1.assymetricPublicJwkMatches)(options.authorityKey.toJson(), subjectPublicKey.toJson());
        const signingKey = new webcrypto_1.CredoWebCryptoKey(options.authorityKey, (0, utils_1.publicJwkToCryptoKeyAlgorithm)(options.authorityKey), false, 'private', ['sign']);
        const publicKey = new webcrypto_1.CredoWebCryptoKey(subjectPublicKey, (0, utils_1.publicJwkToCryptoKeyAlgorithm)(options.authorityKey), true, 'public', ['verify']);
        const issuerName = (0, utils_3.convertName)(options.issuer);
        const extensions = [];
        extensions.push((0, utils_3.createSubjectKeyIdentifierExtension)(options.extensions?.subjectKeyIdentifier, { publicJwk: subjectPublicKey }));
        extensions.push((0, utils_3.createKeyUsagesExtension)(options.extensions?.keyUsage));
        extensions.push((0, utils_3.createExtendedKeyUsagesExtension)(options.extensions?.extendedKeyUsage));
        extensions.push((0, utils_3.createAuthorityKeyIdentifierExtension)(options.extensions?.authorityKeyIdentifier, {
            publicJwk: options.authorityKey,
        }));
        extensions.push((0, utils_3.createIssuerAlternativeNameExtension)(options.extensions?.issuerAlternativeName));
        extensions.push((0, utils_3.createSubjectAlternativeNameExtension)(options.extensions?.subjectAlternativeName));
        extensions.push((0, utils_3.createBasicConstraintsExtension)(options.extensions?.basicConstraints));
        extensions.push((0, utils_3.createCrlDistributionPointsExtension)(options.extensions?.crlDistributionPoints));
        if (isSelfSignedCertificate) {
            if (options.subject) {
                throw new X509Error_1.X509Error('Do not provide a subject name when the certificate is supposed to be self signed');
            }
            const certificate = await x509.X509CertificateGenerator.createSelfSigned({
                keys: { publicKey, privateKey: signingKey },
                name: issuerName,
                notBefore: options.validity?.notBefore,
                notAfter: options.validity?.notAfter,
                extensions: extensions.filter((e) => e !== undefined),
                serialNumber: options.serialNumber,
            }, webCrypto);
            const certificateInstance = X509Certificate.parseCertificate(certificate);
            if (subjectPublicKey.hasKeyId)
                certificateInstance.publicJwk.keyId = subjectPublicKey.keyId;
            return certificateInstance;
        }
        if (!options.subject) {
            throw new X509Error_1.X509Error('Provide a subject name when the certificate is not supposed to be self signed');
        }
        const subjectName = (0, utils_3.convertName)(options.subject);
        const certificate = await x509.X509CertificateGenerator.create({
            signingKey,
            publicKey,
            issuer: issuerName,
            subject: subjectName,
            notBefore: options.validity?.notBefore,
            notAfter: options.validity?.notAfter,
            extensions: extensions.filter((e) => e !== undefined),
        }, webCrypto);
        const certificateInstance = X509Certificate.parseCertificate(certificate);
        if (subjectPublicKey.hasKeyId)
            certificateInstance.publicJwk.keyId = subjectPublicKey.keyId;
        return certificateInstance;
    }
    get subject() {
        return this.x509Certificate.subject;
    }
    get issuer() {
        return this.x509Certificate.issuer;
    }
    async verify({ verificationDate = new Date(), publicJwk, skipSignatureVerification = false, }, webCrypto) {
        let publicCryptoKey;
        if (publicJwk) {
            const cryptoKeyAlgorithm = (0, utils_1.publicJwkToCryptoKeyAlgorithm)(publicJwk);
            publicCryptoKey = new webcrypto_1.CredoWebCryptoKey(publicJwk, cryptoKeyAlgorithm, true, 'public', ['verify']);
        }
        // We use the library to validate the signature, but the date is manually verified
        const isSignatureValid = skipSignatureVerification
            ? true
            : await this.x509Certificate.verify({ signatureOnly: true, publicKey: publicCryptoKey }, webCrypto);
        const time = verificationDate.getTime();
        const isNotBeforeValid = this.x509Certificate.notBefore.getTime() <= time;
        const isNotAfterValid = time <= this.x509Certificate.notAfter.getTime();
        if (!isSignatureValid) {
            throw new X509Error_1.X509Error(`Certificate: '${this.x509Certificate.subject}' has an invalid signature`);
        }
        if (!isNotBeforeValid) {
            throw new X509Error_1.X509Error(`Certificate: '${this.x509Certificate.subject}' used before it is allowed`);
        }
        if (!isNotAfterValid) {
            throw new X509Error_1.X509Error(`Certificate: '${this.x509Certificate.subject}' used after it is allowed`);
        }
    }
    /**
     * Get the thumprint of the X509 certificate in hex format.
     */
    async getThumprintInHex(agentContext) {
        const thumbprint = await this.x509Certificate.getThumbprint(new webcrypto_1.CredoWebCrypto(agentContext));
        const thumbprintHex = utils_2.TypedArrayEncoder.toHex(new Uint8Array(thumbprint));
        return thumbprintHex;
    }
    /**
     * Get the data elements of the x509 certificate
     */
    get data() {
        return {
            issuerName: this.x509Certificate.issuerName.toString(),
            issuer: this.x509Certificate.issuer,
            subjectName: this.x509Certificate.subjectName.toString(),
            subject: this.x509Certificate.subject,
            serialNumber: this.x509Certificate.serialNumber,
            pem: this.x509Certificate.toString(),
            notBefore: this.x509Certificate.notBefore,
            notAfter: this.x509Certificate.notAfter,
        };
    }
    getIssuerNameField(field) {
        return this.x509Certificate.issuerName.getField(field);
    }
    /**
     * @param format the format to export to, defaults to `pem`
     */
    toString(format) {
        return this.x509Certificate.toString(format ?? 'pem');
    }
    toJSON() {
        return this.toString();
    }
    equal(certificate) {
        const parsedOther = new x509.X509Certificate(certificate.rawCertificate);
        return this.x509Certificate.equal(parsedOther);
    }
}
exports.X509Certificate = X509Certificate;
//# sourceMappingURL=X509Certificate.js.map