"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedJwaSignatureAlgorithms = getSupportedJwaSignatureAlgorithms;
exports.getPublicJwkFromDid = getPublicJwkFromDid;
exports.requestSignerToJwtIssuer = requestSignerToJwtIssuer;
exports.getProofTypeFromPublicJwk = getProofTypeFromPublicJwk;
exports.addSecondsToDate = addSecondsToDate;
exports.dateToSeconds = dateToSeconds;
exports.parseIfJson = parseIfJson;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
/**
 * Returns the JWA Signature Algorithms that are supported by the wallet.
 */
function getSupportedJwaSignatureAlgorithms(agentContext) {
    const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
    // If we can sign with an algorithm we assume it's supported (also for verification)
    const supportedJwaSignatureAlgorithms = Object.values(core_1.Kms.KnownJwaSignatureAlgorithms).filter((algorithm) => kms.supportedBackendsForOperation({ operation: 'sign', algorithm }).length > 0);
    return supportedJwaSignatureAlgorithms;
}
async function getPublicJwkFromDid(agentContext, didUrl, allowedPurposes = ['authentication']) {
    const didsApi = agentContext.dependencyManager.resolve(core_2.DidsApi);
    const didDocument = await didsApi.resolveDidDocument(didUrl);
    const verificationMethod = didDocument.dereferenceKey(didUrl, allowedPurposes);
    return (0, core_2.getPublicJwkFromVerificationMethod)(verificationMethod);
}
async function requestSignerToJwtIssuer(agentContext, requestSigner) {
    if (requestSigner.method === 'did') {
        const dids = agentContext.resolve(core_2.DidsApi);
        const { publicJwk } = await dids.resolveVerificationMethodFromCreatedDidRecord(requestSigner.didUrl);
        return {
            method: requestSigner.method,
            didUrl: requestSigner.didUrl,
            alg: publicJwk.signatureAlgorithm,
            kid: publicJwk.keyId,
        };
    }
    if (requestSigner.method === 'x5c') {
        const leafCertificate = requestSigner.x5c[0];
        if (!leafCertificate) {
            throw new core_2.CredoError('Unable to extract leaf certificate, x5c certificate chain is empty');
        }
        if (!requestSigner.issuer.startsWith('https://') &&
            !(requestSigner.issuer.startsWith('http://') && agentContext.config.allowInsecureHttpUrls)) {
            throw new core_2.CredoError('The X509 certificate issuer must be a HTTPS URI.');
        }
        if (!leafCertificate.sanUriNames.includes(requestSigner.issuer) &&
            !leafCertificate.sanDnsNames.includes((0, core_2.getDomainFromUrl)(requestSigner.issuer))) {
            const sanUriMessage = leafCertificate.sanUriNames.length > 0
                ? `SAN-URI names are ${leafCertificate.sanUriNames.join(', ')}`
                : 'there are no SAN-URI names';
            const sanDnsMessage = leafCertificate.sanDnsNames.length > 0
                ? `SAN-DNS names are ${leafCertificate.sanDnsNames.join(', ')}`
                : 'there are no SAN-DNS names';
            throw new Error(`The 'iss' claim in the payload does not match a 'SAN-URI' or 'SAN-DNS' name in the x5c certificate. 'iss' value is '${requestSigner.issuer}', ${sanUriMessage}, ${sanDnsMessage} (for SAN-DNS only domain has to match)`);
        }
        return {
            ...requestSigner,
            x5c: requestSigner.x5c.map((certificate) => certificate.toString('base64url')),
            alg: leafCertificate.publicJwk.signatureAlgorithm,
            kid: leafCertificate.publicJwk.keyId,
        };
    }
    if (requestSigner.method === 'jwk') {
        return {
            ...requestSigner,
            publicJwk: requestSigner.jwk.toJson(),
            alg: requestSigner.jwk.signatureAlgorithm,
        };
    }
    throw new core_2.CredoError(`Unsupported jwt issuer method '${requestSigner.method}'`);
}
function getProofTypeFromPublicJwk(agentContext, key) {
    const signatureSuiteRegistry = agentContext.dependencyManager.resolve(core_2.SignatureSuiteRegistry);
    const supportedSignatureSuites = signatureSuiteRegistry.getAllByPublicJwkType(key);
    if (supportedSignatureSuites.length === 0) {
        throw new core_2.CredoError(`Couldn't find a supported signature suite for the given key ${key.jwkTypehumanDescription}.`);
    }
    return supportedSignatureSuites[0].proofType;
}
function addSecondsToDate(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}
function dateToSeconds(date) {
    return Math.floor(date.getTime() / 1000);
}
function parseIfJson(input) {
    if (typeof input !== 'string') {
        return input;
    }
    try {
        // Try to parse the string as JSON
        return JSON.parse(input);
    }
    catch (_error) {
        /* empty */
    }
    return input;
}
//# sourceMappingURL=utils.js.map