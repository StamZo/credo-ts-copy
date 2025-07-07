import { Kms } from '@credo-ts/core';
export declare function performDecrypt(key: Kms.KmsJwkPrivateOct, dataDecryption: Kms.KmsDecryptDataDecryption, encrypted: Uint8Array): Promise<{
    data: Uint8Array;
}>;
