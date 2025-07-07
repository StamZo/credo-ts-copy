import type { MessageHandler, MessageHandlerMiddleware } from './handlers';
import type { InboundTransport, OutboundTransport } from './transport';
import { DidCommModuleConfig } from './DidCommModuleConfig';
import { FeatureRegistry } from './FeatureRegistry';
import { MessageHandlerRegistry } from './MessageHandlerRegistry';
import { MessageReceiver } from './MessageReceiver';
import { MessageSender } from './MessageSender';
export declare class DidCommApi {
    config: DidCommModuleConfig;
    private featureRegistry;
    private messageSender;
    private messageReceiver;
    private messageHandlerRegistry;
    constructor(messageHandlerRegistry: MessageHandlerRegistry, messageSender: MessageSender, messageReceiver: MessageReceiver, featureRegistry: FeatureRegistry, config: DidCommModuleConfig);
    registerInboundTransport(inboundTransport: InboundTransport): void;
    unregisterInboundTransport(inboundTransport: InboundTransport): Promise<void>;
    get inboundTransports(): InboundTransport[];
    registerOutboundTransport(outboundTransport: OutboundTransport): void;
    unregisterOutboundTransport(outboundTransport: OutboundTransport): Promise<void>;
    get outboundTransports(): OutboundTransport[];
    /**
     * Agent's feature registry
     */
    registerMessageHandlers(messageHandlers: MessageHandler[]): void;
    registerMessageHandlerMiddleware(messageHandlerMiddleware: MessageHandlerMiddleware): void;
    get fallbackMessageHandler(): ((messageContext: import("./models").InboundMessageContext) => Promise<import("./models").OutboundMessageContext | undefined>) | undefined;
    get messageHandlerMiddlewares(): MessageHandlerMiddleware[];
    /**
     * Sets the fallback message handler, the message handler that will be called if no handler
     * is registered for an incoming message type.
     */
    setFallbackMessageHandler(fallbackMessageHandler: MessageHandler['handle']): void;
    get features(): FeatureRegistry;
}
