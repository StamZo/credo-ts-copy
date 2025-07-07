import type { DeliverMessagesFromQueueOptions, DeliverMessagesFromQueueReturnType, DeliverMessagesOptions, DeliverMessagesReturnType, PickupMessagesOptions, PickupMessagesReturnType, QueueMessageOptions, QueueMessageReturnType, SetLiveDeliveryModeOptions, SetLiveDeliveryModeReturnType } from './MessagePickupApiOptions';
import type { MessagePickupSession, MessagePickupSessionRole } from './MessagePickupSession';
import type { V1MessagePickupProtocol, V2MessagePickupProtocol } from './protocol';
import type { MessagePickupProtocol } from './protocol/MessagePickupProtocol';
import { AgentContext, EventEmitter, Logger } from '@credo-ts/core';
import { Subject } from 'rxjs';
import { MessageSender } from '../../MessageSender';
import { ConnectionService } from '../connections/services';
import { MessagePickupModuleConfig } from './MessagePickupModuleConfig';
import { MessagePickupSessionService } from './services/MessagePickupSessionService';
export interface MessagePickupApi<MPPs extends MessagePickupProtocol[]> {
    queueMessage(options: QueueMessageOptions): Promise<QueueMessageReturnType>;
    pickupMessages(options: PickupMessagesOptions<MPPs>): Promise<PickupMessagesReturnType>;
    getLiveModeSession(options: {
        connectionId: string;
        role?: MessagePickupSessionRole;
    }): Promise<MessagePickupSession | undefined>;
    deliverMessages(options: DeliverMessagesOptions): Promise<DeliverMessagesReturnType>;
    deliverMessagesFromQueue(options: DeliverMessagesFromQueueOptions): Promise<DeliverMessagesFromQueueReturnType>;
    setLiveDeliveryMode(options: SetLiveDeliveryModeOptions): Promise<SetLiveDeliveryModeReturnType>;
}
export declare class MessagePickupApi<MPPs extends MessagePickupProtocol[] = [V1MessagePickupProtocol, V2MessagePickupProtocol]> implements MessagePickupApi<MPPs> {
    config: MessagePickupModuleConfig<MPPs>;
    private messageSender;
    private agentContext;
    private eventEmitter;
    private connectionService;
    private messagePickupSessionService;
    private logger;
    private stop$;
    constructor(messageSender: MessageSender, agentContext: AgentContext, connectionService: ConnectionService, eventEmitter: EventEmitter, messagePickupSessionService: MessagePickupSessionService, config: MessagePickupModuleConfig<MPPs>, stop$: Subject<boolean>, logger: Logger);
    private getProtocol;
}
