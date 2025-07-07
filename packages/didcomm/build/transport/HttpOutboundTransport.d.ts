import type { AgentContext } from '@credo-ts/core';
import type { OutboundPackage } from '../types';
import type { OutboundTransport } from './OutboundTransport';
export declare class HttpOutboundTransport implements OutboundTransport {
    private agentContext;
    private logger;
    private fetch;
    private isActive;
    private outboundSessionCount;
    private outboundSessionsObservable;
    supportedSchemes: string[];
    start(agentContext: AgentContext): Promise<void>;
    stop(): Promise<void>;
    sendMessage(outboundPackage: OutboundPackage): Promise<void>;
}
