import type { DependencyContainer } from 'tsyringe';
import type { AgentContext } from '../agent';
import type { ModulesMap } from '../agent/AgentModules';
import type { Constructor } from '../utils/mixins';
import { InjectionToken } from 'tsyringe';
export { InjectionToken };
export declare class DependencyManager {
    readonly container: DependencyContainer;
    readonly registeredModules: ModulesMap;
    constructor(container?: DependencyContainer, registeredModules?: ModulesMap);
    registerModules(modules: ModulesMap): void;
    initializeModules(agentContext: AgentContext): Promise<void>;
    shutdownModules(agentContext: AgentContext): Promise<void>;
    initializeAgentContext(agentContext: AgentContext): Promise<void>;
    deleteAgentContext(agentContext: AgentContext): Promise<void>;
    provisionAgentContext(agentContext: AgentContext): Promise<AgentContext>;
    closeAgentContext(agentContext: AgentContext): Promise<void>;
    registerSingleton<T>(from: InjectionToken<T>, to: InjectionToken<T>): void;
    registerSingleton<T>(token: Constructor<T>): void;
    resolve<T>(token: InjectionToken<T>): T;
    registerInstance<T>(token: InjectionToken<T>, instance: T): void;
    isRegistered<T>(token: InjectionToken<T>, recursive?: boolean): boolean;
    registerContextScoped<T = any>(token: Constructor<T>): void;
    registerContextScoped<T = any>(token: InjectionToken<T>, provider: Constructor<T>): void;
    createChild(): DependencyManager;
}
