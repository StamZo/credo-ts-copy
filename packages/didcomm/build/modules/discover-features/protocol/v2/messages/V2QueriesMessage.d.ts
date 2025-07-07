import type { FeatureQueryOptions } from '../../../../../models';
import { AgentMessage } from '../../../../../AgentMessage';
import { FeatureQuery } from '../../../../../models';
export interface V2DiscoverFeaturesQueriesMessageOptions {
    id?: string;
    queries: FeatureQueryOptions[];
    comment?: string;
}
export declare class V2QueriesMessage extends AgentMessage {
    constructor(options: V2DiscoverFeaturesQueriesMessageOptions);
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
    queries: FeatureQuery[];
}
