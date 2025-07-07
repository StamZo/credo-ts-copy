import type { BaseAgent } from '../../agent/BaseAgent';
import type { UpdateConfig, UpdateToVersion } from './updates';
export interface UpdateAssistantUpdateOptions {
    updateToVersion?: UpdateToVersion;
}
export declare class UpdateAssistant<Agent extends BaseAgent<any> = BaseAgent> {
    private agent;
    private storageUpdateService;
    private updateConfig;
    constructor(agent: Agent, updateConfig?: UpdateConfig);
    initialize(): Promise<void>;
    isUpToDate(updateToVersion?: UpdateToVersion): Promise<boolean>;
    getCurrentAgentStorageVersion(): Promise<import("../../utils/version").VersionString>;
    static get frameworkStorageVersion(): "0.5";
    getNeededUpdates(toVersion?: UpdateToVersion): Promise<({
        readonly fromVersion: "0.1";
        readonly toVersion: "0.2";
        readonly doUpdate: () => void;
    } | {
        readonly fromVersion: "0.2";
        readonly toVersion: "0.3";
        readonly doUpdate: () => void;
    } | {
        readonly fromVersion: "0.3";
        readonly toVersion: "0.3.1";
        readonly doUpdate: typeof import("./updates/0.3-0.3.1").updateV0_3ToV0_3_1;
    } | {
        readonly fromVersion: "0.3.1";
        readonly toVersion: "0.4";
        readonly doUpdate: typeof import("./updates/0.3.1-0.4").updateV0_3_1ToV0_4;
    } | {
        readonly fromVersion: "0.4";
        readonly toVersion: "0.5";
        readonly doUpdate: typeof import("./updates/0.4-0.5").updateV0_4ToV0_5;
    })[]>;
    update(options?: UpdateAssistantUpdateOptions): Promise<string | undefined>;
}
