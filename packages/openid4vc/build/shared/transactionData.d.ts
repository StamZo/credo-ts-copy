import { SdJwtVc } from '@credo-ts/core';
export declare function getSdJwtVcTransactionDataHashes(sdJwtVc: SdJwtVc): {
    transaction_data_hashes: string[];
    transaction_data_hashes_alg: string | undefined;
} | undefined;
