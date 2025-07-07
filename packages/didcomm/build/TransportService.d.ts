import type { DidDocument } from '@credo-ts/core';
import type { AgentMessage } from './AgentMessage';
import type { EnvelopeKeys } from './EnvelopeService';
import type { EncryptedMessage } from './types';
import { AgentContext, EventEmitter } from '@credo-ts/core';
export declare class TransportService {
    transportSessionTable: TransportSessionTable;
    private agentContext;
    private eventEmitter;
    constructor(agentContext: AgentContext, eventEmitter: EventEmitter);
    saveSession(session: TransportSession): void;
    findSessionByConnectionId(connectionId: string): TransportSession | undefined;
    setConnectionIdForSession(sessionId: string, connectionId: string): void;
    hasInboundEndpoint(didDocument: DidDocument): boolean;
    findSessionById(sessionId: string): TransportSession | undefined;
    removeSession(session: TransportSession): void;
    private getExistingSessionsForConnectionIdAndType;
}
interface TransportSessionTable {
    [sessionId: string]: TransportSession | undefined;
}
export interface TransportSession {
    id: string;
    type: string;
    keys?: EnvelopeKeys;
    inboundMessage?: AgentMessage;
    connectionId?: string;
    send(agentContext: AgentContext, encryptedMessage: EncryptedMessage): Promise<void>;
    close(): Promise<void>;
}
export {};
