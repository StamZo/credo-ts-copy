import type { OutboundMessageContext } from '../models';
import { CredoError } from '@credo-ts/core';
export declare class MessageSendingError extends CredoError {
    outboundMessageContext: OutboundMessageContext;
    constructor(message: string, { outboundMessageContext, cause }: {
        outboundMessageContext: OutboundMessageContext;
        cause?: Error;
    });
}
