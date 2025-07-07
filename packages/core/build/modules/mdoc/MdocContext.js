"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMdocContext = void 0;
const p256_1 = require("@noble/curves/p256");
const hkdf_1 = require("@noble/hashes/hkdf");
const sha2_1 = require("@noble/hashes/sha2");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const kms_1 = require("../kms");
const x509_1 = require("../x509");
const getMdocContext = (agentContext) => {
    const crypto = new crypto_1.CredoWebCrypto(agentContext);
    const kms = agentContext.resolve(kms_1.KeyManagementApi);
    return {
        crypto: {
            digest: async (input) => {
                const { bytes, digestAlgorithm } = input;
                return new Uint8Array(crypto.digest(digestAlgorithm, bytes));
            },
            random: (length) => {
                return crypto.getRandomValues(new Uint8Array(length));
            },
            calculateEphemeralMacKeyJwk: async (input) => {
                const { privateKey, publicKey, sessionTranscriptBytes } = input;
                const ikm = p256_1.p256
                    .getSharedSecret(utils_1.TypedArrayEncoder.toHex(privateKey), utils_1.TypedArrayEncoder.toHex(publicKey), true)
                    .slice(1);
                const salt = crypto_1.Hasher.hash(sessionTranscriptBytes, 'sha-256');
                const info = utils_1.Buffer.from('EMacKey', 'utf-8');
                const hk1 = (0, hkdf_1.hkdf)(sha2_1.sha256, ikm, salt, info, 32);
                return {
                    key_ops: ['sign', 'verify'],
                    ext: true,
                    kty: 'oct',
                    k: utils_1.TypedArrayEncoder.toBase64URL(hk1),
                    alg: 'HS256',
                };
            },
        },
        cose: {
            mac0: {
                sign: async (input) => {
                    const { jwk, mac0 } = input;
                    const { data } = mac0.getRawSigningData();
                    const publicJwk = kms_1.PublicJwk.fromUnknown(jwk);
                    const algorithm = mac0.algName ?? publicJwk.signatureAlgorithm;
                    const { signature } = await kms.sign({
                        data,
                        algorithm,
                        keyId: publicJwk.keyId,
                    });
                    return signature;
                },
                verify: async (input) => {
                    const { mac0, jwk, options } = input;
                    const { data, signature } = mac0.getRawVerificationData(options);
                    const publicJwk = kms_1.PublicJwk.fromUnknown(jwk);
                    const algorithm = mac0.algName ?? publicJwk.signatureAlgorithm;
                    const { verified } = await kms.verify({
                        key: {
                            publicJwk: jwk,
                        },
                        data,
                        algorithm,
                        signature,
                    });
                    return verified;
                },
            },
            sign1: {
                sign: async (input) => {
                    const { jwk, sign1 } = input;
                    const { data } = sign1.getRawSigningData();
                    const publicJwk = kms_1.PublicJwk.fromUnknown(jwk);
                    const algorithm = sign1.algName ?? publicJwk.signatureAlgorithm;
                    const { signature } = await kms.sign({
                        data,
                        algorithm: algorithm,
                        keyId: publicJwk.keyId,
                    });
                    return signature;
                },
                verify: async (input) => {
                    const { sign1, jwk, options } = input;
                    const { data, signature } = sign1.getRawVerificationData(options);
                    const publicJwk = kms_1.PublicJwk.fromUnknown(jwk);
                    const algorithm = sign1.algName ?? publicJwk.signatureAlgorithm;
                    const { verified } = await kms.verify({
                        key: {
                            publicJwk: jwk,
                        },
                        data,
                        algorithm: algorithm,
                        signature,
                    });
                    return verified;
                },
            },
        },
        x509: {
            getIssuerNameField: (input) => {
                const { certificate, field } = input;
                const x509Certificate = x509_1.X509Certificate.fromRawCertificate(certificate);
                return x509Certificate.getIssuerNameField(field);
            },
            getPublicKey: async (input) => {
                const certificate = x509_1.X509Certificate.fromRawCertificate(input.certificate);
                return certificate.publicJwk.toJson();
            },
            validateCertificateChain: async (input) => {
                const certificateChain = input.x5chain.map((cert) => x509_1.X509Certificate.fromRawCertificate(cert).toString('pem'));
                const trustedCertificates = input.trustedCertificates.map((cert) => x509_1.X509Certificate.fromRawCertificate(cert).toString('pem'));
                await x509_1.X509Service.validateCertificateChain(agentContext, {
                    certificateChain,
                    trustedCertificates,
                });
            },
            getCertificateData: async (input) => {
                const { certificate } = input;
                const x509Certificate = x509_1.X509Certificate.fromRawCertificate(certificate);
                return {
                    ...x509Certificate.data,
                    thumbprint: await x509Certificate.getThumprintInHex(agentContext),
                };
            },
        },
    };
};
exports.getMdocContext = getMdocContext;
//# sourceMappingURL=MdocContext.js.map