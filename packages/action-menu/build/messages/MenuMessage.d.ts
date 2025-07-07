import type { ActionMenuOptionOptions } from '../models';
import { AgentMessage } from '@credo-ts/didcomm';
import { ActionMenuOption } from '../models';
/**
 * @internal
 */
export interface MenuMessageOptions {
    id?: string;
    title: string;
    description: string;
    errorMessage?: string;
    options: ActionMenuOptionOptions[];
    threadId?: string;
}
/**
 * @internal
 */
export declare class MenuMessage extends AgentMessage {
    constructor(options: MenuMessageOptions);
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
    title: string;
    description: string;
    errorMessage?: string;
    options: ActionMenuOption[];
}
