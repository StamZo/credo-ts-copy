import type { EventEmitter, Logger } from '@credo-ts/core';
import type { AgentMessage } from '../../../AgentMessage';
import type { FeatureRegistry } from '../../../FeatureRegistry';
import type { InboundMessageContext } from '../../../models';
import type { DiscoverFeaturesModuleConfig } from '../DiscoverFeaturesModuleConfig';
import type { CreateDisclosureOptions, CreateQueryOptions, DiscoverFeaturesProtocolMsgReturnType } from '../DiscoverFeaturesServiceOptions';
export declare abstract class DiscoverFeaturesService {
    protected featureRegistry: FeatureRegistry;
    protected eventEmitter: EventEmitter;
    protected logger: Logger;
    protected discoverFeaturesModuleConfig: DiscoverFeaturesModuleConfig;
    constructor(featureRegistry: FeatureRegistry, eventEmitter: EventEmitter, logger: Logger, discoverFeaturesModuleConfig: DiscoverFeaturesModuleConfig);
    abstract readonly version: string;
    abstract createQuery(options: CreateQueryOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<AgentMessage>>;
    abstract processQuery(messageContext: InboundMessageContext<AgentMessage>): Promise<DiscoverFeaturesProtocolMsgReturnType<AgentMessage> | undefined>;
    abstract createDisclosure(options: CreateDisclosureOptions): Promise<DiscoverFeaturesProtocolMsgReturnType<AgentMessage>>;
    abstract processDisclosure(messageContext: InboundMessageContext<AgentMessage>): Promise<void>;
}
