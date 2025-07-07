import type { InboundMessageContext } from './models/InboundMessageContext';
import { EventEmitter, Logger } from '@credo-ts/core';
import { MessageHandlerRegistry } from './MessageHandlerRegistry';
import { MessageSender } from './MessageSender';
declare class Dispatcher {
    private messageHandlerRegistry;
    private messageSender;
    private eventEmitter;
    private logger;
    constructor(messageSender: MessageSender, eventEmitter: EventEmitter, messageHandlerRegistry: MessageHandlerRegistry, logger: Logger);
    private defaultHandlerMiddleware;
    dispatch(messageContext: InboundMessageContext): Promise<void>;
}
export { Dispatcher };
