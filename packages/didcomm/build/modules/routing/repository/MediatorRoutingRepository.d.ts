import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { MediatorRoutingRecord } from './MediatorRoutingRecord';
export declare class MediatorRoutingRepository extends Repository<MediatorRoutingRecord> {
    readonly MEDIATOR_ROUTING_RECORD_ID = "MEDIATOR_ROUTING_RECORD";
    constructor(storageService: StorageService<MediatorRoutingRecord>, eventEmitter: EventEmitter);
}
