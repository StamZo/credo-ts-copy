import type { AgentContext } from '@credo-ts/core';
import type { OutboundPackage } from '../types';
import type { OutboundTransport } from './OutboundTransport';
export declare class WsOutboundTransport implements OutboundTransport {
    private transportTable;
    private agentContext;
    private logger;
    private WebSocketClass;
    supportedSchemes: string[];
    private isActive;
    start(agentContext: AgentContext): Promise<void>;
    stop(): Promise<void>;
    sendMessage(outboundPackage: OutboundPackage): Promise<void>;
    private hasOpenSocket;
    private resolveSocket;
    private handleMessageEvent;
    private listenOnWebSocketMessages;
    private createSocketConnection;
}
