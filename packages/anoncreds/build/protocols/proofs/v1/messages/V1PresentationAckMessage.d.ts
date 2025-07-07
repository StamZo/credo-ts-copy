import { AckMessage } from '@credo-ts/didcomm';
export declare class V1PresentationAckMessage extends AckMessage {
    readonly allowDidSovPrefix = true;
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
}
