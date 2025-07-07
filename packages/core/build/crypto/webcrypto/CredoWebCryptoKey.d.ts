import { PublicJwk } from '../../modules/kms';
import type { KeyGenAlgorithm, KeyType, KeyUsage } from './types';
import * as core from 'webcrypto-core';
export declare class CredoWebCryptoKey extends core.CryptoKey {
    publicJwk: PublicJwk;
    algorithm: KeyGenAlgorithm;
    extractable: boolean;
    type: KeyType;
    usages: Array<KeyUsage>;
    constructor(publicJwk: PublicJwk, algorithm: KeyGenAlgorithm, extractable: boolean, type: KeyType, usages: Array<KeyUsage>);
}
