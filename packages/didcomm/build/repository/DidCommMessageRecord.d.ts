import type { ConstructableAgentMessage } from '../AgentMessage';
import type { PlaintextMessage } from '../types';
import type { DidCommMessageRole } from './DidCommMessageRole';
import { BaseRecord } from '@credo-ts/core';
export type DefaultDidCommMessageTags = {
    role: DidCommMessageRole;
    associatedRecordId?: string;
    protocolName: string;
    messageName: string;
    protocolMajorVersion: string;
    protocolMinorVersion: string;
    messageType: string;
    messageId: string;
    threadId: string;
};
export interface DidCommMessageRecordProps {
    role: DidCommMessageRole;
    message: PlaintextMessage;
    id?: string;
    createdAt?: Date;
    associatedRecordId?: string;
}
export declare class DidCommMessageRecord extends BaseRecord<DefaultDidCommMessageTags> {
    message: PlaintextMessage;
    role: DidCommMessageRole;
    /**
     * The id of the record that is associated with this message record.
     *
     * E.g. if the connection record wants to store an invitation message
     * the associatedRecordId will be the id of the connection record.
     */
    associatedRecordId?: string;
    static readonly type = "DidCommMessageRecord";
    readonly type = "DidCommMessageRecord";
    constructor(props: DidCommMessageRecordProps);
    getTags(): {
        role: DidCommMessageRole;
        associatedRecordId: string | undefined;
        threadId: string;
        protocolName: string;
        messageName: string;
        protocolMajorVersion: string;
        protocolMinorVersion: string;
        messageType: string;
        messageId: string;
    };
    getMessageInstance<MessageClass extends ConstructableAgentMessage = ConstructableAgentMessage>(messageClass: MessageClass): InstanceType<MessageClass>;
}
