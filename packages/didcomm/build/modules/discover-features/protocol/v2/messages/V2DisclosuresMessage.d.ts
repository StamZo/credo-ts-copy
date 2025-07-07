import { AgentMessage } from '../../../../../AgentMessage';
import { Feature } from '../../../../../models';
export interface V2DisclosuresMessageOptions {
    id?: string;
    threadId?: string;
    features?: Feature[];
}
export declare class V2DisclosuresMessage extends AgentMessage {
    constructor(options: V2DisclosuresMessageOptions);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    disclosures: Feature[];
}
