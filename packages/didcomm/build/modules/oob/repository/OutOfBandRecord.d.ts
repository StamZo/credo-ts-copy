import type { TagsBase } from '@credo-ts/core';
import type { OutOfBandRole } from '../domain/OutOfBandRole';
import type { OutOfBandState } from '../domain/OutOfBandState';
import type { OutOfBandRecordMetadata } from './outOfBandRecordMetadataTypes';
import { BaseRecord } from '@credo-ts/core';
import { OutOfBandInvitation } from '../messages';
export interface OutOfBandInlineServiceKey {
    recipientKeyFingerprint: string;
    kmsKeyId: string;
}
type DefaultOutOfBandRecordTags = {
    role: OutOfBandRole;
    state: OutOfBandState;
    invitationId: string;
    threadId?: string;
    /**
     * The thread ids from the attached request messages from the out
     * of band invitation.
     */
    invitationRequestsThreadIds?: string[];
};
interface CustomOutOfBandRecordTags extends TagsBase {
    /**
     * The fingerprints of the recipient keys from the out of band invitation.
     * When we created the invitation this will be our keys, when we received this
     * invitation it will be the other parties' keys.
     */
    recipientKeyFingerprints: string[];
    /**
     * The fingerprint from the {@link OutOfBandRecordMetadataKeys.RecipientRouting} recipient key.
     *
     * This will always be a key from our recipient
     */
    recipientRoutingKeyFingerprint?: string;
}
export interface OutOfBandRecordProps {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: CustomOutOfBandRecordTags;
    outOfBandInvitation: OutOfBandInvitation;
    role: OutOfBandRole;
    state: OutOfBandState;
    alias?: string;
    autoAcceptConnection?: boolean;
    reusable?: boolean;
    mediatorId?: string;
    reuseConnectionId?: string;
    threadId?: string;
    /**
     * The keys associated with the inline services of the out of band invitation
     */
    invitationInlineServiceKeys?: OutOfBandInlineServiceKey[];
}
export declare class OutOfBandRecord extends BaseRecord<DefaultOutOfBandRecordTags, CustomOutOfBandRecordTags, OutOfBandRecordMetadata> {
    outOfBandInvitation: OutOfBandInvitation;
    role: OutOfBandRole;
    state: OutOfBandState;
    alias?: string;
    reusable: boolean;
    autoAcceptConnection?: boolean;
    mediatorId?: string;
    reuseConnectionId?: string;
    /**
     * The keys associated with the inline services of the out of band invitation
     */
    invitationInlineServiceKeys?: Array<OutOfBandInlineServiceKey>;
    static readonly type = "OutOfBandRecord";
    readonly type = "OutOfBandRecord";
    constructor(props: OutOfBandRecordProps);
    getTags(): {
        role: OutOfBandRole;
        state: OutOfBandState;
        invitationId: string;
        threadId: string;
        invitationRequestsThreadIds: string[] | undefined;
        /**
         * The fingerprints of the recipient keys from the out of band invitation.
         * When we created the invitation this will be our keys, when we received this
         * invitation it will be the other parties' keys.
         */
        recipientKeyFingerprints: string[];
        /**
         * The fingerprint from the {@link OutOfBandRecordMetadataKeys.RecipientRouting} recipient key.
         *
         * This will always be a key from our recipient
         */
        recipientRoutingKeyFingerprint?: string;
    };
    assertRole(expectedRole: OutOfBandRole): void;
    assertState(expectedStates: OutOfBandState | OutOfBandState[]): void;
}
export {};
