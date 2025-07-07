import { Kms } from '@credo-ts/core';
import { Key } from '@openwallet-foundation/askar-shared';
export declare const askarSupportedKeyAgreementAlgorithms: ("ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A256KW" | "ECDH-HSALSA20")[];
type AskarSupportedKeyAgreementEncryptOptions = Kms.KmsKeyAgreementEncryptOptions & {
    algorithm: (typeof askarSupportedKeyAgreementAlgorithms)[number];
};
type AskarSupportedKeyAgreementDecryptOptions = Kms.KmsKeyAgreementDecryptOptions & {
    algorithm: (typeof askarSupportedKeyAgreementAlgorithms)[number];
};
export declare function deriveEncryptionKey(options: {
    keyAgreement: AskarSupportedKeyAgreementEncryptOptions;
    senderKey: Key;
    recipientKey: Key;
    encryption: Kms.KmsEncryptDataEncryption;
}): {
    contentEncryptionKey: Key;
    encryptedContentEncryptionKey: {
        encrypted: Uint8Array<ArrayBuffer>;
        tag?: Uint8Array<ArrayBuffer> | undefined;
        iv?: Uint8Array<ArrayBuffer> | undefined;
    } | undefined;
};
export declare function deriveDecryptionKey(options: {
    keyAgreement: AskarSupportedKeyAgreementDecryptOptions;
    senderKey: Key;
    recipientKey: Key;
    decryption: Kms.KmsDecryptDataDecryption;
}): {
    contentEncryptionKey: Key;
};
export {};
