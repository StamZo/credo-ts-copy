import type { AgentMessage } from '../../../../AgentMessage';
import type { InboundMessageContext } from '../../../../models';
import type { CreateDisclosureOptions, CreateQueryOptions, DiscoverFeaturesProtocolMsgReturnType } from '../../DiscoverFeaturesServiceOptions';
import { EventEmitter, Logger } from '@credo-ts/core';
import { FeatureRegistry } from '../../../../FeatureRegistry';
import { MessageHandlerRegistry } from '../../../../MessageHandlerRegistry';
import { DiscoverFeaturesModuleConfig } from '../../DiscoverFeaturesModuleConfig';
import { DiscoverFeaturesService } from '../../services';
import { V1DiscloseMessage, V1QueryMessage } from './messages';
export declare class V1DiscoverFeaturesService extends DiscoverFeaturesService {
    constructor(featureRegistry: FeatureRegistry, eventEmitter: EventEmitter, messageHandlerRegistry: MessageHandlerRegistry, logger: Logger, discoverFeaturesConfig: DiscoverFeaturesModuleConfig);
    /**
     * The version of the discover features protocol this service supports
     */
    readonly version = "v1";
    private registerMessageHandlers;
    createQuery(options: CreateQueryOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<V1QueryMessage>>;
    processQuery(messageContext: InboundMessageContext<V1QueryMessage>): Promise<DiscoverFeaturesProtocolMsgReturnType<AgentMessage> | undefined>;
    createDisclosure(options: CreateDisclosureOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<V1DiscloseMessage>>;
    processDisclosure(messageContext: InboundMessageContext<V1DiscloseMessage>): Promise<void>;
}
