import type { QueueTransportRepository } from './QueueTransportRepository';
import type { AddMessageOptions, GetAvailableMessageCountOptions, RemoveMessagesOptions, TakeFromQueueOptions } from './QueueTransportRepositoryOptions';
import type { QueuedMessage } from './QueuedMessage';
import { AgentContext } from '@credo-ts/core';
export declare class InMemoryQueueTransportRepository implements QueueTransportRepository {
    private messages;
    constructor();
    getAvailableMessageCount(_agentContext: AgentContext, options: GetAvailableMessageCountOptions): number | Promise<number>;
    takeFromQueue(agentContext: AgentContext, options: TakeFromQueueOptions): QueuedMessage[];
    addMessage(_agentContext: AgentContext, options: AddMessageOptions): string;
    removeMessages(_agentContext: AgentContext, options: RemoveMessagesOptions): void;
}
