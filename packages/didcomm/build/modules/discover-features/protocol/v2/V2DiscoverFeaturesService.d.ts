import type { InboundMessageContext } from '../../../../models';
import type { CreateDisclosureOptions, CreateQueryOptions, DiscoverFeaturesProtocolMsgReturnType } from '../../DiscoverFeaturesServiceOptions';
import { EventEmitter, Logger } from '@credo-ts/core';
import { FeatureRegistry } from '../../../../FeatureRegistry';
import { MessageHandlerRegistry } from '../../../../MessageHandlerRegistry';
import { DiscoverFeaturesModuleConfig } from '../../DiscoverFeaturesModuleConfig';
import { DiscoverFeaturesService } from '../../services';
import { V2DisclosuresMessage, V2QueriesMessage } from './messages';
export declare class V2DiscoverFeaturesService extends DiscoverFeaturesService {
    constructor(featureRegistry: FeatureRegistry, eventEmitter: EventEmitter, messageHandlerRegistry: MessageHandlerRegistry, logger: Logger, discoverFeaturesModuleConfig: DiscoverFeaturesModuleConfig);
    /**
     * The version of the discover features protocol this service supports
     */
    readonly version = "v2";
    private registerMessageHandlers;
    createQuery(options: CreateQueryOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<V2QueriesMessage>>;
    processQuery(messageContext: InboundMessageContext<V2QueriesMessage>): Promise<DiscoverFeaturesProtocolMsgReturnType<V2DisclosuresMessage> | undefined>;
    createDisclosure(options: CreateDisclosureOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<V2DisclosuresMessage>>;
    processDisclosure(messageContext: InboundMessageContext<V2DisclosuresMessage>): Promise<void>;
}
