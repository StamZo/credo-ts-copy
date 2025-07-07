import { AgentMessage } from '../../../../../AgentMessage';
export interface BatchPickupMessageOptions {
    id?: string;
    batchSize: number;
}
/**
 * A message to request to have multiple waiting messages sent inside a `batch` message.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0212-pickup/README.md#batch-pickup
 */
export declare class V1BatchPickupMessage extends AgentMessage {
    readonly allowQueueTransport = false;
    /**
     * Create new BatchPickupMessage instance.
     *
     * @param options
     */
    constructor(options: BatchPickupMessageOptions);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    batchSize: number;
}
