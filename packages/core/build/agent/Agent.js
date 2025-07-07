"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const rxjs_1 = require("rxjs");
const constants_1 = require("../constants");
const JwsService_1 = require("../crypto/JwsService");
const error_1 = require("../error");
const plugins_1 = require("../plugins");
const storage_1 = require("../storage");
const AgentConfig_1 = require("./AgentConfig");
const AgentModules_1 = require("./AgentModules");
const BaseAgent_1 = require("./BaseAgent");
const EventEmitter_1 = require("./EventEmitter");
const context_1 = require("./context");
// Any makes sure you can use Agent as a type without always needing to specify the exact generics for the agent
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
class Agent extends BaseAgent_1.BaseAgent {
    constructor(options, dependencyManager = new plugins_1.DependencyManager()) {
        const agentConfig = new AgentConfig_1.AgentConfig(options.config, options.dependencies);
        const modulesWithDefaultModules = (0, AgentModules_1.extendModulesWithDefaultModules)(options.modules);
        // Register internal dependencies
        dependencyManager.registerSingleton(EventEmitter_1.EventEmitter);
        dependencyManager.registerSingleton(JwsService_1.JwsService);
        dependencyManager.registerSingleton(storage_1.StorageVersionRepository);
        dependencyManager.registerSingleton(storage_1.StorageUpdateService);
        dependencyManager.registerInstance(AgentConfig_1.AgentConfig, agentConfig);
        dependencyManager.registerInstance(constants_1.InjectionSymbols.AgentDependencies, agentConfig.agentDependencies);
        dependencyManager.registerInstance(constants_1.InjectionSymbols.Stop$, new rxjs_1.Subject());
        dependencyManager.registerInstance(constants_1.InjectionSymbols.FileSystem, new agentConfig.agentDependencies.FileSystem());
        // Register all modules. This will also include the default modules
        dependencyManager.registerModules(modulesWithDefaultModules);
        if (!dependencyManager.isRegistered(constants_1.InjectionSymbols.Logger)) {
            dependencyManager.registerInstance(constants_1.InjectionSymbols.Logger, agentConfig.logger);
        }
        if (!dependencyManager.isRegistered(constants_1.InjectionSymbols.StorageService)) {
            throw new error_1.CredoError("Missing required dependency: 'StorageService'. You can register it using the AskarModule, or implement your own.");
        }
        // TODO: contextCorrelationId for base wallet
        // Bind the default agent context to the container for use in modules etc.
        dependencyManager.registerInstance(context_1.AgentContext, new context_1.AgentContext({
            dependencyManager,
            contextCorrelationId: 'default',
            isRootAgentContext: true,
        }));
        // If no agent context provider has been registered we use the default agent context provider.
        if (!dependencyManager.isRegistered(constants_1.InjectionSymbols.AgentContextProvider)) {
            dependencyManager.registerSingleton(constants_1.InjectionSymbols.AgentContextProvider, context_1.DefaultAgentContextProvider);
        }
        super(agentConfig, dependencyManager);
    }
    get events() {
        return this.eventEmitter;
    }
    async initialize() {
        if (this._isInitialized) {
            throw new error_1.CredoError('Agent already initialized. Currently it is not supported to re-initialize an already initialized agent.');
        }
        // We first initialize all the modules
        await this.dependencyManager.initializeModules(this.agentContext);
        // Then we initialize the root agent context
        await this.dependencyManager.initializeAgentContext(this.agentContext);
        // Make sure the storage is up to date
        const storageUpdateService = this.dependencyManager.resolve(storage_1.StorageUpdateService);
        const isStorageUpToDate = await storageUpdateService.isUpToDate(this.agentContext);
        this.logger.info(`Agent storage is ${isStorageUpToDate ? '' : 'not '}up to date.`);
        if (!isStorageUpToDate && this.agentConfig.autoUpdateStorageOnStartup) {
            const updateAssistant = new storage_1.UpdateAssistant(this);
            await updateAssistant.initialize();
            await updateAssistant.update();
        }
        else if (!isStorageUpToDate) {
            const currentVersion = await storageUpdateService.getCurrentStorageVersion(this.agentContext);
            // Close agent context to prevent un-initialized agent with initialized agent context
            await this.dependencyManager.closeAgentContext(this.agentContext);
            throw new error_1.CredoError(
            // TODO: add link to where documentation on how to update can be found.
            `Current agent storage is not up to date. To prevent the framework state from getting corrupted the agent initialization is aborted. Make sure to update the agent storage (currently at ${currentVersion}) to the latest version (${storage_1.UpdateAssistant.frameworkStorageVersion}). You can also downgrade your version of Credo.`);
        }
        this._isInitialized = true;
    }
    async shutdown() {
        // TODO: replace stop$, should be replaced by module specific lifecycle methods
        const stop$ = this.dependencyManager.resolve(constants_1.InjectionSymbols.Stop$);
        // All observables use takeUntil with the stop$ observable
        // this means all observables will stop running if a value is emitted on this observable
        stop$.next(true);
        await this.dependencyManager.shutdownModules(this.agentContext);
        await this.dependencyManager.closeAgentContext(this.agentContext);
        this._isInitialized = false;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map