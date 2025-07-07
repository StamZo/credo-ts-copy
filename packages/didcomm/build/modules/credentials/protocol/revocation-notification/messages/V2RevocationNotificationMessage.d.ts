import { AgentMessage } from '../../../../../AgentMessage';
import { AckDecorator } from '../../../../../decorators/ack/AckDecorator';
export interface RevocationNotificationMessageV2Options {
    revocationFormat: string;
    credentialId: string;
    id?: string;
    comment?: string;
    pleaseAck?: AckDecorator;
}
export declare class V2RevocationNotificationMessage extends AgentMessage {
    constructor(options: RevocationNotificationMessageV2Options);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    comment?: string;
    revocationFormat: string;
    credentialId: string;
}
