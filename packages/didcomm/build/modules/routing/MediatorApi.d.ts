import type { MediationRecord } from './repository';
import { AgentContext } from '@credo-ts/core';
import { MessageHandlerRegistry } from '../../MessageHandlerRegistry';
import { MessageSender } from '../../MessageSender';
import { ConnectionService } from '../connections';
import { MediatorModuleConfig } from './MediatorModuleConfig';
import { MediatorService } from './services/MediatorService';
export declare class MediatorApi {
    config: MediatorModuleConfig;
    private mediatorService;
    private messageSender;
    private agentContext;
    private connectionService;
    constructor(messageHandlerRegistry: MessageHandlerRegistry, mediationService: MediatorService, messageSender: MessageSender, agentContext: AgentContext, connectionService: ConnectionService, config: MediatorModuleConfig);
    grantRequestedMediation(mediationRecordId: string): Promise<MediationRecord>;
    private registerMessageHandlers;
}
