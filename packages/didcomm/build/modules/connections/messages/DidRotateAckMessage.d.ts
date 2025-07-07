import type { AckMessageOptions } from '../../../messages';
import { AckMessage } from '../../../messages';
export type DidRotateAckMessageOptions = AckMessageOptions;
export declare class DidRotateAckMessage extends AckMessage {
    readonly type: string;
    static readonly type: import("../../../util/messageType").ParsedMessageType;
}
