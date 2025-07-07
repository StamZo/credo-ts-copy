import { Kms } from '@credo-ts/core';
import { Key } from '@openwallet-foundation/askar-shared';
import { jwkEncToAskarAlg } from '../../utils';
export type AskarSupportedEncryptionOptions = Kms.KmsEncryptDataEncryption & {
    algorithm: keyof typeof jwkEncToAskarAlg;
};
export declare function aeadEncrypt(options: {
    key: Key;
    encryption: AskarSupportedEncryptionOptions;
    data: Uint8Array;
}): {
    encrypted: Uint8Array<ArrayBufferLike>;
    iv: Uint8Array<ArrayBufferLike>;
    tag: Uint8Array<ArrayBufferLike>;
};
