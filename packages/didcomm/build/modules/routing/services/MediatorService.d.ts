import type { AgentContext, Query, QueryOptions } from '@credo-ts/core';
import type { InboundMessageContext } from '../../../models';
import type { ForwardMessage, MediationRequestMessage } from '../messages';
import { EventEmitter, Logger } from '@credo-ts/core';
import { ConnectionService } from '../../connections/services';
import { MessagePickupApi } from '../../message-pickup';
import { KeylistUpdateMessage, KeylistUpdateResponseMessage, MediationGrantMessage } from '../messages';
import { MediatorRoutingRecord } from '../repository';
import { MediationRecord } from '../repository/MediationRecord';
import { MediationRepository } from '../repository/MediationRepository';
import { MediatorRoutingRepository } from '../repository/MediatorRoutingRepository';
export declare class MediatorService {
    private logger;
    private mediationRepository;
    private mediatorRoutingRepository;
    private messagePickupApi;
    private eventEmitter;
    private connectionService;
    constructor(mediationRepository: MediationRepository, mediatorRoutingRepository: MediatorRoutingRepository, messagePickupApi: MessagePickupApi, eventEmitter: EventEmitter, logger: Logger, connectionService: ConnectionService);
    private getRoutingKeys;
    processForwardMessage(messageContext: InboundMessageContext<ForwardMessage>): Promise<void>;
    processKeylistUpdateRequest(messageContext: InboundMessageContext<KeylistUpdateMessage>): Promise<KeylistUpdateResponseMessage>;
    createGrantMediationMessage(agentContext: AgentContext, mediationRecord: MediationRecord): Promise<{
        mediationRecord: MediationRecord;
        message: MediationGrantMessage;
    }>;
    processMediationRequest(messageContext: InboundMessageContext<MediationRequestMessage>): Promise<MediationRecord>;
    findById(agentContext: AgentContext, mediatorRecordId: string): Promise<MediationRecord | null>;
    getById(agentContext: AgentContext, mediatorRecordId: string): Promise<MediationRecord>;
    getAll(agentContext: AgentContext): Promise<MediationRecord[]>;
    findMediatorRoutingRecord(agentContext: AgentContext): Promise<MediatorRoutingRecord | null>;
    createMediatorRoutingRecord(agentContext: AgentContext): Promise<MediatorRoutingRecord | null>;
    findAllByQuery(agentContext: AgentContext, query: Query<MediationRecord>, queryOptions?: QueryOptions): Promise<MediationRecord[]>;
    private updateState;
    private emitStateChangedEvent;
    private updateUseDidKeysFlag;
}
