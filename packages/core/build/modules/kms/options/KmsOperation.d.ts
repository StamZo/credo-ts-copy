import { KmsJwkPrivate, KnownJwaSignatureAlgorithm } from '../jwk';
import { KmsCreateKeyType } from './KmsCreateKeyOptions';
import { KmsDecryptDataDecryption } from './KmsDecryptOptions';
import { KmsEncryptDataEncryption } from './KmsEncryptOptions';
import { KmsKeyAgreementDecryptOptions } from './KmsKeyAgreementDecryptOptions';
import { KmsKeyAgreementEncryptOptions } from './KmsKeyAgreementEncryptOptions';
export type KmsOperationCreateKey = {
    operation: 'createKey';
    type: KmsCreateKeyType;
};
export type KmsOperationImportKey = {
    operation: 'importKey';
    privateJwk: KmsJwkPrivate;
};
export type KmsOperationDeleteKey = {
    operation: 'deleteKey';
};
export type KmsOperationSign = {
    operation: 'sign';
    algorithm: KnownJwaSignatureAlgorithm;
};
export type KmsOperationVerify = {
    operation: 'verify';
    algorithm: KnownJwaSignatureAlgorithm;
};
export type KmsOperationEncrypt = {
    operation: 'encrypt';
    encryption: KmsEncryptDataEncryption;
    keyAgreement?: KmsKeyAgreementEncryptOptions;
};
export type KmsOperationDecrypt = {
    operation: 'decrypt';
    decryption: KmsDecryptDataDecryption;
    keyAgreement?: KmsKeyAgreementDecryptOptions;
};
export type KmsOperationRandomBytes = {
    operation: 'randomBytes';
};
export type KmsOperation = KmsOperationCreateKey | KmsOperationImportKey | KmsOperationDeleteKey | KmsOperationSign | KmsOperationVerify | KmsOperationEncrypt | KmsOperationDecrypt | KmsOperationRandomBytes;
export declare function getKmsOperationHumanDescription(operation: KmsOperation): string;
