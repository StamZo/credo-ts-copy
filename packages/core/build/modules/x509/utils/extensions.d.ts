import type { X509CertificateExtensionsOptions } from '../X509ServiceOptions';
import { AuthorityKeyIdentifierExtension, BasicConstraintsExtension, CRLDistributionPointsExtension, ExtendedKeyUsageExtension, KeyUsagesExtension, SubjectAlternativeNameExtension, SubjectKeyIdentifierExtension } from '@peculiar/x509';
import { PublicJwk } from '../../kms';
import { IssuerAlternativeNameExtension } from '../extensions';
export declare const createSubjectKeyIdentifierExtension: (options: X509CertificateExtensionsOptions["subjectKeyIdentifier"], additionalOptions: {
    publicJwk: PublicJwk;
}) => SubjectKeyIdentifierExtension | undefined;
export declare const createKeyUsagesExtension: (options: X509CertificateExtensionsOptions["keyUsage"]) => KeyUsagesExtension | undefined;
export declare const createExtendedKeyUsagesExtension: (options: X509CertificateExtensionsOptions["extendedKeyUsage"]) => ExtendedKeyUsageExtension | undefined;
export declare const createAuthorityKeyIdentifierExtension: (options: X509CertificateExtensionsOptions["authorityKeyIdentifier"], additionalOptions: {
    publicJwk: PublicJwk;
}) => AuthorityKeyIdentifierExtension | undefined;
export declare const createIssuerAlternativeNameExtension: (options: X509CertificateExtensionsOptions["issuerAlternativeName"]) => IssuerAlternativeNameExtension | undefined;
export declare const createSubjectAlternativeNameExtension: (options: X509CertificateExtensionsOptions["subjectAlternativeName"]) => SubjectAlternativeNameExtension | undefined;
export declare const createBasicConstraintsExtension: (options: X509CertificateExtensionsOptions["basicConstraints"]) => BasicConstraintsExtension | undefined;
export declare const createCrlDistributionPointsExtension: (options: X509CertificateExtensionsOptions["crlDistributionPoints"]) => CRLDistributionPointsExtension | undefined;
