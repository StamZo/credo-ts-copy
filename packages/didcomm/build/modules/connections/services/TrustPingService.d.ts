import type { InboundMessageContext } from '../../../models';
import type { TrustPingMessage } from '../messages';
import type { ConnectionRecord } from '../repository';
import { EventEmitter } from '@credo-ts/core';
import { OutboundMessageContext } from '../../../models';
import { TrustPingResponseMessage } from '../messages';
export declare class TrustPingService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter);
    processPing({ message, agentContext }: InboundMessageContext<TrustPingMessage>, connection: ConnectionRecord): OutboundMessageContext<TrustPingResponseMessage> | undefined;
    processPingResponse(inboundMessage: InboundMessageContext<TrustPingResponseMessage>): void;
}
