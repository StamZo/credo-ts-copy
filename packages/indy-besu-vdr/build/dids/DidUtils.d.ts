import { Buffer, DidCreateResult, VerificationMethod } from '@credo-ts/core';
export declare const VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_RECOVERY_2020 = "EcdsaSecp256k1RecoveryMethod2020";
export declare const CONTEXT_SECURITY_SUITES_ED25519_2018_V1 = "https://w3id.org/security/suites/ed25519-2018/v1";
export declare enum VerificationKeyType {
    Ed25519VerificationKey2018 = 0,
    X25519KeyAgreementKey2020 = 1,
    EcdsaSecp256k1RecoveryMethod2020 = 2
}
export declare enum VerificationKeyPurpose {
    AssertionMethod = 0,
    Authentication = 1,
    keyAgreement = 2
}
export interface VerificationKey {
    type: VerificationKeyType;
    key: any;
    purpose: VerificationKeyPurpose;
}
export interface IndyBesuEndpoint {
    type: string;
    endpoint: string;
}
export declare function buildDid(method: string, key: Buffer | Uint8Array): string;
export declare function getEcdsaSecp256k1RecoveryMethod2020({ id, key, controller, chainId }: {
    id: string;
    key: any;
    controller: string;
    chainId?: number;
}): VerificationMethod;
export declare function failedResult(reason: string): DidCreateResult;
export declare function getVerificationMaterialPropertyName(type: VerificationKeyType): string;
export declare function getVerificationMaterial(type: VerificationKeyType, key: any): string;
export declare function getVerificationPurpose(purpose: VerificationKeyPurpose): string;
export declare function getVerificationMethod(id: string, type: VerificationKeyType, key: any, controller: string): VerificationMethod;
export declare function getKeyContext(type: VerificationKeyType): "https://w3id.org/security/suites/ed25519-2018/v1" | "https://w3id.org/security/suites/x25519-2020/v1" | "https://w3id.org/security/suites/secp256k1recovery-2020/v2";
export declare function buildDidDocument(did: string, key: any, endpoints?: IndyBesuEndpoint[], verificationKeys?: VerificationKey[]): import("@credo-ts/core").DidDocument;
