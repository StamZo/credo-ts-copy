import type { AgentContext } from '@credo-ts/core';
import type { MessagePickupSession, MessagePickupSessionRole } from '../MessagePickupSession';
/**
 * @internal
 * The Message Pickup session service keeps track of all {@link MessagePickupSession}
 *
 * It is initially intended for Message Holder/Mediator role, where only Live Mode sessions are
 * considered.
 */
export declare class MessagePickupSessionService {
    private sessions;
    constructor();
    start(agentContext: AgentContext): void;
    getLiveSession(_agentContext: AgentContext, sessionId: string): MessagePickupSession | undefined;
    getLiveSessionByConnectionId(_agentContext: AgentContext, options: {
        connectionId: string;
        role?: MessagePickupSessionRole;
    }): MessagePickupSession | undefined;
    saveLiveSession(agentContext: AgentContext, options: {
        connectionId: string;
        protocolVersion: string;
        role: MessagePickupSessionRole;
    }): void;
    removeLiveSession(agentContext: AgentContext, options: {
        connectionId: string;
    }): void;
}
