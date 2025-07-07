import { Buffer } from 'node:buffer';
import { Kms } from '@credo-ts/core';
export declare const nodeSupportedKeyAgreementAlgorithms: ("ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW")[];
type NodeSupportedKeyAgreementDecryptOptions = Kms.KmsKeyAgreementDecryptOptions & {
    algorithm: (typeof nodeSupportedKeyAgreementAlgorithms)[number];
};
type NodeSupportedKeyAgreementEncryptOptions = Kms.KmsKeyAgreementEncryptOptions & {
    algorithm: (typeof nodeSupportedKeyAgreementAlgorithms)[number];
};
export declare function deriveEncryptionKey(options: {
    keyAgreement: NodeSupportedKeyAgreementEncryptOptions;
    privateJwk: Kms.KmsJwkPrivateAsymmetric;
    encryption: Kms.KmsEncryptDataEncryption;
}): Promise<{
    contentEncryptionKey: {
        readonly kty: "oct";
        readonly k: string;
    };
    encryptedContentEncryptionKey?: undefined;
} | {
    encryptedContentEncryptionKey: {
        encrypted: Buffer<ArrayBuffer>;
    };
    contentEncryptionKey: {
        readonly kty: "oct";
        readonly k: string;
    };
}>;
export declare function deriveDecryptionKey(options: {
    keyAgreement: NodeSupportedKeyAgreementDecryptOptions;
    privateJwk: Kms.KmsJwkPrivateAsymmetric;
    decryption: Kms.KmsDecryptDataDecryption;
}): Promise<{
    contentEncryptionKey: {
        readonly kty: "oct";
        readonly k: string;
    };
} | {
    contentEncryptionKey: Kms.KmsJwkPrivate;
}>;
export {};
