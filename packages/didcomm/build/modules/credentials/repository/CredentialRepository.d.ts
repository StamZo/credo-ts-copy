import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { CredentialExchangeRecord } from './CredentialExchangeRecord';
export declare class CredentialRepository extends Repository<CredentialExchangeRecord> {
    constructor(storageService: StorageService<CredentialExchangeRecord>, eventEmitter: EventEmitter);
}
