import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { OutOfBandRecord } from './OutOfBandRecord';
export declare class OutOfBandRepository extends Repository<OutOfBandRecord> {
    constructor(storageService: StorageService<OutOfBandRecord>, eventEmitter: EventEmitter);
}
