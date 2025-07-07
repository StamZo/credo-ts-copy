import type { AgentContext, Logger } from '@credo-ts/core';
import type { EncryptedMessage, InboundTransport, TransportSession } from '@credo-ts/didcomm';
import WebSocket, { Server } from 'ws';
export declare class WsInboundTransport implements InboundTransport {
    private socketServer;
    private logger;
    private socketIds;
    constructor({ server, port }: {
        server: Server;
        port?: undefined;
    } | {
        server?: undefined;
        port: number;
    });
    start(agentContext: AgentContext): Promise<void>;
    stop(): Promise<void>;
    private listenOnWebSocketMessages;
}
export declare class WebSocketTransportSession implements TransportSession {
    id: string;
    readonly type = "WebSocket";
    socket: WebSocket;
    private logger;
    constructor(id: string, socket: WebSocket, logger: Logger);
    send(_agentContext: AgentContext, encryptedMessage: EncryptedMessage): Promise<void>;
    close(): Promise<void>;
}
