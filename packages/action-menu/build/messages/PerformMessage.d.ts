import { AgentMessage } from '@credo-ts/didcomm';
/**
 * @internal
 */
export interface PerformMessageOptions {
    id?: string;
    name: string;
    params?: Record<string, string>;
    threadId: string;
}
/**
 * @internal
 */
export declare class PerformMessage extends AgentMessage {
    constructor(options: PerformMessageOptions);
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
    name: string;
    params?: Record<string, string>;
}
