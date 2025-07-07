import { KnownJwaSignatureAlgorithm } from '../kms';
export type MdocSupportedSignatureAlgorithm = (typeof mdocSupporteSignatureAlgorithms)[number];
export declare const mdocSupporteSignatureAlgorithms: ("ES256" | "ES384" | "ES512" | "EdDSA")[];
export declare function isMdocSupportedSignatureAlgorithm(alg: KnownJwaSignatureAlgorithm): alg is MdocSupportedSignatureAlgorithm;
