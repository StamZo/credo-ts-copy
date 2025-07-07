import { AgentMessage } from '../../../AgentMessage';
export interface HandshakeReuseAcceptedMessageOptions {
    id?: string;
    threadId: string;
    parentThreadId: string;
}
export declare class HandshakeReuseAcceptedMessage extends AgentMessage {
    constructor(options: HandshakeReuseAcceptedMessageOptions);
    readonly type: string;
    static readonly type: import("../../../util/messageType").ParsedMessageType;
}
