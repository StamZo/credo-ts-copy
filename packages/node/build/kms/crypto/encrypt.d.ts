import { Kms } from '@credo-ts/core';
export declare const nodeSupportedEncryptionAlgorithms: ["A128CBC", "A256CBC", "A128CBC-HS256", "A192CBC-HS384", "A256CBC-HS512", "A128GCM", "A192GCM", "A256GCM", "C20P"];
export declare function performEncrypt(key: Kms.KmsJwkPrivateOct, dataEncryption: Kms.KmsEncryptDataEncryption, data: Uint8Array): Promise<{
    encrypted: Uint8Array;
    tag?: Uint8Array;
    iv: Uint8Array;
}>;
