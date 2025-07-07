import type { AgentContext, BaseRecord, Kms, ResolvedDidCommService } from '@credo-ts/core';
import type { AgentMessage } from '../AgentMessage';
import type { ConnectionRecord } from '../modules/connections/repository';
import type { OutOfBandRecord } from '../modules/oob';
import type { InboundMessageContext } from './InboundMessageContext';
export interface ServiceMessageParams {
    senderKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
    service: ResolvedDidCommService;
    returnRoute?: boolean;
}
export interface OutboundMessageContextParams {
    agentContext: AgentContext;
    inboundMessageContext?: InboundMessageContext;
    associatedRecord?: BaseRecord<any, any, any>;
    connection?: ConnectionRecord;
    serviceParams?: ServiceMessageParams;
    outOfBand?: OutOfBandRecord;
    sessionId?: string;
}
export declare class OutboundMessageContext<T extends AgentMessage = AgentMessage> {
    message: T;
    connection?: ConnectionRecord;
    serviceParams?: ServiceMessageParams;
    outOfBand?: OutOfBandRecord;
    associatedRecord?: BaseRecord<any, any, any>;
    sessionId?: string;
    inboundMessageContext?: InboundMessageContext;
    readonly agentContext: AgentContext;
    constructor(message: T, context: OutboundMessageContextParams);
    /**
     * Assert the outbound message has a ready connection associated with it.
     *
     * @throws {CredoError} if there is no connection or the connection is not ready
     */
    assertReadyConnection(): ConnectionRecord;
    isOutboundServiceMessage(): boolean;
    toJSON(): {
        message: T;
        outOfBand: OutOfBandRecord | undefined;
        associatedRecord: BaseRecord<any, any, any> | undefined;
        sessionId: string | undefined;
        serviceParams: ServiceMessageParams | undefined;
        agentContext: {
            contextCorrelationId: string;
        };
        connection: ConnectionRecord | undefined;
    };
}
