"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mdoc = void 0;
const mdoc_1 = require("@animo-id/mdoc");
const index_1 = require("../vc/index");
const x509_1 = require("../x509");
const kms_1 = require("../kms");
const jwa_1 = require("../kms/jwk/jwa");
const utils_1 = require("./../../utils");
const MdocContext_1 = require("./MdocContext");
const MdocError_1 = require("./MdocError");
const mdocSupportedAlgs_1 = require("./mdocSupportedAlgs");
/**
 * This class represents a IssuerSigned Mdoc Document,
 * which are the actual credentials being issued to holders.
 */
class Mdoc {
    constructor(issuerSignedDocument) {
        this.issuerSignedDocument = issuerSignedDocument;
        const issuerSigned = issuerSignedDocument.prepare().get('issuerSigned');
        this.base64Url = utils_1.TypedArrayEncoder.toBase64URL((0, mdoc_1.cborEncode)(issuerSigned));
    }
    /**
     * claim format is convenience method added to all credential instances
     */
    get claimFormat() {
        return index_1.ClaimFormat.MsoMdoc;
    }
    /**
     * Encoded is convenience method added to all credential instances
     */
    get encoded() {
        return this.base64Url;
    }
    /**
     * Get the device key to which the mdoc is bound
     */
    get deviceKey() {
        const deviceKeyRaw = this.issuerSignedDocument.issuerSigned.issuerAuth.decodedPayload.deviceKeyInfo?.deviceKey;
        if (!deviceKeyRaw)
            return null;
        return kms_1.PublicJwk.fromUnknown(mdoc_1.COSEKey.import(deviceKeyRaw).toJWK());
    }
    static fromBase64Url(mdocBase64Url, expectedDocType) {
        const issuerSignedDocument = (0, mdoc_1.parseIssuerSigned)(utils_1.TypedArrayEncoder.fromBase64(mdocBase64Url), expectedDocType);
        return new Mdoc(issuerSignedDocument);
    }
    static fromIssuerSignedDocument(issuerSignedBase64Url, expectedDocType) {
        return new Mdoc((0, mdoc_1.parseIssuerSigned)(utils_1.TypedArrayEncoder.fromBase64(issuerSignedBase64Url), expectedDocType));
    }
    static fromDeviceSignedDocument(issuerSignedBase64Url, deviceSignedBase64Url, expectedDocType) {
        return new Mdoc((0, mdoc_1.parseDeviceSigned)(utils_1.TypedArrayEncoder.fromBase64(deviceSignedBase64Url), utils_1.TypedArrayEncoder.fromBase64(issuerSignedBase64Url), expectedDocType));
    }
    get docType() {
        return this.issuerSignedDocument.docType;
    }
    get alg() {
        const algName = this.issuerSignedDocument.issuerSigned.issuerAuth.algName;
        if (!algName) {
            throw new MdocError_1.MdocError('Cannot extract the signature algorithm from the mdoc.');
        }
        if ((0, jwa_1.isKnownJwaSignatureAlgorithm)(algName)) {
            return algName;
        }
        throw new MdocError_1.MdocError(`Cannot parse mdoc. The signature algorithm '${algName}' is not supported.`);
    }
    get validityInfo() {
        return this.issuerSignedDocument.issuerSigned.issuerAuth.decodedPayload.validityInfo;
    }
    get deviceSignedNamespaces() {
        if (this.issuerSignedDocument instanceof mdoc_1.DeviceSignedDocument === false) {
            return null;
        }
        return Object.fromEntries(Array.from(this.issuerSignedDocument.allDeviceSignedNamespaces.entries()).map(([namespace, value]) => [
            namespace,
            Object.fromEntries(Array.from(value.entries())),
        ]));
    }
    get issuerSignedCertificateChain() {
        return this.issuerSignedDocument.issuerSigned.issuerAuth.certificateChain;
    }
    get issuerSignedNamespaces() {
        return Object.fromEntries(Array.from(this.issuerSignedDocument.allIssuerSignedNamespaces.entries()).map(([namespace, value]) => [
            namespace,
            Object.fromEntries(Array.from(value.entries())),
        ]));
    }
    static async sign(agentContext, options) {
        const { docType, validityInfo, namespaces, holderKey, issuerCertificate } = options;
        const mdocContext = (0, MdocContext_1.getMdocContext)(agentContext);
        const document = new mdoc_1.Document(docType, mdocContext)
            .useDigestAlgorithm('SHA-256')
            .addValidityInfo(validityInfo)
            .addDeviceKeyInfo({ deviceKey: holderKey.toJson() });
        for (const [namespace, namespaceRecord] of Object.entries(namespaces)) {
            document.addIssuerNameSpace(namespace, namespaceRecord);
        }
        const issuerKey = issuerCertificate.publicJwk;
        const alg = issuerKey.supportedSignatureAlgorithms.find(mdocSupportedAlgs_1.isMdocSupportedSignatureAlgorithm);
        if (!alg) {
            throw new MdocError_1.MdocError(`Unable to create sign mdoc. No supported signature algorithm found to sign mdoc for jwk with key ${issuerKey.jwkTypehumanDescription}. Key supports algs ${issuerKey.supportedSignatureAlgorithms.join(', ')}. mdoc supports algs ${mdocSupportedAlgs_1.mdocSupporteSignatureAlgorithms.join(', ')}`);
        }
        const issuerSignedDocument = await document.sign({
            issuerPrivateKey: issuerKey.toJson(),
            alg,
            issuerCertificate: issuerCertificate.rawCertificate,
        }, mdocContext);
        return new Mdoc(issuerSignedDocument);
    }
    async verify(agentContext, options) {
        const x509ModuleConfig = agentContext.dependencyManager.resolve(x509_1.X509ModuleConfig);
        const certificateChain = this.issuerSignedDocument.issuerSigned.issuerAuth.certificateChain.map((certificate) => x509_1.X509Certificate.fromRawCertificate(certificate));
        let trustedCertificates = options?.trustedCertificates;
        if (!trustedCertificates) {
            trustedCertificates =
                (await x509ModuleConfig.getTrustedCertificatesForVerification?.(agentContext, {
                    verification: {
                        type: 'credential',
                        credential: this,
                    },
                    certificateChain,
                })) ?? x509ModuleConfig.trustedCertificates;
        }
        if (!trustedCertificates) {
            throw new MdocError_1.MdocError('No trusted certificates found. Cannot verify mdoc.');
        }
        const mdocContext = (0, MdocContext_1.getMdocContext)(agentContext);
        try {
            const verifier = new mdoc_1.Verifier();
            await verifier.verifyIssuerSignature({
                trustedCertificates: trustedCertificates.map((cert) => x509_1.X509Certificate.fromEncodedCertificate(cert).rawCertificate),
                issuerAuth: this.issuerSignedDocument.issuerSigned.issuerAuth,
                disableCertificateChainValidation: false,
                now: options?.now,
            }, mdocContext);
            await verifier.verifyData({ mdoc: this.issuerSignedDocument }, mdocContext);
            return { isValid: true };
        }
        catch (error) {
            return { isValid: false, error: error.message };
        }
    }
    toJSON() {
        return this.base64Url;
    }
    toString() {
        return this.base64Url;
    }
}
exports.Mdoc = Mdoc;
//# sourceMappingURL=Mdoc.js.map