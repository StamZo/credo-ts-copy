import { AgentMessage } from '../../../AgentMessage';
export interface DidExchangeCompleteMessageOptions {
    id?: string;
    threadId: string;
    parentThreadId: string;
}
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0023-did-exchange/README.md#3-exchange-complete
 */
export declare class DidExchangeCompleteMessage extends AgentMessage {
    constructor(options: DidExchangeCompleteMessageOptions);
    readonly type: string;
    static readonly type: import("../../../util/messageType").ParsedMessageType;
}
