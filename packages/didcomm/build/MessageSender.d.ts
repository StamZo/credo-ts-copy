import type { AgentMessage } from './AgentMessage';
import type { EnvelopeKeys } from './EnvelopeService';
import type { ConnectionRecord } from './modules/connections/repository';
import type { OutboundTransport } from './transport/OutboundTransport';
import type { EncryptedMessage, OutboundPackage } from './types';
import { AgentContext, EventEmitter } from '@credo-ts/core';
import { DidCommModuleConfig } from './DidCommModuleConfig';
import { EnvelopeService } from './EnvelopeService';
import { TransportService } from './TransportService';
import { DID_COMM_TRANSPORT_QUEUE } from './constants';
import { OutboundMessageContext } from './models';
import { DidCommDocumentService } from './services/DidCommDocumentService';
export interface TransportPriorityOptions {
    schemes: string[];
    restrictive?: boolean;
}
export declare class MessageSender {
    private envelopeService;
    private transportService;
    private queueTransportRepository;
    private didCommDocumentService;
    private eventEmitter;
    private _outboundTransports;
    constructor(envelopeService: EnvelopeService, transportService: TransportService, didCommModuleConfig: DidCommModuleConfig, didCommDocumentService: DidCommDocumentService, eventEmitter: EventEmitter);
    get outboundTransports(): OutboundTransport[];
    registerOutboundTransport(outboundTransport: OutboundTransport): void;
    unregisterOutboundTransport(outboundTransport: OutboundTransport): Promise<void>;
    packMessage(agentContext: AgentContext, { keys, message, endpoint, }: {
        keys: EnvelopeKeys;
        message: AgentMessage;
        endpoint: string;
    }): Promise<OutboundPackage>;
    private sendMessageToSession;
    sendPackage(agentContext: AgentContext, { connection, encryptedMessage, recipientKey, options, }: {
        connection: ConnectionRecord;
        recipientKey: string;
        encryptedMessage: EncryptedMessage;
        options?: {
            transportPriority?: TransportPriorityOptions;
        };
    }): Promise<void>;
    sendMessage(outboundMessageContext: OutboundMessageContext, options?: {
        transportPriority?: TransportPriorityOptions;
    }): Promise<void>;
    private sendMessageToService;
    private sendToService;
    private findSessionForOutboundContext;
    private retrieveServicesByConnection;
    private emitMessageSentEvent;
}
export declare function isDidCommTransportQueue(serviceEndpoint: string): serviceEndpoint is typeof DID_COMM_TRANSPORT_QUEUE;
