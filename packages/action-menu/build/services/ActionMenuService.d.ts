import type { AgentContext, Query, QueryOptions } from '@credo-ts/core';
import type { InboundMessageContext } from '@credo-ts/didcomm';
import type { ActionMenuProblemReportMessage } from '../messages';
import type { ClearMenuOptions, CreateMenuOptions, CreatePerformOptions, CreateRequestOptions, FindMenuOptions } from './ActionMenuServiceOptions';
import { AgentConfig, EventEmitter } from '@credo-ts/core';
import { MenuMessage, MenuRequestMessage, PerformMessage } from '../messages';
import { ActionMenuRecord, ActionMenuRepository } from '../repository';
/**
 * @internal
 */
export declare class ActionMenuService {
    private actionMenuRepository;
    private eventEmitter;
    private logger;
    constructor(actionMenuRepository: ActionMenuRepository, agentConfig: AgentConfig, eventEmitter: EventEmitter);
    createRequest(agentContext: AgentContext, options: CreateRequestOptions): Promise<{
        message: MenuRequestMessage;
        record: ActionMenuRecord;
    }>;
    processRequest(messageContext: InboundMessageContext<MenuRequestMessage>): Promise<ActionMenuRecord>;
    createMenu(agentContext: AgentContext, options: CreateMenuOptions): Promise<{
        message: MenuMessage;
        record: ActionMenuRecord;
    }>;
    processMenu(messageContext: InboundMessageContext<MenuMessage>): Promise<void>;
    createPerform(agentContext: AgentContext, options: CreatePerformOptions): Promise<{
        message: PerformMessage;
        record: ActionMenuRecord;
    }>;
    processPerform(messageContext: InboundMessageContext<PerformMessage>): Promise<void>;
    clearMenu(agentContext: AgentContext, options: ClearMenuOptions): Promise<ActionMenuRecord>;
    processProblemReport(messageContext: InboundMessageContext<ActionMenuProblemReportMessage>): Promise<ActionMenuRecord>;
    findById(agentContext: AgentContext, actionMenuRecordId: string): Promise<ActionMenuRecord | null>;
    find(agentContext: AgentContext, options: FindMenuOptions): Promise<ActionMenuRecord | null>;
    findAllByQuery(agentContext: AgentContext, options: Query<ActionMenuRecord>, queryOptions?: QueryOptions): Promise<ActionMenuRecord[]>;
    private emitStateChangedEvent;
}
