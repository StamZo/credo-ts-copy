import { Kms } from '@credo-ts/core';
import { Key } from '@openwallet-foundation/askar-shared';
import { jwkEncToAskarAlg } from '../../utils';
type AskarSupportedDecryptionOptions = Kms.KmsDecryptDataDecryption & {
    algorithm: keyof typeof jwkEncToAskarAlg;
};
export declare function aeadDecrypt(options: {
    key: Key;
    decryption: AskarSupportedDecryptionOptions;
    encrypted: Uint8Array;
}): Uint8Array<ArrayBufferLike>;
export {};
