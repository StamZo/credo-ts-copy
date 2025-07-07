import type { AgentContext, Kms, Query, QueryOptions } from '@credo-ts/core';
import type { InboundMessageContext } from '../../models';
import type { ConnectionRecord, HandshakeProtocol } from '../connections';
import type { OutOfBandDidCommService } from './domain';
import { EventEmitter } from '@credo-ts/core';
import { DidCommDocumentService } from '../../services';
import { OutOfBandState } from './domain/OutOfBandState';
import { HandshakeReuseMessage } from './messages';
import { HandshakeReuseAcceptedMessage } from './messages/HandshakeReuseAcceptedMessage';
import { OutOfBandInlineServiceKey, OutOfBandRecord, OutOfBandRepository } from './repository';
export interface CreateFromImplicitInvitationConfig {
    did: string;
    threadId: string;
    handshakeProtocols: HandshakeProtocol[];
    autoAcceptConnection?: boolean;
    recipientKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>;
}
export declare class OutOfBandService {
    private outOfBandRepository;
    private eventEmitter;
    private didCommDocumentService;
    constructor(outOfBandRepository: OutOfBandRepository, eventEmitter: EventEmitter, didCommDocumentService: DidCommDocumentService);
    /**
     * Creates an Out of Band record from a Connection/DIDExchange request started by using
     * a publicly resolvable DID this agent can control
     */
    createFromImplicitInvitation(agentContext: AgentContext, config: CreateFromImplicitInvitationConfig): Promise<OutOfBandRecord>;
    processHandshakeReuse(messageContext: InboundMessageContext<HandshakeReuseMessage>): Promise<HandshakeReuseAcceptedMessage>;
    processHandshakeReuseAccepted(messageContext: InboundMessageContext<HandshakeReuseAcceptedMessage>): Promise<void>;
    createHandShakeReuse(agentContext: AgentContext, outOfBandRecord: OutOfBandRecord, connectionRecord: ConnectionRecord): Promise<HandshakeReuseMessage>;
    save(agentContext: AgentContext, outOfBandRecord: OutOfBandRecord): Promise<void>;
    updateState(agentContext: AgentContext, outOfBandRecord: OutOfBandRecord, newState: OutOfBandState): Promise<void>;
    emitStateChangedEvent(agentContext: AgentContext, outOfBandRecord: OutOfBandRecord, previousState: OutOfBandState | null): void;
    findById(agentContext: AgentContext, outOfBandRecordId: string): Promise<OutOfBandRecord | null>;
    getById(agentContext: AgentContext, outOfBandRecordId: string): Promise<OutOfBandRecord>;
    findByReceivedInvitationId(agentContext: AgentContext, receivedInvitationId: string): Promise<OutOfBandRecord | null>;
    findByCreatedInvitationId(agentContext: AgentContext, createdInvitationId: string, threadId?: string): Promise<OutOfBandRecord | null>;
    findCreatedByRecipientKey(agentContext: AgentContext, recipientKey: Kms.PublicJwk<Kms.Ed25519PublicJwk>): Promise<OutOfBandRecord | null>;
    getAll(agentContext: AgentContext): Promise<OutOfBandRecord[]>;
    findAllByQuery(agentContext: AgentContext, query: Query<OutOfBandRecord>, queryOptions?: QueryOptions): Promise<OutOfBandRecord[]>;
    deleteById(agentContext: AgentContext, outOfBandId: string): Promise<void>;
    /**
     * Extract a resolved didcomm service from an out of band invitation.
     *
     * Currently the first service that can be resolved is returned.
     */
    getResolvedServiceForOutOfBandServices(agentContext: AgentContext, services: Array<string | OutOfBandDidCommService>, 
    /**
     * Optional keys for the inline services
     */
    inlineServiceKeys?: OutOfBandInlineServiceKey[]): Promise<import("@credo-ts/core").ResolvedDidCommService>;
}
