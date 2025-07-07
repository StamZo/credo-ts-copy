import { Constructor } from '../../../utils/mixins';
import { KnownJwaKeyAgreementAlgorithm, KnownJwaSignatureAlgorithm } from './jwa';
import { KmsJwkPublicAsymmetric } from './knownJwk';
import { Ed25519PublicJwk, P256PublicJwk, P384PublicJwk, P521PublicJwk, RsaPublicJwk, Secp256k1PublicJwk, X25519PublicJwk } from './kty';
export declare const SupportedPublicJwks: (typeof P256PublicJwk | typeof P384PublicJwk | typeof P521PublicJwk | typeof Secp256k1PublicJwk | typeof X25519PublicJwk | typeof Ed25519PublicJwk | typeof RsaPublicJwk)[];
export type SupportedPublicJwkClass = (typeof SupportedPublicJwks)[number];
export type SupportedPublicJwk = Ed25519PublicJwk | P256PublicJwk | P384PublicJwk | P521PublicJwk | RsaPublicJwk | Secp256k1PublicJwk | X25519PublicJwk;
type ExtractByJwk<T, K> = T extends {
    jwk: infer J;
} ? (K extends J ? T : never) : never;
type ExtractByPublicKey<T, K> = T extends {
    publicKey: infer J;
} ? (K extends J ? T : never) : never;
export declare class PublicJwk<Jwk extends SupportedPublicJwk = SupportedPublicJwk> {
    private readonly jwk;
    private constructor();
    static fromUnknown(jwkJson: unknown): PublicJwk<SupportedPublicJwk>;
    static fromPublicJwk<Jwk extends KmsJwkPublicAsymmetric>(jwk: Jwk): PublicJwk<ExtractByJwk<SupportedPublicJwk, Jwk> extends never ? SupportedPublicJwk : ExtractByJwk<SupportedPublicJwk, Jwk>>;
    toJson({ includeKid }?: {
        includeKid?: boolean;
    }): Jwk['jwk'];
    get supportedSignatureAlgorithms(): KnownJwaSignatureAlgorithm[];
    get supportdEncryptionKeyAgreementAlgorithms(): KnownJwaKeyAgreementAlgorithm[];
    /**
     * key type as defined in [JWA Specification](https://tools.ietf.org/html/rfc7518#section-6.1)
     */
    get kty(): Jwk['jwk']['kty'];
    /**
     * Get the key id for a public jwk. If the public jwk does not have
     */
    get keyId(): string;
    get hasKeyId(): boolean;
    set keyId(keyId: string);
    get legacyKeyId(): string;
    get publicKey(): Jwk['publicKey'];
    get JwkClass(): SupportedPublicJwkClass;
    /**
     * Get the signature algorithm to use with this jwk. If the jwk has an `alg` field defined
     * it will use that alg, and otherwise fall back to the first supported signature algorithm.
     *
     * If no algorithm is supported it will throw an error
     */
    get signatureAlgorithm(): this["supportedSignatureAlgorithms"][number];
    static fromPublicKey<Supported extends SupportedPublicJwk['publicKey']>(publicKey: Supported): PublicJwk<ExtractByPublicKey<SupportedPublicJwk, Supported>>;
    /**
     * Returns the jwk encoded a Base58 multibase encoded multicodec key
     */
    get fingerprint(): string;
    /**
     * Create a jwk instance based on a Base58 multibase encoded multicodec key
     */
    static fromFingerprint(fingerprint: string): PublicJwk<Ed25519PublicJwk | P256PublicJwk | P384PublicJwk | P521PublicJwk | RsaPublicJwk | Secp256k1PublicJwk | X25519PublicJwk>;
    /**
     * Check whether this PublicJwk instance is of a specific type
     */
    is<Jwk1 extends SupportedPublicJwk, Jwk2 extends SupportedPublicJwk = Jwk1, Jwk3 extends SupportedPublicJwk = Jwk1>(jwkType1: Constructor<Jwk1>, jwkType2?: Constructor<Jwk2>, jwkType3?: Constructor<Jwk3>): this is PublicJwk<Jwk1> | PublicJwk<Jwk2> | PublicJwk<Jwk3>;
    /**
     * Convert the PublicJwk to another type.
     *
     * NOTE: only supportedf or Ed25519 to X25519 at the moment
     */
    convertTo(type: Jwk extends Ed25519PublicJwk ? typeof X25519PublicJwk : never): Jwk extends Ed25519PublicJwk ? PublicJwk<X25519PublicJwk> : never;
    /**
     * Check whether this jwk instance is the same as another jwk instance.
     * It does this by comparing the key types and public keys, not other fields
     * of the JWK such as keyId, use, etc..
     */
    equals(other: PublicJwk): boolean;
    private toJSON;
    /**
     * Get human description of a jwk type. This does
     * not include the (public) key material
     */
    get jwkTypehumanDescription(): string;
    static supportedPublicJwkClassForSignatureAlgorithm(alg: KnownJwaSignatureAlgorithm): SupportedPublicJwkClass;
}
export {};
