import type { AckMessageOptions } from '@credo-ts/didcomm';
import { AckMessage } from '@credo-ts/didcomm';
export type V1CredentialAckMessageOptions = AckMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0015-acks/README.md#explicit-acks
 */
export declare class V1CredentialAckMessage extends AckMessage {
    readonly allowDidSovPrefix = true;
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
}
