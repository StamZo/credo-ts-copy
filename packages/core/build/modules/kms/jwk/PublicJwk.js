"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicJwk = exports.SupportedPublicJwks = void 0;
const error_1 = require("../../../error");
const utils_1 = require("../../../utils");
const zod_1 = require("../../../utils/zod");
const KeyManagementError_1 = require("../error/KeyManagementError");
const legacy_1 = require("../legacy");
const equals_1 = require("./equals");
const humanDescription_1 = require("./humanDescription");
const knownJwk_1 = require("./knownJwk");
const kty_1 = require("./kty");
exports.SupportedPublicJwks = [
    kty_1.Ed25519PublicJwk,
    kty_1.P256PublicJwk,
    kty_1.P384PublicJwk,
    kty_1.P521PublicJwk,
    kty_1.RsaPublicJwk,
    kty_1.Secp256k1PublicJwk,
    kty_1.X25519PublicJwk,
];
class PublicJwk {
    constructor(jwk) {
        this.jwk = jwk;
    }
    static fromUnknown(jwkJson) {
        // We remove any private properties if they are present
        const publicJwk = (0, knownJwk_1.publicJwkFromPrivateJwk)((0, zod_1.parseWithErrorHandling)(knownJwk_1.zKmsJwkPublic, jwkJson, 'jwk is not a valid jwk'));
        (0, knownJwk_1.assertJwkAsymmetric)(publicJwk);
        let jwkInstance;
        if (publicJwk.kty === 'RSA') {
            jwkInstance = new kty_1.RsaPublicJwk(publicJwk);
        }
        else if (publicJwk.kty === 'EC') {
            if (publicJwk.crv === 'P-256') {
                jwkInstance = new kty_1.P256PublicJwk({
                    ...publicJwk,
                    crv: publicJwk.crv,
                });
            }
            else if (publicJwk.crv === 'P-384') {
                jwkInstance = new kty_1.P384PublicJwk({
                    ...publicJwk,
                    crv: publicJwk.crv,
                });
            }
            else if (publicJwk.crv === 'P-521') {
                jwkInstance = new kty_1.P521PublicJwk({
                    ...publicJwk,
                    crv: publicJwk.crv,
                });
            }
            else if (publicJwk.crv === 'secp256k1') {
                jwkInstance = new kty_1.Secp256k1PublicJwk({
                    ...publicJwk,
                    crv: publicJwk.crv,
                });
            }
            else {
                throw new KeyManagementError_1.KeyManagementError(`Unsupported kty '${publicJwk.kty}' with crv '${publicJwk.crv}' for creating jwk instance`);
            }
        }
        else if (publicJwk.crv === 'Ed25519') {
            jwkInstance = new kty_1.Ed25519PublicJwk({
                ...publicJwk,
                crv: publicJwk.crv,
            });
        }
        else if (publicJwk.crv === 'X25519') {
            jwkInstance = new kty_1.X25519PublicJwk({
                ...publicJwk,
                crv: publicJwk.crv,
            });
        }
        else {
            throw new KeyManagementError_1.KeyManagementError(`Unsupported kty '${publicJwk.kty}' for creating jwk instance`);
        }
        return new PublicJwk(jwkInstance);
    }
    // FIXME: all Jwk combinations should be separate types.
    // so not kty: EC, and crv: P-256 | P-384
    // but: kty: EC, and crv: P-256 | kty: EC, and crv: P-384
    // As the first appraoch messes with TypeScript's type inference
    static fromPublicJwk(jwk) {
        return PublicJwk.fromUnknown(jwk);
    }
    toJson({ includeKid = true } = {}) {
        if (includeKid)
            return this.jwk.jwk;
        const { kid, ...jwk } = this.jwk.jwk;
        return jwk;
    }
    get supportedSignatureAlgorithms() {
        return this.jwk.supportedSignatureAlgorithms ?? [];
    }
    get supportdEncryptionKeyAgreementAlgorithms() {
        return this.jwk.supportdEncryptionKeyAgreementAlgorithms ?? [];
    }
    /**
     * key type as defined in [JWA Specification](https://tools.ietf.org/html/rfc7518#section-6.1)
     */
    get kty() {
        return this.jwk.jwk.kty;
    }
    /**
     * Get the key id for a public jwk. If the public jwk does not have
     */
    get keyId() {
        if (this.jwk.jwk.kid)
            return this.jwk.jwk.kid;
        throw new KeyManagementError_1.KeyManagementError('Unable to determine keyId for jwk');
    }
    get hasKeyId() {
        return this.jwk.jwk.kid !== undefined;
    }
    set keyId(keyId) {
        this.jwk.jwk.kid = keyId;
    }
    get legacyKeyId() {
        return (0, legacy_1.legacyKeyIdFromPublicJwk)(this);
    }
    get publicKey() {
        return this.jwk.publicKey;
    }
    get JwkClass() {
        return this.jwk.constructor;
    }
    /**
     * Get the signature algorithm to use with this jwk. If the jwk has an `alg` field defined
     * it will use that alg, and otherwise fall back to the first supported signature algorithm.
     *
     * If no algorithm is supported it will throw an error
     */
    get signatureAlgorithm() {
        if (this.jwk.jwk.alg) {
            if (!this.supportedSignatureAlgorithms.includes(this.jwk.jwk.alg)) {
                throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(this.jwk.jwk)} defines alg '${this.jwk.jwk.alg}' but this alg is not supported.`);
            }
            return this.jwk.jwk.alg;
        }
        const alg = this.supportedSignatureAlgorithms[0];
        if (!alg) {
            throw new KeyManagementError_1.KeyManagementError(`${(0, humanDescription_1.getJwkHumanDescription)(this.jwk.jwk)} has no supported signature algorithms`);
        }
        return alg;
    }
    static fromPublicKey(publicKey) {
        let jwkInstance;
        if (publicKey.kty === 'RSA') {
            jwkInstance = kty_1.RsaPublicJwk.fromPublicKey(publicKey);
        }
        else if (publicKey.kty === 'EC') {
            if (publicKey.crv === 'P-256') {
                jwkInstance = kty_1.P256PublicJwk.fromPublicKey(publicKey.publicKey);
            }
            else if (publicKey.crv === 'P-384') {
                jwkInstance = kty_1.P384PublicJwk.fromPublicKey(publicKey.publicKey);
            }
            else if (publicKey.crv === 'P-521') {
                jwkInstance = kty_1.P521PublicJwk.fromPublicKey(publicKey.publicKey);
            }
            else if (publicKey.crv === 'secp256k1') {
                jwkInstance = kty_1.Secp256k1PublicJwk.fromPublicKey(publicKey.publicKey);
            }
            else {
                throw new KeyManagementError_1.KeyManagementError(
                // @ts-expect-error
                `Unsupported kty '${publicKey.kty}' with crv '${publicKey.crv}' for creating jwk instance based on public key bytes`);
            }
        }
        else if (publicKey.crv === 'X25519') {
            jwkInstance = kty_1.X25519PublicJwk.fromPublicKey(publicKey.publicKey);
        }
        else if (publicKey.crv === 'Ed25519') {
            jwkInstance = kty_1.Ed25519PublicJwk.fromPublicKey(publicKey.publicKey);
        }
        else {
            throw new KeyManagementError_1.KeyManagementError(
            // @ts-expect-error
            `Unsupported kty '${publicKey.kty}' for creating jwk instance based on public key bytes`);
        }
        return new PublicJwk(jwkInstance);
    }
    /**
     * Returns the jwk encoded a Base58 multibase encoded multicodec key
     */
    get fingerprint() {
        const prefixBytes = utils_1.VarintEncoder.encode(this.jwk.multicodecPrefix);
        const prefixedPublicKey = new Uint8Array([...prefixBytes, ...this.jwk.multicodec]);
        return `z${utils_1.TypedArrayEncoder.toBase58(prefixedPublicKey)}`;
    }
    /**
     * Create a jwk instance based on a Base58 multibase encoded multicodec key
     */
    static fromFingerprint(fingerprint) {
        const { data } = utils_1.MultiBaseEncoder.decode(fingerprint);
        const [code, byteLength] = utils_1.VarintEncoder.decode(data);
        const publicKey = data.slice(byteLength);
        const PublicJwkClass = exports.SupportedPublicJwks.find((JwkClass) => JwkClass.multicodecPrefix === code);
        if (!PublicJwkClass) {
            throw new KeyManagementError_1.KeyManagementError(`Unsupported multicodec public key with prefix '${code}'`);
        }
        const jwk = PublicJwkClass.fromMulticodec(publicKey);
        return new PublicJwk(jwk);
    }
    /**
     * Check whether this PublicJwk instance is of a specific type
     */
    is(jwkType1, jwkType2, jwkType3) {
        const types = [jwkType1, jwkType2, jwkType3].filter(Boolean);
        return types.some((type) => this.jwk.constructor === type);
    }
    /**
     * Convert the PublicJwk to another type.
     *
     * NOTE: only supportedf or Ed25519 to X25519 at the moment
     */
    convertTo(type) {
        if (!this.is(kty_1.Ed25519PublicJwk) || type !== kty_1.X25519PublicJwk) {
            throw new KeyManagementError_1.KeyManagementError('Unsupported key conversion. Only Ed25519 to X25519 is supported.');
        }
        return PublicJwk.fromPublicJwk(this.jwk.toX25519PublicJwk());
    }
    /**
     * Check whether this jwk instance is the same as another jwk instance.
     * It does this by comparing the key types and public keys, not other fields
     * of the JWK such as keyId, use, etc..
     */
    equals(other) {
        return (0, equals_1.assymetricPublicJwkMatches)(this.toJson(), other.toJson());
    }
    toJSON() {
        return {
            jwk: this.jwk,
        };
    }
    /**
     * Get human description of a jwk type. This does
     * not include the (public) key material
     */
    get jwkTypehumanDescription() {
        return (0, humanDescription_1.getJwkHumanDescription)(this.toJson());
    }
    static supportedPublicJwkClassForSignatureAlgorithm(alg) {
        const supportedPublicJwkClass = exports.SupportedPublicJwks.find((JwkClass) => JwkClass.supportedSignatureAlgorithms.includes(alg));
        if (!supportedPublicJwkClass) {
            throw new error_1.CredoError(`Could not determine supported public jwk class for alg '${alg}'`);
        }
        return supportedPublicJwkClass;
    }
}
exports.PublicJwk = PublicJwk;
//# sourceMappingURL=PublicJwk.js.map