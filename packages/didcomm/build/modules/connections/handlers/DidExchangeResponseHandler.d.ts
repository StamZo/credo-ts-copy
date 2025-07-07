import type { DidResolverService } from '@credo-ts/core';
import type { ConnectionsModuleConfig, DidExchangeProtocol } from '..';
import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { OutOfBandService } from '../../oob/OutOfBandService';
import type { ConnectionService } from '../services';
import { OutboundMessageContext } from '../../../models';
import { DidExchangeResponseMessage } from '../messages';
export declare class DidExchangeResponseHandler implements MessageHandler {
    private didExchangeProtocol;
    private outOfBandService;
    private connectionService;
    private didResolverService;
    private connectionsModuleConfig;
    supportedMessages: (typeof DidExchangeResponseMessage)[];
    constructor(didExchangeProtocol: DidExchangeProtocol, outOfBandService: OutOfBandService, connectionService: ConnectionService, didResolverService: DidResolverService, connectionsModuleConfig: ConnectionsModuleConfig);
    handle(messageContext: MessageHandlerInboundMessage<DidExchangeResponseHandler>): Promise<OutboundMessageContext<import("..").DidExchangeCompleteMessage> | undefined>;
}
