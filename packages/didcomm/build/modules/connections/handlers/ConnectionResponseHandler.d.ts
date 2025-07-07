import type { DidResolverService } from '@credo-ts/core';
import type { MessageHandler, MessageHandlerInboundMessage } from '../../../handlers';
import type { OutOfBandService } from '../../oob/OutOfBandService';
import type { ConnectionsModuleConfig } from '../ConnectionsModuleConfig';
import type { ConnectionService } from '../services';
import { OutboundMessageContext } from '../../../models';
import { ConnectionResponseMessage } from '../messages';
export declare class ConnectionResponseHandler implements MessageHandler {
    private connectionService;
    private outOfBandService;
    private didResolverService;
    private connectionsModuleConfig;
    supportedMessages: (typeof ConnectionResponseMessage)[];
    constructor(connectionService: ConnectionService, outOfBandService: OutOfBandService, didResolverService: DidResolverService, connectionsModuleConfig: ConnectionsModuleConfig);
    handle(messageContext: MessageHandlerInboundMessage<ConnectionResponseHandler>): Promise<OutboundMessageContext<import("../messages").TrustPingMessage> | undefined>;
}
