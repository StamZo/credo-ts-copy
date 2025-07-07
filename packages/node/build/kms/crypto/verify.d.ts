import { CanBePromise, Kms } from '@credo-ts/core';
export declare function performVerify(key: Kms.KmsJwkPrivate | Kms.KmsJwkPublicEc | Kms.KmsJwkPublicOkp | Kms.KmsJwkPublicRsa, algorithm: Kms.KnownJwaSignatureAlgorithm, data: Uint8Array, signature: Uint8Array): CanBePromise<boolean>;
