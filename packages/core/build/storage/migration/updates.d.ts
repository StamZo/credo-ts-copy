import type { BaseAgent } from '../../agent/BaseAgent';
import type { VersionString } from '../../utils/version';
import { updateV0_3ToV0_3_1 } from './updates/0.3-0.3.1';
import { updateV0_3_1ToV0_4 } from './updates/0.3.1-0.4';
import { updateV0_4ToV0_5 } from './updates/0.4-0.5';
export declare const INITIAL_STORAGE_VERSION = "0.1";
export interface UpdateConfig {
    v0_1ToV0_2: V0_1ToV0_2UpdateConfig;
}
export interface Update {
    fromVersion: VersionString;
    toVersion: VersionString;
    doUpdate: <Agent extends BaseAgent>(agent: Agent, updateConfig: UpdateConfig) => Promise<void>;
}
export interface V0_1ToV0_2UpdateConfig {
    mediationRoleUpdateStrategy: 'allMediator' | 'allRecipient' | 'recipientIfEndpoint' | 'doNotChange';
}
export declare const DEFAULT_UPDATE_CONFIG: UpdateConfig;
export declare const supportedUpdates: readonly [{
    readonly fromVersion: "0.1";
    readonly toVersion: "0.2";
    readonly doUpdate: () => void;
}, {
    readonly fromVersion: "0.2";
    readonly toVersion: "0.3";
    readonly doUpdate: () => void;
}, {
    readonly fromVersion: "0.3";
    readonly toVersion: "0.3.1";
    readonly doUpdate: typeof updateV0_3ToV0_3_1;
}, {
    readonly fromVersion: "0.3.1";
    readonly toVersion: "0.4";
    readonly doUpdate: typeof updateV0_3_1ToV0_4;
}, {
    readonly fromVersion: "0.4";
    readonly toVersion: "0.5";
    readonly doUpdate: typeof updateV0_4ToV0_5;
}];
export declare const CURRENT_FRAMEWORK_STORAGE_VERSION: LastItem<typeof supportedUpdates>["toVersion"];
export declare const STORAGE_VERSION_RECORD_ID = "STORAGE_VERSION_RECORD_ID";
type LastItem<T extends readonly unknown[]> = T extends readonly [...infer _, infer U] ? U : T[0] | undefined;
export type UpdateToVersion = (typeof supportedUpdates)[number]['toVersion'];
export {};
