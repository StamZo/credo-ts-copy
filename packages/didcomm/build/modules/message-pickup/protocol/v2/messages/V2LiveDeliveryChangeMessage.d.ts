import { AgentMessage } from '../../../../../AgentMessage';
export interface V2LiveDeliveryChangeMessageOptions {
    id?: string;
    liveDelivery: boolean;
}
export declare class V2LiveDeliveryChangeMessage extends AgentMessage {
    readonly allowQueueTransport = false;
    constructor(options: V2LiveDeliveryChangeMessageOptions);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    liveDelivery: boolean;
}
