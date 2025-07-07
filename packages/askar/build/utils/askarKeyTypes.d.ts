import { Kms } from '@credo-ts/core';
import { KeyAlgorithm } from '@openwallet-foundation/askar-shared';
export declare const jwkCrvToAskarAlg: Partial<Record<Kms.KmsJwkPublicEc['crv'] | Kms.KmsJwkPublicOkp['crv'], KeyAlgorithm | undefined>>;
export declare const jwkEncToAskarAlg: {
    'A128CBC-HS256': KeyAlgorithm.AesA128CbcHs256;
    A128GCM: KeyAlgorithm.AesA128Gcm;
    'A256CBC-HS512': KeyAlgorithm.AesA256CbcHs512;
    A256GCM: KeyAlgorithm.AesA256Gcm;
    C20P: KeyAlgorithm.Chacha20C20P;
    XC20P: KeyAlgorithm.Chacha20XC20P;
    A128KW: KeyAlgorithm.AesA128Kw;
    A256KW: KeyAlgorithm.AesA256Kw;
};
