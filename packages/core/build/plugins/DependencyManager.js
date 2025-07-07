"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyManager = void 0;
const tsyringe_1 = require("tsyringe");
const error_1 = require("../error");
class DependencyManager {
    constructor(container = tsyringe_1.container.createChildContainer(), registeredModules = {}) {
        this.container = container;
        this.registeredModules = registeredModules;
    }
    registerModules(modules) {
        for (const [moduleKey, module] of Object.entries(modules)) {
            if (this.registeredModules[moduleKey]) {
                throw new error_1.CredoError(`Module with key ${moduleKey} has already been registered. Only a single module can be registered with the same key.`);
            }
            this.registeredModules[moduleKey] = module;
            if (module.api) {
                this.registerContextScoped(module.api);
            }
            try {
                module.register(this);
            }
            catch (error) {
                throw new error_1.CredoError(`Cannot register ${moduleKey}: ${error}`);
            }
        }
    }
    async initializeModules(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'initializeModule' called on DependencyManager different from the agent context for which 'initializeModule' is called. Make sure to call 'initializeModule' on the DependencyManager associated with the agent context.`);
        }
        for (const [moduleName, module] of Object.entries(this.registeredModules)) {
            try {
                await module.initialize?.(agentContext);
            }
            catch (error) {
                throw new error_1.CredoError(`Error during call to 'initialize' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
            }
        }
    }
    async shutdownModules(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'shutdownModules' called on DependencyManager different from the agent context for which 'shutdownModules' is called. Make sure to call 'shutdownModules' on the DependencyManager associated with the agent context.`);
        }
        for (const [moduleName, module] of Object.entries(this.registeredModules)) {
            try {
                await module.shutdown?.(agentContext);
            }
            catch (error) {
                throw new error_1.CredoError(`Error during call to 'shutdown' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
            }
        }
    }
    async initializeAgentContext(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'initializeAgentContext' called on DependencyManager different from the agent context for which 'initializeAgentContext' is called. Make sure to call 'initializeAgentContext' on the DependencyManager associated with the agent context.`);
        }
        for (const [moduleName, module] of Object.entries(this.registeredModules)) {
            try {
                await module.onInitializeContext?.(agentContext);
            }
            catch (error) {
                throw new error_1.CredoError(`Error during call to 'onInitializeContext' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
            }
        }
    }
    async deleteAgentContext(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'deleteAgentContext' called on DependencyManager different from the agent context for which 'deleteAgentContext' is called. Make sure to call 'deleteAgentContext' on the DependencyManager associated with the agent context.`);
        }
        try {
            for (const [moduleName, module] of Object.entries(this.registeredModules)) {
                try {
                    await module.onDeleteContext?.(agentContext);
                }
                catch (error) {
                    throw new error_1.CredoError(`Error during call to 'onDeleteContext' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
                }
            }
        }
        finally {
            await this.container.dispose();
        }
    }
    async provisionAgentContext(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'provisionAgentContext' called on DependencyManager different from the agent context for which 'provisionAgentContext' is called. Make sure to call 'provisionAgentContext' on the DependencyManager associated with the agent context.`);
        }
        for (const [moduleName, module] of Object.entries(this.registeredModules)) {
            try {
                await module.onProvisionContext?.(agentContext);
            }
            catch (error) {
                throw new error_1.CredoError(`Error during call to 'onProvisionContext' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
            }
        }
        return agentContext;
    }
    async closeAgentContext(agentContext) {
        if (agentContext.dependencyManager.container !== this.container) {
            throw new error_1.CredoError(`Method 'closeAgentContext' called on DependencyManager different from the agent context for which 'closeAgentContext' is called. Make sure to call 'closeAgentContext' on the DependencyManager associated with the agent context.`);
        }
        try {
            for (const [moduleName, module] of Object.entries(this.registeredModules)) {
                try {
                    await module.onCloseContext?.(agentContext);
                }
                catch (error) {
                    throw new error_1.CredoError(`Error during call to 'onCloseContext' method in module '${moduleName}' for agent context '${agentContext.contextCorrelationId}'.`, { cause: error });
                }
            }
        }
        finally {
            // NOTE: we support reinitialization of the root agent so we can't dispose of the agent context
            if (!agentContext.isRootAgentContext) {
                await this.container.dispose();
            }
        }
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    registerSingleton(fromOrToken, to) {
        this.container.registerSingleton(fromOrToken, to);
    }
    resolve(token) {
        return this.container.resolve(token);
    }
    registerInstance(token, instance) {
        this.container.registerInstance(token, instance);
    }
    isRegistered(token, recursive = false) {
        return this.container.isRegistered(token, recursive);
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    registerContextScoped(token, provider) {
        if (provider)
            this.container.register(token, provider, { lifecycle: tsyringe_1.Lifecycle.ContainerScoped });
        else
            this.container.register(token, token, { lifecycle: tsyringe_1.Lifecycle.ContainerScoped });
    }
    createChild() {
        return new DependencyManager(this.container.createChildContainer(), this.registeredModules);
    }
}
exports.DependencyManager = DependencyManager;
//# sourceMappingURL=DependencyManager.js.map