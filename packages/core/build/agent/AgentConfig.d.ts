import type { Logger } from '../logger';
import type { InitConfig } from '../types';
import type { AgentDependencies } from './AgentDependencies';
import { LogLevel } from '../logger';
export declare class AgentConfig {
    private initConfig;
    label: string;
    logger: Logger;
    readonly agentDependencies: AgentDependencies;
    constructor(initConfig: InitConfig, agentDependencies: AgentDependencies);
    get allowInsecureHttpUrls(): boolean;
    get autoUpdateStorageOnStartup(): boolean;
    extend(config: Partial<InitConfig>): AgentConfig;
    toJSON(): {
        logger: LogLevel;
        agentDependencies: boolean;
        label: string;
        autoUpdateStorageOnStartup?: boolean;
        allowInsecureHttpUrls?: boolean;
    };
}
