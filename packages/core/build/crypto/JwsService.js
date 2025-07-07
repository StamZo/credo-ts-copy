"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwsService = void 0;
const error_1 = require("../error");
const x509_1 = require("../modules/x509");
const plugins_1 = require("../plugins");
const utils_1 = require("../utils");
const kms_1 = require("../modules/kms");
const jwa_1 = require("../modules/kms/jwk/jwa");
const types_1 = require("../types");
const X509Service_1 = require("./../modules/x509/X509Service");
const JwsTypes_1 = require("./JwsTypes");
const jwt_1 = require("./jose/jwt");
let JwsService = class JwsService {
    async createJwsBase(agentContext, options) {
        const { jwk, alg, x5c } = options.protectedHeaderOptions;
        const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
        const key = await kms.getPublicKey({ keyId: options.keyId });
        (0, kms_1.assertJwkAsymmetric)(key);
        const publicJwk = kms_1.PublicJwk.fromPublicJwk(key);
        // Make sure the options.x5c and x5c from protectedHeader are the same.
        if (x5c) {
            const certificate = X509Service_1.X509Service.getLeafCertificate(agentContext, {
                certificateChain: x5c,
            });
            if (!(0, kms_1.assymetricPublicJwkMatches)(certificate.publicJwk.toJson(), key)) {
                throw new error_1.CredoError('Protected header x5c does not match key for signing.');
            }
        }
        const jwkInstance = jwk instanceof kms_1.PublicJwk ? jwk : jwk ? kms_1.PublicJwk.fromUnknown(jwk) : undefined;
        // Make sure the options.key and jwk from protectedHeader are the same.
        if (jwkInstance && !(0, kms_1.assymetricPublicJwkMatches)(jwkInstance.toJson(), key)) {
            throw new error_1.CredoError('Protected header JWK does not match key for signing.');
        }
        // Validate the options.key used for signing against the jws options
        if (!publicJwk.supportedSignatureAlgorithms.includes(alg)) {
            throw new error_1.CredoError(`alg '${alg}' is not a valid JWA signature algorithm for this jwk with ${publicJwk.jwkTypehumanDescription}. Supported algorithms are ${publicJwk.supportedSignatureAlgorithms.join(', ')}`);
        }
        const payload = options.payload instanceof jwt_1.JwtPayload ? utils_1.JsonEncoder.toBuffer(options.payload.toJson()) : options.payload;
        const base64Payload = utils_1.TypedArrayEncoder.toBase64URL(payload);
        const base64UrlProtectedHeader = utils_1.JsonEncoder.toBase64URL(this.buildProtected(options.protectedHeaderOptions));
        const signResult = await kms.sign({
            algorithm: alg,
            data: utils_1.TypedArrayEncoder.fromString(`${base64UrlProtectedHeader}.${base64Payload}`),
            keyId: options.keyId,
        });
        const signature = utils_1.TypedArrayEncoder.toBase64URL(signResult.signature);
        return {
            base64Payload,
            base64UrlProtectedHeader,
            signature,
        };
    }
    async createJws(agentContext, { payload, keyId, header, protectedHeaderOptions }) {
        const { base64UrlProtectedHeader, signature, base64Payload } = await this.createJwsBase(agentContext, {
            payload,
            keyId,
            protectedHeaderOptions,
        });
        return {
            protected: base64UrlProtectedHeader,
            signature,
            header,
            payload: base64Payload,
        };
    }
    /**
     *  @see {@link https://www.rfc-editor.org/rfc/rfc7515#section-3.1}
     * */
    async createJwsCompact(agentContext, { payload, keyId, protectedHeaderOptions }) {
        const { base64Payload, base64UrlProtectedHeader, signature } = await this.createJwsBase(agentContext, {
            payload,
            keyId,
            protectedHeaderOptions,
        });
        return `${base64UrlProtectedHeader}.${base64Payload}.${signature}`;
    }
    /**
     * Verify a JWS
     */
    async verifyJws(agentContext, { jws, resolveJwsSigner, trustedCertificates, jwsSigner: expectedJwsSigner, allowedJwsSignerMethods = ['did', 'jwk', 'x5c'], }) {
        let signatures = [];
        let payload;
        if (expectedJwsSigner && !allowedJwsSignerMethods.includes(expectedJwsSigner.method)) {
            throw new error_1.CredoError(`jwsSigner provided with method '${expectedJwsSigner.method}', but allowed jws signer methods are ${allowedJwsSignerMethods.join(', ')}.`);
        }
        if (typeof jws === 'string') {
            if (!JwsTypes_1.JWS_COMPACT_FORMAT_MATCHER.test(jws))
                throw new error_1.CredoError(`Invalid JWS compact format for value '${jws}'.`);
            const [protectedHeader, _payload, signature] = jws.split('.');
            payload = _payload;
            signatures.push({
                header: {},
                protected: protectedHeader,
                signature,
            });
        }
        else if ('signatures' in jws) {
            signatures = jws.signatures;
            payload = jws.payload;
        }
        else {
            signatures.push(jws);
            payload = jws.payload;
        }
        if (signatures.length === 0) {
            throw new error_1.CredoError('Unable to verify JWS, no signatures present in JWS.');
        }
        const jwsFlattened = {
            signatures,
            payload,
        };
        const jwsSigners = [];
        for (const jws of signatures) {
            const protectedJson = utils_1.JsonEncoder.fromBase64(jws.protected);
            if (!(0, types_1.isJsonObject)(protectedJson)) {
                throw new error_1.CredoError('Unable to verify JWS, protected header is not a valid JSON object.');
            }
            if (!protectedJson.alg || typeof protectedJson.alg !== 'string') {
                throw new error_1.CredoError('Unable to verify JWS, protected header alg is not provided or not a string.');
            }
            const jwsSigner = expectedJwsSigner ??
                (await this.jwsSignerFromJws(agentContext, {
                    jws,
                    payload,
                    protectedHeader: {
                        ...protectedJson,
                        alg: protectedJson.alg,
                    },
                    allowedJwsSignerMethods,
                    resolveJwsSigner,
                }));
            await this.verifyJwsSigner(agentContext, {
                jwsSigner,
                trustedCertificates,
            });
            if (!jwsSigner.jwk.supportedSignatureAlgorithms.includes(protectedJson.alg)) {
                throw new error_1.CredoError(`alg '${protectedJson.alg}' is not a valid JWA signature algorithm for this jwk ${(0, kms_1.getJwkHumanDescription)(jwsSigner.jwk.toJson())}. Supported algorithms are ${jwsSigner.jwk.supportedSignatureAlgorithms.join(', ')}`);
            }
            const data = utils_1.TypedArrayEncoder.fromString(`${jws.protected}.${payload}`);
            const signature = utils_1.TypedArrayEncoder.fromBase64(jws.signature);
            jwsSigners.push(jwsSigner);
            const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
            try {
                const { verified } = await kms.verify({
                    key: {
                        publicJwk: jwsSigner.jwk.toJson(),
                    },
                    data,
                    signature,
                    algorithm: protectedJson.alg,
                });
                if (!verified) {
                    return {
                        isValid: false,
                        jwsSigners: [],
                        jws: jwsFlattened,
                    };
                }
            }
            catch (error) {
                // WalletError probably means signature verification failed. Would be useful to add
                // more specific error type in kms.verify method
                if (error instanceof kms_1.KeyManagementError) {
                    return {
                        isValid: false,
                        jwsSigners: [],
                        jws: jwsFlattened,
                    };
                }
                throw error;
            }
        }
        return { isValid: true, jwsSigners, jws: jwsFlattened };
    }
    buildProtected(options) {
        return {
            ...options,
            alg: options.alg,
            jwk: options.jwk instanceof kms_1.PublicJwk ? options.jwk.toJson() : options.jwk,
            kid: options.kid,
        };
    }
    async verifyJwsSigner(agentContext, options) {
        const { jwsSigner } = options;
        if (jwsSigner.method === 'x5c') {
            const trustedCertificatesFromConfig = agentContext.dependencyManager.resolve(x509_1.X509ModuleConfig).trustedCertificates ?? [];
            const trustedCertificates = options.trustedCertificates ?? trustedCertificatesFromConfig;
            if (trustedCertificates.length === 0) {
                throw new error_1.CredoError(`trustedCertificates is required when the JWS protected header contains an 'x5c' property.`);
            }
            await X509Service_1.X509Service.validateCertificateChain(agentContext, {
                certificateChain: jwsSigner.x5c,
                trustedCertificates,
            });
        }
    }
    async jwsSignerFromJws(agentContext, options) {
        const { protectedHeader, resolveJwsSigner, jws, payload, allowedJwsSignerMethods } = options;
        const alg = protectedHeader.alg;
        if (!(0, jwa_1.isKnownJwaSignatureAlgorithm)(alg)) {
            throw new error_1.CredoError(`Unsupported JWA signature algorithm '${protectedHeader.alg}'`);
        }
        if (protectedHeader.x5c && allowedJwsSignerMethods.includes('x5c')) {
            if (!Array.isArray(protectedHeader.x5c) ||
                protectedHeader.x5c.some((certificate) => typeof certificate !== 'string')) {
                throw new error_1.CredoError('x5c header is not a valid JSON array of strings.');
            }
            const certificate = X509Service_1.X509Service.getLeafCertificate(agentContext, {
                certificateChain: protectedHeader.x5c,
            });
            return {
                method: 'x5c',
                jwk: certificate.publicJwk,
                x5c: protectedHeader.x5c,
            };
        }
        // Jwk
        if (protectedHeader.jwk && allowedJwsSignerMethods.includes('jwk')) {
            if (!(0, types_1.isJsonObject)(protectedHeader.jwk))
                throw new error_1.CredoError('JWK is not a valid JSON object.');
            const protectedJwk = kms_1.PublicJwk.fromUnknown(protectedHeader.jwk);
            return {
                method: 'jwk',
                jwk: protectedJwk,
            };
        }
        if (!resolveJwsSigner) {
            throw new error_1.CredoError(`resolveJwsSigner is required for resolving jws signers other than 'jwk' and 'x5c'.`);
        }
        try {
            const jwsSigner = await resolveJwsSigner({
                jws,
                protectedHeader: {
                    ...protectedHeader,
                    alg,
                },
                payload,
            });
            if (!allowedJwsSignerMethods.includes(jwsSigner.method)) {
                throw new error_1.CredoError(`resolveJwsSigner returned jws signer with method '${jwsSigner.method}', but allowed jws signer methods are ${allowedJwsSignerMethods.join(', ')}.`);
            }
            return jwsSigner;
        }
        catch (error) {
            throw new error_1.CredoError(`Error when resolving jws signer for jws in resolveJwsSigner. ${error.message}`, {
                cause: error,
            });
        }
    }
};
exports.JwsService = JwsService;
exports.JwsService = JwsService = __decorate([
    (0, plugins_1.injectable)()
], JwsService);
//# sourceMappingURL=JwsService.js.map