import type { Attachment } from '../../../../../decorators/attachment/Attachment';
import { AgentMessage } from '../../../../../AgentMessage';
export interface V2MessageDeliveryMessageOptions {
    id?: string;
    recipientKey?: string;
    threadId?: string;
    attachments: Attachment[];
}
export declare class V2MessageDeliveryMessage extends AgentMessage {
    readonly allowQueueTransport = false;
    constructor(options: V2MessageDeliveryMessageOptions);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    recipientKey?: string;
}
