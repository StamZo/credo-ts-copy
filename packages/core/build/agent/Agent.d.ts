import type { InitConfig } from '../types';
import type { AgentDependencies } from './AgentDependencies';
import type { AgentModulesInput } from './AgentModules';
import { DependencyManager } from '../plugins';
import { BaseAgent } from './BaseAgent';
import { EventEmitter } from './EventEmitter';
interface AgentOptions<AgentModules extends AgentModulesInput> {
    config: InitConfig;
    modules?: AgentModules;
    dependencies: AgentDependencies;
}
export declare class Agent<AgentModules extends AgentModulesInput = any> extends BaseAgent<AgentModules> {
    constructor(options: AgentOptions<AgentModules>, dependencyManager?: DependencyManager);
    get events(): EventEmitter;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}
export {};
