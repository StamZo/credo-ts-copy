"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentContext = void 0;
const constants_1 = require("../../constants");
const AgentConfig_1 = require("../AgentConfig");
class AgentContext {
    constructor({ dependencyManager, contextCorrelationId, isRootAgentContext = false, }) {
        this.dependencyManager = dependencyManager;
        this.contextCorrelationId = contextCorrelationId;
        this.isRootAgentContext = isRootAgentContext;
    }
    /**
     * Convenience method to access the agent config for the current context.
     */
    get config() {
        return this.dependencyManager.resolve(AgentConfig_1.AgentConfig);
    }
    /**
     * End session the current agent context
     */
    async endSession() {
        // TODO: we need to create a custom agent context per sesion
        // and then track if it has already been ended, because it's quite
        // easy to mess up the session count at the moment
        const agentContextProvider = this.dependencyManager.resolve(constants_1.InjectionSymbols.AgentContextProvider);
        await agentContextProvider.endSessionForAgentContext(this);
    }
    toJSON() {
        return {
            contextCorrelationId: this.contextCorrelationId,
        };
    }
    /**
     * Resolve a dependency
     */
    resolve(token) {
        return this.dependencyManager.resolve(token);
    }
}
exports.AgentContext = AgentContext;
//# sourceMappingURL=AgentContext.js.map