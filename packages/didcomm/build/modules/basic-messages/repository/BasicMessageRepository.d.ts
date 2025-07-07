import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { BasicMessageRecord } from './BasicMessageRecord';
export declare class BasicMessageRepository extends Repository<BasicMessageRecord> {
    constructor(storageService: StorageService<BasicMessageRecord>, eventEmitter: EventEmitter);
}
