import { AgentMessage } from '@credo-ts/didcomm';
export declare class AnswerMessage extends AgentMessage {
    /**
     * Create new AnswerMessage instance.
     * @param options
     */
    constructor(options: {
        id?: string;
        response: string;
        threadId: string;
    });
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
    response: string;
}
