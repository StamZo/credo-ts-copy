import { AgentMessage } from '../../../../../AgentMessage';
import { AckDecorator } from '../../../../../decorators/ack/AckDecorator';
export interface RevocationNotificationMessageV1Options {
    issueThread: string;
    id?: string;
    comment?: string;
    pleaseAck?: AckDecorator;
}
export declare class V1RevocationNotificationMessage extends AgentMessage {
    constructor(options: RevocationNotificationMessageV1Options);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    comment?: string;
    issueThread: string;
}
