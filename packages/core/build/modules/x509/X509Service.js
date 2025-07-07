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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.X509Service = void 0;
const x509 = __importStar(require("@peculiar/x509"));
const tsyringe_1 = require("tsyringe");
const webcrypto_1 = require("../../crypto/webcrypto");
const X509Certificate_1 = require("./X509Certificate");
const X509Error_1 = require("./X509Error");
let X509Service = class X509Service {
    /**
     *
     * Validate a chain of X.509 certificates according to RFC 5280
     *
     * This function requires a list of base64 encoded certificates and, optionally, a certificate that should be found in the chain.
     * If no certificate is provided, it will just assume the leaf certificate
     *
     * The leaf certificate should be the 0th index and the root the last
     *
     * The Issuer of the certificate is found with the following algorithm:
     * - Check if there is an AuthorityKeyIdentifierExtension
     * - Go through all the other certificates and see if the SubjectKeyIdentifier is equal to thje AuthorityKeyIdentifier
     * - If they are equal, the certificate is verified and returned as the issuer
     *
     * Additional validation:
     *   - Make sure atleast a single certificate is in the chain
     *   - Check whether a certificate in the chain matches with a trusted certificate
     */
    static async validateCertificateChain(agentContext, { certificateChain, certificate = certificateChain[0], verificationDate = new Date(), trustedCertificates, }) {
        if (certificateChain.length === 0)
            throw new X509Error_1.X509Error('Certificate chain is empty');
        const webCrypto = new webcrypto_1.CredoWebCrypto(agentContext);
        let parsedLeafCertificate;
        let certificatesToBuildChain;
        try {
            parsedLeafCertificate = new x509.X509Certificate(certificate);
            certificatesToBuildChain = [...certificateChain, ...(trustedCertificates ?? [])].map((c) => new x509.X509Certificate(c));
        }
        catch (error) {
            throw new X509Error_1.X509Error('Error during parsing of x509 certificate', { cause: error });
        }
        const certificateChainBuilder = new x509.X509ChainBuilder({
            certificates: certificatesToBuildChain,
        });
        const chain = await certificateChainBuilder.build(parsedLeafCertificate, webCrypto);
        // The chain is reversed here as the `x5c` header (the expected input),
        // has the leaf certificate as the first entry, while the `x509` library expects this as the last
        let parsedChain = chain.map((c) => X509Certificate_1.X509Certificate.fromRawCertificate(new Uint8Array(c.rawData))).reverse();
        // We allow longer parsed chain, in case the root cert was not part of the chain, but in the
        // list of trusted certificates
        if (parsedChain.length < certificateChain.length) {
            throw new X509Error_1.X509Error('Could not parse the full chain. Likely due to incorrect ordering');
        }
        let previousCertificate = undefined;
        if (trustedCertificates) {
            const parsedTrustedCertificates = trustedCertificates.map((trustedCertificate) => X509Certificate_1.X509Certificate.fromEncodedCertificate(trustedCertificate));
            const trustedCertificateIndex = parsedChain.findIndex((cert) => parsedTrustedCertificates.some((tCert) => cert.equal(tCert)));
            if (trustedCertificateIndex === -1) {
                throw new X509Error_1.X509Error('No trusted certificate was found while validating the X.509 chain');
            }
            if (trustedCertificateIndex > 0) {
                // When we trust a certificate other than the first certificate in the provided chain we keep a reference to the
                // previous certificate as we need the key of this certificate to verify the first certificate in the chain as
                // it's not self-sigend.
                previousCertificate = parsedChain[trustedCertificateIndex - 1];
                // Pop everything off before the index of the trusted certificate (those are more root) as it is not relevant for validation
                parsedChain = parsedChain.slice(trustedCertificateIndex);
            }
        }
        // Verify the certificate with the publicKey of the certificate above
        for (let i = 0; i < parsedChain.length; i++) {
            const cert = parsedChain[i];
            const publicJwk = previousCertificate ? previousCertificate.publicJwk : undefined;
            // The only scenario where this will trigger is if the trusted certificates and the x509 chain both do not contain the
            // intermediate/root certificate needed. E.g. for ISO 18013-5 mDL the root cert MUST NOT be in the chain. If the signer
            // certificate is then trusted, it will fail, as we can't verify the signer certifciate without having access to the signer
            // key of the root certificate.
            // See also https://github.com/openid/OpenID4VCI/issues/62
            //
            // In this case we could skip the signature verification (not other verifications), as we already trust the signer certificate,
            // but i think the purpose of ISO 18013-5 mDL is that you trust the root certificate. If we can't verify the whole chain e.g.
            // when we receive a credential we have the chance it will fail later on.
            const skipSignatureVerification = i === 0 && trustedCertificates && !publicJwk;
            // NOTE: at some point we might want to change this to throw an error instead of skipping the signature verification of the trusted
            // but it would basically prevent mDOCs from unknown issuers to be verified in the wallet. Verifiers should only trust the root certificate
            // anyway.
            // if (i === 0 && trustedCertificates && cert.issuer !== cert.subject && !publicKey) {
            //   throw new X509Error(
            //     'Unable to verify the certificate chain. A non-self-signed certificate is the first certificate in the chain, and no parent certificate was found in the trusted certificates, meaning the first certificate in the chain cannot be verified. Ensure the certificate is added '
            //   )
            // }
            await cert.verify({
                publicJwk,
                verificationDate,
                skipSignatureVerification,
            }, webCrypto);
            previousCertificate = cert;
        }
        return parsedChain;
    }
    /**
     *
     * Parses a base64-encoded X.509 certificate into a {@link X509Certificate}
     *
     */
    static parseCertificate(_agentContext, { encodedCertificate }) {
        const certificate = X509Certificate_1.X509Certificate.fromEncodedCertificate(encodedCertificate);
        return certificate;
    }
    static getLeafCertificate(_agentContext, { certificateChain }) {
        if (certificateChain.length === 0)
            throw new X509Error_1.X509Error('Certificate chain is empty');
        const certificate = X509Certificate_1.X509Certificate.fromEncodedCertificate(certificateChain[0]);
        return certificate;
    }
    static async createCertificate(agentContext, options) {
        const webCrypto = new webcrypto_1.CredoWebCrypto(agentContext);
        const certificate = await X509Certificate_1.X509Certificate.create(options, webCrypto);
        return certificate;
    }
};
exports.X509Service = X509Service;
exports.X509Service = X509Service = __decorate([
    (0, tsyringe_1.injectable)()
    // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
], X509Service);
//# sourceMappingURL=X509Service.js.map