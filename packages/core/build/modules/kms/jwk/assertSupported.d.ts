import { KmsDecryptDataDecryption, KmsEncryptDataEncryption, KmsKeyAgreementDecryptOptions, KmsKeyAgreementEncryptOptions } from '../options';
import { KnownJwaContentEncryptionAlgorithm, KnownJwaKeyAgreementAlgorithm, KnownJwaKeyEncryptionAlgorithm } from './jwa';
export declare function assertSupportedKeyAgreementAlgorithm<KeyAgreement extends KmsKeyAgreementEncryptOptions | KmsKeyAgreementDecryptOptions, SupportedAlgorithms extends KnownJwaKeyAgreementAlgorithm[]>(keyAgreement: KeyAgreement, supportedAlgorithms: SupportedAlgorithms, backend: string): asserts keyAgreement is KeyAgreement & {
    algorithm: SupportedAlgorithms[number];
};
export declare function assertSupportedEncryptionAlgorithm<Encryption extends KmsEncryptDataEncryption | KmsDecryptDataDecryption, SupportedAlgorithms extends Array<KnownJwaContentEncryptionAlgorithm | KnownJwaKeyEncryptionAlgorithm>>(encryption: Encryption, supportedAlgorithms: SupportedAlgorithms, backend: string): asserts encryption is Encryption & {
    algorithm: SupportedAlgorithms[number];
};
