import type { Server } from 'http';
import type { AgentContext } from '@credo-ts/core';
import type { EncryptedMessage, InboundTransport, TransportSession } from '@credo-ts/didcomm';
import type { Express, Request, Response } from 'express';
export declare class HttpInboundTransport implements InboundTransport {
    readonly app: Express;
    private port;
    private path;
    private _server?;
    private processedMessageListenerTimeoutMs;
    get server(): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> | undefined;
    constructor({ app, path, port, processedMessageListenerTimeoutMs, }: {
        app?: Express;
        path?: string;
        port: number;
        processedMessageListenerTimeoutMs?: number;
    });
    start(agentContext: AgentContext): Promise<void>;
    stop(): Promise<void>;
}
export declare class HttpTransportSession implements TransportSession {
    id: string;
    readonly type = "http";
    req: Request;
    res: Response;
    constructor(id: string, req: Request, res: Response);
    close(): Promise<void>;
    send(agentContext: AgentContext, encryptedMessage: EncryptedMessage): Promise<void>;
}
