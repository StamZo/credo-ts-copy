import type { AgentContext, Query, QueryOptions } from '@credo-ts/core';
import type { InboundMessageContext } from '../../../models';
import { EventEmitter } from '@credo-ts/core';
import { ConnectionRecord } from '../../connections';
import { BasicMessage } from '../messages';
import { BasicMessageRecord, BasicMessageRepository } from '../repository';
export declare class BasicMessageService {
    private basicMessageRepository;
    private eventEmitter;
    constructor(basicMessageRepository: BasicMessageRepository, eventEmitter: EventEmitter);
    createMessage(agentContext: AgentContext, message: string, connectionRecord: ConnectionRecord, parentThreadId?: string): Promise<{
        message: BasicMessage;
        record: BasicMessageRecord;
    }>;
    /**
     * @todo use connection from message context
     */
    save({ message, agentContext }: InboundMessageContext<BasicMessage>, connection: ConnectionRecord): Promise<void>;
    private emitStateChangedEvent;
    findAllByQuery(agentContext: AgentContext, query: Query<BasicMessageRecord>, queryOptions?: QueryOptions): Promise<BasicMessageRecord[]>;
    getById(agentContext: AgentContext, basicMessageRecordId: string): Promise<BasicMessageRecord>;
    getByThreadId(agentContext: AgentContext, threadId: string): Promise<BasicMessageRecord>;
    findAllByParentThreadId(agentContext: AgentContext, parentThreadId: string): Promise<BasicMessageRecord[]>;
    deleteById(agentContext: AgentContext, basicMessageRecordId: string): Promise<void>;
}
