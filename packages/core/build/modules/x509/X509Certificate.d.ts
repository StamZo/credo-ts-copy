import type { AgentContext } from '../../agent';
import type { X509CreateCertificateOptions } from './X509ServiceOptions';
import * as x509 from '@peculiar/x509';
import { CredoWebCrypto } from '../../crypto/webcrypto';
import { PublicJwk } from '../kms';
export declare enum X509KeyUsage {
    DigitalSignature = 1,
    NonRepudiation = 2,
    KeyEncipherment = 4,
    DataEncipherment = 8,
    KeyAgreement = 16,
    KeyCertSign = 32,
    CrlSign = 64,
    EncipherOnly = 128,
    DecipherOnly = 256
}
export declare enum X509ExtendedKeyUsage {
    ServerAuth = "1.3.6.1.5.5.7.3.1",
    ClientAuth = "1.3.6.1.5.5.7.3.2",
    CodeSigning = "1.3.6.1.5.5.7.3.3",
    EmailProtection = "1.3.6.1.5.5.7.3.4",
    TimeStamping = "1.3.6.1.5.5.7.3.8",
    OcspSigning = "1.3.6.1.5.5.7.3.9",
    MdlDs = "1.0.18013.5.1.2"
}
export type X509CertificateOptions = {
    publicJwk: PublicJwk;
    privateKey?: Uint8Array;
    x509Certificate: x509.X509Certificate;
};
export declare class X509Certificate {
    publicJwk: PublicJwk;
    privateKey?: Uint8Array;
    private x509Certificate;
    private constructor();
    set keyId(keyId: string);
    get keyId(): string;
    get hasKeyId(): boolean;
    static fromRawCertificate(rawCertificate: Uint8Array): X509Certificate;
    static fromEncodedCertificate(encodedCertificate: string): X509Certificate;
    private static parseCertificate;
    private getMatchingExtensions;
    get rawCertificate(): Uint8Array<ArrayBuffer>;
    get subjectAlternativeNames(): {
        type: x509.GeneralNameType;
        value: string;
    }[];
    get issuerAlternativeNames(): {
        type: x509.GeneralNameType;
        value: string;
    }[];
    get sanDnsNames(): string[];
    get sanUriNames(): string[];
    get ianDnsNames(): string[];
    get ianUriNames(): string[];
    get authorityKeyIdentifier(): string | undefined;
    get subjectKeyIdentifier(): string | undefined;
    get keyUsage(): X509KeyUsage[] | undefined;
    get extendedKeyUsage(): X509ExtendedKeyUsage | undefined;
    isExtensionCritical(id: string): boolean;
    static create(options: X509CreateCertificateOptions, webCrypto: CredoWebCrypto): Promise<X509Certificate>;
    get subject(): string;
    get issuer(): string;
    verify({ verificationDate, publicJwk, skipSignatureVerification, }: {
        verificationDate: Date;
        publicJwk?: PublicJwk;
        /**
         * Whether to skip the verification of the signature and only perform other checks (such
         * as whether the certificate is not expired).
         *
         * This can be useful when an non-self-signed certificate is directly trusted, and it may
         * not be possible to verify the certifcate as the root/intermediate certificate containing
         * the key of the signer/intermediate is not present.
         *
         * @default false
         */
        skipSignatureVerification?: boolean;
    }, webCrypto: CredoWebCrypto): Promise<void>;
    /**
     * Get the thumprint of the X509 certificate in hex format.
     */
    getThumprintInHex(agentContext: AgentContext): Promise<string>;
    /**
     * Get the data elements of the x509 certificate
     */
    get data(): {
        issuerName: string;
        issuer: string;
        subjectName: string;
        subject: string;
        serialNumber: string;
        pem: string;
        notBefore: Date;
        notAfter: Date;
    };
    getIssuerNameField(field: string): string[];
    /**
     * @param format the format to export to, defaults to `pem`
     */
    toString(format?: 'asn' | 'pem' | 'hex' | 'base64' | 'text' | 'base64url'): string;
    private toJSON;
    equal(certificate: X509Certificate): boolean;
}
