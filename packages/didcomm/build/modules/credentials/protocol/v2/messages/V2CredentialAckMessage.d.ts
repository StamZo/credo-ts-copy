import { AckMessage, AckMessageOptions } from '../../../../../messages';
export type V2CredentialAckMessageOptions = AckMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0015-acks/README.md#explicit-acks
 */
export declare class V2CredentialAckMessage extends AckMessage {
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
}
