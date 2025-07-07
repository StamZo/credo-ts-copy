import { AckMessage } from '../../../../../messages';
export declare class V2PresentationAckMessage extends AckMessage {
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
}
