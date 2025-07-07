import type { RecordTags, TagsBase } from '@credo-ts/core';
import type { BasicMessageRole } from '../BasicMessageRole';
import { BaseRecord } from '@credo-ts/core';
export type CustomBasicMessageTags = TagsBase;
export type DefaultBasicMessageTags = {
    connectionId: string;
    role: BasicMessageRole;
    threadId?: string;
    parentThreadId?: string;
};
export type BasicMessageTags = RecordTags<BasicMessageRecord>;
export interface BasicMessageStorageProps {
    id?: string;
    createdAt?: Date;
    connectionId: string;
    role: BasicMessageRole;
    tags?: CustomBasicMessageTags;
    threadId?: string;
    parentThreadId?: string;
    content: string;
    sentTime: string;
}
export declare class BasicMessageRecord extends BaseRecord<DefaultBasicMessageTags, CustomBasicMessageTags> {
    content: string;
    sentTime: string;
    connectionId: string;
    role: BasicMessageRole;
    threadId?: string;
    parentThreadId?: string;
    static readonly type = "BasicMessageRecord";
    readonly type = "BasicMessageRecord";
    constructor(props: BasicMessageStorageProps);
    getTags(): {
        connectionId: string;
        role: BasicMessageRole;
        threadId: string | undefined;
        parentThreadId: string | undefined;
    };
}
