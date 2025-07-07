"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOid4vcJwtVerifyCallback = getOid4vcJwtVerifyCallback;
exports.getOid4vcEncryptJweCallback = getOid4vcEncryptJweCallback;
exports.getOid4vcDecryptJweCallback = getOid4vcDecryptJweCallback;
exports.getOid4vcJwtSignCallback = getOid4vcJwtSignCallback;
exports.getOid4vcCallbacks = getOid4vcCallbacks;
exports.dynamicOid4vciClientAuthentication = dynamicOid4vciClientAuthentication;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const oauth2_1 = require("@openid4vc/oauth2");
const utils_1 = require("./utils");
function getOid4vcJwtVerifyCallback(agentContext, options) {
    const jwsService = agentContext.dependencyManager.resolve(core_2.JwsService);
    return async (signer, { compact, header, payload }) => {
        let trustedCertificates = options?.trustedCertificates;
        if (signer.method === 'x5c' &&
            (header.typ === 'oauth-authz-req+jwt' || options?.isAuthorizationRequestJwt) &&
            !trustedCertificates) {
            const x509Config = agentContext.dependencyManager.resolve(core_2.X509ModuleConfig);
            const certificateChain = signer.x5c?.map((cert) => core_2.X509Certificate.fromEncodedCertificate(cert));
            trustedCertificates = await x509Config.getTrustedCertificatesForVerification?.(agentContext, {
                certificateChain,
                verification: {
                    type: 'oauth2SecuredAuthorizationRequest',
                    authorizationRequest: {
                        jwt: compact,
                        payload: core_2.JwtPayload.fromJson(payload),
                    },
                },
            });
        }
        if (signer.method === 'x5c' &&
            (header.typ === 'keyattestation+jwt' || header.typ === 'key-attestation+jwt') &&
            options?.issuanceSessionId &&
            !trustedCertificates) {
            const x509Config = agentContext.dependencyManager.resolve(core_2.X509ModuleConfig);
            const certificateChain = signer.x5c?.map((cert) => core_2.X509Certificate.fromEncodedCertificate(cert));
            trustedCertificates = await x509Config.getTrustedCertificatesForVerification?.(agentContext, {
                certificateChain,
                verification: {
                    type: 'openId4VciKeyAttestation',
                    openId4VcIssuanceSessionId: options.issuanceSessionId,
                    keyAttestation: {
                        jwt: compact,
                        payload: core_2.JwtPayload.fromJson(payload),
                    },
                },
            });
        }
        if (signer.method === 'x5c' &&
            header.typ === 'oauth-client-attestation+jwt' &&
            options?.issuanceSessionId &&
            !trustedCertificates) {
            const x509Config = agentContext.dependencyManager.resolve(core_2.X509ModuleConfig);
            const certificateChain = signer.x5c?.map((cert) => core_2.X509Certificate.fromEncodedCertificate(cert));
            trustedCertificates = await x509Config.getTrustedCertificatesForVerification?.(agentContext, {
                certificateChain,
                verification: {
                    type: 'oauth2ClientAttestation',
                    openId4VcIssuanceSessionId: options.issuanceSessionId,
                    clientAttestation: {
                        jwt: compact,
                        payload: core_2.JwtPayload.fromJson(payload),
                    },
                },
            });
        }
        const alg = signer.alg;
        if (!Object.values(core_1.Kms.KnownJwaSignatureAlgorithms).includes(alg)) {
            throw new core_2.CredoError(`Unsupported jwa signatre algorithm '${alg}'`);
        }
        const jwsSigner = signer.method === 'did'
            ? {
                method: 'did',
                didUrl: signer.didUrl,
                jwk: await (0, utils_1.getPublicJwkFromDid)(agentContext, signer.didUrl),
            }
            : signer.method === 'jwk'
                ? {
                    method: 'jwk',
                    jwk: core_1.Kms.PublicJwk.fromUnknown(signer.publicJwk),
                }
                : signer.method === 'x5c'
                    ? {
                        method: 'x5c',
                        x5c: signer.x5c,
                        jwk: core_2.X509Certificate.fromEncodedCertificate(signer.x5c[0]).publicJwk,
                    }
                    : undefined;
        if (!jwsSigner) {
            throw new core_2.CredoError(`Unable to verify jws with unsupported jws signer method '${signer.method}'`);
        }
        const { isValid, jwsSigners } = await jwsService.verifyJws(agentContext, {
            jws: compact,
            trustedCertificates,
            jwsSigner,
        });
        if (!isValid) {
            return { verified: false, signerJwk: undefined };
        }
        const signerJwk = jwsSigners[0].jwk.toJson();
        return { verified: true, signerJwk };
    };
}
function getOid4vcEncryptJweCallback(agentContext) {
    const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
    return async (jweEncryptor, compact) => {
        if (jweEncryptor.method !== 'jwk') {
            throw new core_2.CredoError(`Jwt encryption method '${jweEncryptor.method}' is not supported for jwt signer. Only 'jwk' is supported.`);
        }
        // TODO: we should probably add a key id or ference to the jweEncryptor/jwsSigner in
        // oid4vc-ts so we can keep a reference to the key
        const jwk = core_1.Kms.PublicJwk.fromUnknown(jweEncryptor.publicJwk);
        if (!jwk.hasKeyId) {
            throw new core_2.CredoError('Expected kid to be defined on the JWK');
        }
        if (jweEncryptor.alg !== 'ECDH-ES') {
            throw new core_2.CredoError("Only 'ECDH-ES' is supported as 'alg' value for JARM response encryption");
        }
        if (jweEncryptor.enc !== 'A256GCM' && jweEncryptor.enc !== 'A128GCM' && jweEncryptor.enc !== 'A128CBC-HS256') {
            throw new core_2.CredoError("Only 'A256GCM', 'A128GCM', and 'A128CBC-HS256' is supported as 'enc' value for JARM response encryption");
        }
        const jwkJson = jwk.toJson();
        if (jwkJson.kty !== 'EC' && jwkJson.kty !== 'OKP') {
            throw new core_2.CredoError(`Expected EC or OKP jwk for encryption, found ${core_1.Kms.getJwkHumanDescription(jwkJson)}`);
        }
        if (jwkJson.crv === 'Ed25519') {
            throw new core_2.CredoError(`Expected ${jwkJson.kty} with crv X25519, found ${core_1.Kms.getJwkHumanDescription(jwkJson)}`);
        }
        // TODO: create a JWE service that handles this
        const ephmeralKey = await kms.createKey({
            type: jwkJson,
        });
        try {
            const header = {
                kid: jweEncryptor.publicJwk.kid,
                apu: jweEncryptor.apu,
                apv: jweEncryptor.apv,
                enc: jweEncryptor.enc,
                alg: 'ECDH-ES',
                epk: ephmeralKey.publicJwk,
            };
            const encodedHeader = core_2.JsonEncoder.toBase64URL(header);
            const encrypted = await kms.encrypt({
                key: {
                    keyAgreement: {
                        // FIXME: We can make the keyId optional for ECDH-ES
                        // That way we don't have to store the key
                        keyId: ephmeralKey.keyId,
                        algorithm: 'ECDH-ES',
                        apu: jweEncryptor.apu ? core_2.TypedArrayEncoder.fromBase64(jweEncryptor.apu) : undefined,
                        apv: jweEncryptor.apv ? core_2.TypedArrayEncoder.fromBase64(jweEncryptor.apv) : undefined,
                        externalPublicJwk: jwkJson,
                    },
                },
                data: core_2.Buffer.from(compact),
                encryption: {
                    algorithm: jweEncryptor.enc,
                    aad: core_2.Buffer.from(encodedHeader),
                },
            });
            if (!encrypted.iv || !encrypted.tag) {
                throw new core_2.CredoError("Expected 'iv' and 'tag' to be defined");
            }
            const compactJwe = `${encodedHeader}..${core_2.TypedArrayEncoder.toBase64URL(encrypted.iv)}.${core_2.TypedArrayEncoder.toBase64URL(encrypted.encrypted)}.${core_2.TypedArrayEncoder.toBase64URL(encrypted.tag)}`;
            return { encryptionJwk: jweEncryptor.publicJwk, jwe: compactJwe };
        }
        finally {
            // Delete the key
            await kms.deleteKey({
                keyId: ephmeralKey.keyId,
            });
        }
    };
}
function getOid4vcDecryptJweCallback(agentContext) {
    const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
    return async (jwe, options) => {
        // TODO: use custom header zod schema to limit which algorithms can be used
        const { header } = (0, oauth2_1.decodeJwtHeader)({ jwt: jwe });
        let kid = options?.jwk?.kid ?? header.kid;
        if (!kid) {
            throw new core_2.CredoError('Uanbel to decrypt jwe. No kid or jwk found');
        }
        // Previously we used the fingerprint as the kid for JARM
        // We try to parse it as fingerprint if it starts with z (base58 encoding)
        // It's not 100%
        if (kid.startsWith('z')) {
            try {
                const publicJwk = core_1.Kms.PublicJwk.fromFingerprint(kid);
                if (publicJwk)
                    kid = publicJwk.legacyKeyId;
            }
            catch {
                // no-op
            }
        }
        // TODO: decodeJwe method in oid4vc-ts
        // encryption key is not used (we don't use key wrapping)
        const [encodedHeader /* encryptionKey */, , encodedIv, encodedCiphertext, encodedTag] = jwe.split('.');
        if (header.alg !== 'ECDH-ES') {
            throw new core_2.CredoError("Only 'ECDH-ES' is supported as 'alg' value for JARM response decryption");
        }
        if (header.enc !== 'A256GCM' && header.enc !== 'A128GCM' && header.enc !== 'A128CBC-HS256') {
            throw new core_2.CredoError("Only 'A256GCM', 'A128GCM', and 'A128CBC-HS256' is supported as 'enc' value for JARM response decryption");
        }
        let decryptedPayload;
        let publicJwk;
        const epk = core_1.Kms.PublicJwk.fromUnknown(header.epk);
        try {
            const decrypted = await kms.decrypt({
                encrypted: core_2.TypedArrayEncoder.fromBase64(encodedCiphertext),
                decryption: {
                    algorithm: header.enc,
                    // aad is the base64 encoded bytes (not just the bytes)
                    aad: core_2.TypedArrayEncoder.fromString(encodedHeader),
                    iv: core_2.TypedArrayEncoder.fromBase64(encodedIv),
                    tag: core_2.TypedArrayEncoder.fromBase64(encodedTag),
                },
                key: {
                    keyAgreement: {
                        algorithm: header.alg,
                        externalPublicJwk: epk.toJson(),
                        keyId: kid,
                        apu: typeof header.apu === 'string' ? core_2.TypedArrayEncoder.fromBase64(header.apu) : undefined,
                        apv: typeof header.apv === 'string' ? core_2.TypedArrayEncoder.fromBase64(header.apv) : undefined,
                    },
                },
            });
            // TODO: decrypt should return the public jwk instance
            publicJwk = core_1.Kms.PublicJwk.fromUnknown(await kms.getPublicKey({
                keyId: kid,
            }));
            decryptedPayload = core_2.TypedArrayEncoder.toUtf8String(decrypted.data);
        }
        catch (error) {
            agentContext.config.logger.error('Error decrypting JWE', {
                error,
            });
            return {
                decrypted: false,
                encryptionJwk: options?.jwk,
                payload: undefined,
                header,
            };
        }
        return {
            decrypted: true,
            decryptionJwk: publicJwk.toJson(),
            payload: decryptedPayload,
            header,
        };
    };
}
function getOid4vcJwtSignCallback(agentContext) {
    const jwsService = agentContext.dependencyManager.resolve(core_2.JwsService);
    return async (signer, { payload, header }) => {
        if (signer.method === 'custom' || signer.method === 'federation') {
            throw new core_2.CredoError(`Jwt signer method 'custom' and 'federation' are not supported for jwt signer.`);
        }
        if (signer.method === 'x5c') {
            const leafCertificate = core_2.X509Service.getLeafCertificate(agentContext, { certificateChain: signer.x5c });
            const jws = await jwsService.createJwsCompact(agentContext, {
                protectedHeaderOptions: { ...header, alg: signer.alg, jwk: undefined },
                payload: core_2.JwtPayload.fromJson(payload),
                keyId: signer.kid ?? leafCertificate.publicJwk.keyId,
            });
            return { jwt: jws, signerJwk: leafCertificate.publicJwk.toJson() };
        }
        // TOOD: createJwsCompact should return the Jwk, so we don't have to reoslve it here
        const publicJwk = signer.method === 'did'
            ? await (0, utils_1.getPublicJwkFromDid)(agentContext, signer.didUrl)
            : core_1.Kms.PublicJwk.fromUnknown(signer.publicJwk);
        if (!publicJwk.supportedSignatureAlgorithms.includes(signer.alg)) {
            throw new core_2.CredoError(`jwk ${publicJwk.jwkTypehumanDescription} does not support JWS signature alg '${signer.alg}'`);
        }
        const jwt = await jwsService.createJwsCompact(agentContext, {
            protectedHeaderOptions: {
                ...header,
                jwk: header.jwk ? publicJwk : undefined,
                alg: signer.alg,
            },
            payload: core_2.JsonEncoder.toBuffer(payload),
            keyId: signer.kid ?? publicJwk.keyId,
        });
        return { jwt, signerJwk: publicJwk.toJson() };
    };
}
function getOid4vcCallbacks(agentContext, options) {
    const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
    return {
        hash: (data, alg) => core_2.Hasher.hash(data, alg.toLowerCase()),
        generateRandom: (length) => kms.randomBytes({ length }),
        signJwt: getOid4vcJwtSignCallback(agentContext),
        clientAuthentication: () => {
            throw new core_2.CredoError('Did not expect client authentication to be called.');
        },
        verifyJwt: getOid4vcJwtVerifyCallback(agentContext, {
            trustedCertificates: options?.trustedCertificates,
            isAuthorizationRequestJwt: options?.isVerifyOpenId4VpAuthorizationRequest,
            issuanceSessionId: options?.issuanceSessionId,
        }),
        fetch: agentContext.config.agentDependencies.fetch,
        encryptJwe: getOid4vcEncryptJweCallback(agentContext),
        decryptJwe: getOid4vcDecryptJweCallback(agentContext),
        getX509CertificateMetadata: (certificate) => {
            const leafCertificate = core_2.X509Service.getLeafCertificate(agentContext, { certificateChain: [certificate] });
            return {
                sanDnsNames: leafCertificate.sanDnsNames,
                sanUriNames: leafCertificate.sanUriNames,
            };
        },
    };
}
/**
 * Allows us to authenticate when making requests to an external
 * authorizatin server
 */
function dynamicOid4vciClientAuthentication(agentContext, issuerRecord) {
    return (callbackOptions) => {
        const authorizationServer = issuerRecord.authorizationServerConfigs?.find((a) => a.issuer === callbackOptions.authorizationServerMetadata.issuer);
        if (!authorizationServer) {
            // No client authentication if authorization server is not configured
            agentContext.config.logger.debug(`Unknown authorization server '${callbackOptions.authorizationServerMetadata.issuer}' for issuer '${issuerRecord.issuerId}' for request to '${callbackOptions.url}'`);
            return;
        }
        if (!authorizationServer.clientAuthentication) {
            throw new core_2.CredoError(`Unable to authenticate to authorization server '${authorizationServer.issuer}' for issuer '${issuerRecord.issuerId}' for request to '${callbackOptions.url}'. Make sure to configure a 'clientId' and 'clientSecret' for the authorization server on the issuer record.`);
        }
        return (0, oauth2_1.clientAuthenticationDynamic)({
            clientId: authorizationServer.clientAuthentication.clientId,
            clientSecret: authorizationServer.clientAuthentication.clientSecret,
        })(callbackOptions);
    };
}
//# sourceMappingURL=callbacks.js.map