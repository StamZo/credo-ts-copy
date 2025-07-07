"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSessionCoordinator = void 0;
const core_1 = require("@credo-ts/core");
const async_mutex_1 = require("async-mutex");
const TenantsModuleConfig_1 = require("../TenantsModuleConfig");
const TenantSessionMutex_1 = require("./TenantSessionMutex");
/**
 * Coordinates all agent context instance for tenant sessions.
 *
 * This class keeps a mapping of tenant ids (context correlation ids) to agent context sessions mapping. Each mapping contains the agent context,
 * the current session count and a mutex for making operations against the session mapping (opening / closing an agent context). The mutex ensures
 * we're not susceptible to race conditions where multiple calls to open/close an agent context are made at the same time. Even though JavaScript is
 * single threaded, promises can introduce race conditions as one process can stop and another process can be picked up.
 *
 * NOTE: the implementation doesn't yet cache agent context objects after they aren't being used for any sessions anymore. This means if a wallet is being used
 * often in a short time it will be opened/closed very often. This is an improvement to be made in the near future.
 */
let TenantSessionCoordinator = class TenantSessionCoordinator {
    constructor(rootAgentContext, logger, tenantsModuleConfig) {
        this.tenantAgentContextMapping = {};
        this.rootAgentContext = rootAgentContext;
        this.logger = logger;
        this.tenantsModuleConfig = tenantsModuleConfig;
        this.sessionMutex = new TenantSessionMutex_1.TenantSessionMutex(this.logger, this.tenantsModuleConfig.sessionLimit, 
        // TODO: we should probably allow a higher session acquire timeout if the storage is being updated?
        this.tenantsModuleConfig.sessionAcquireTimeout);
    }
    getSessionCountForTenant(tenantId) {
        const contextCorrelationId = this.getContextCorrelationIdForTenantId(tenantId);
        return this.tenantAgentContextMapping[contextCorrelationId]?.sessionCount ?? 0;
    }
    /**
     * Get agent context to use for a session. If an agent context for this tenant does not exist yet
     * it will create it and store it for later use. If the agent context does already exist it will
     * be returned.
     *
     * @parm tenantRecord The tenant record for which to get the agent context
     */
    async getContextForSession(tenantRecord, { runInMutex, provisionContext = false, } = {}) {
        this.logger.debug(`Getting context for session with tenant '${tenantRecord.id}'`);
        // Wait for a session to be available
        await this.sessionMutex.acquireSession();
        try {
            const contextCorrelationId = this.getContextCorrelationIdForTenantId(tenantRecord.id);
            return await this.mutexForTenant(contextCorrelationId).runExclusive(async () => {
                this.logger.debug(`Acquired lock for tenant '${tenantRecord.id}' to get context`);
                const tenantSessions = this.getTenantSessionsMapping(contextCorrelationId);
                // If we don't have an agent context already, create one and initialize it
                if (!tenantSessions.agentContext) {
                    this.logger.debug(`No agent context has been initialized for tenant '${tenantRecord.id}', creating one`);
                    tenantSessions.agentContext = await this.createAgentContext(tenantRecord, { provisionContext });
                }
                // If we already have a context with sessions in place return the context and increment
                // the session count.
                tenantSessions.sessionCount++;
                this.logger.debug(`Increased agent context session count for tenant '${tenantRecord.id}' to ${tenantSessions.sessionCount}`);
                if (runInMutex) {
                    try {
                        await runInMutex(tenantSessions.agentContext);
                    }
                    catch (error) {
                        // If the runInMutex failed we should release the session again
                        tenantSessions.sessionCount--;
                        this.logger.debug(`Decreased agent context session count for tenant context '${contextCorrelationId}' to ${tenantSessions.sessionCount} due to failure in mutex script`, error);
                        if (tenantSessions.sessionCount <= 0 && tenantSessions.agentContext) {
                            await this.closeAgentContext(tenantSessions.agentContext);
                            delete this.tenantAgentContextMapping[contextCorrelationId];
                        }
                        throw error;
                    }
                }
                return tenantSessions.agentContext;
            });
        }
        catch (error) {
            this.logger.debug(`Releasing session because an error occurred while getting the context for tenant ${tenantRecord.id}`, {
                errorMessage: error.message,
            });
            // If there was an error acquiring the session, we MUST release it, otherwise this will lead to deadlocks over time.
            this.sessionMutex.releaseSession();
            // Re-throw error
            throw error;
        }
    }
    /**
     * End a session for the provided agent context. It will decrease the session count for the agent context.
     * If the number of sessions is zero after the context for this session has been ended, the agent context will be closed.
     */
    async endAgentContextSession(agentContext) {
        this.logger.debug(`Ending session for agent context with contextCorrelationId ${agentContext.contextCorrelationId}'`);
        // Custom handling for the root agent context. We don't keep track of the total number of sessions for the root
        // agent context, and we always keep the dependency manager intact.
        if (agentContext.contextCorrelationId === this.rootAgentContext.contextCorrelationId) {
            this.logger.debug('Ending session for root agent context. Not disposing dependency manager');
            return;
        }
        const contextCorrelationId = agentContext.contextCorrelationId;
        this.assertTenantContextCorrelationId(contextCorrelationId);
        const hasTenantSessionMapping = this.hasTenantSessionMapping(contextCorrelationId);
        // This should not happen
        if (!hasTenantSessionMapping) {
            this.logger.error(`Unknown agent context with contextCorrelationId '${contextCorrelationId}'.  Cannot end session`);
            throw new core_1.CredoError(`Unknown agent context with contextCorrelationId '${contextCorrelationId}'. Cannot end session`);
        }
        await this.mutexForTenant(contextCorrelationId)
            .runExclusive(async () => {
            this.logger.debug(`Acquired lock for tenant '${contextCorrelationId}' to end session context`);
            const tenantSessions = this.getTenantSessionsMapping(contextCorrelationId);
            // TODO: check if session count is already 0
            tenantSessions.sessionCount--;
            this.logger.debug(`Decreased agent context session count for tenant '${contextCorrelationId}' to ${tenantSessions.sessionCount}`);
            if (tenantSessions.sessionCount <= 0 && tenantSessions.agentContext) {
                await this.closeAgentContext(tenantSessions.agentContext);
                delete this.tenantAgentContextMapping[contextCorrelationId];
            }
        })
            .finally(() => {
            // Release a session so new sessions can be acquired
            this.sessionMutex.releaseSession();
        });
    }
    /**
     * Delete the provided agent context. All opens sessions will be disposed and not usable anymore
     */
    async deleteAgentContext(agentContext) {
        this.logger.debug(`Deleting agent context with contextCorrelationId ${agentContext.contextCorrelationId}'`);
        // Custom handling for the root agent context. We don't keep track of the total number of sessions for the root
        // agent context, and we always keep the dependency manager intact.
        if (agentContext.contextCorrelationId === this.rootAgentContext.contextCorrelationId) {
            this.logger.debug('Deleting agent context for root agent context.');
            await agentContext.dependencyManager.deleteAgentContext(agentContext);
            return;
        }
        const contextCorrelationId = agentContext.contextCorrelationId;
        this.assertTenantContextCorrelationId(contextCorrelationId);
        const hasTenantSessionMapping = this.hasTenantSessionMapping(contextCorrelationId);
        // This should not happen
        if (!hasTenantSessionMapping) {
            this.logger.error(`Unknown agent context with contextCorrelationId '${contextCorrelationId}'.  Cannot delete agent context`);
            throw new core_1.CredoError(`Unknown agent context with contextCorrelationId '${contextCorrelationId}'. Cannot delete agent context`);
        }
        await this.mutexForTenant(contextCorrelationId)
            .runExclusive(async () => {
            this.logger.debug(`Acquired lock for tenant '${contextCorrelationId}' to delete agent context`);
            const tenantSessions = this.getTenantSessionsMapping(contextCorrelationId);
            this.logger.debug(`Deleting agent context for tenant '${contextCorrelationId}' with ${tenantSessions.sessionCount} active sessions.`);
            if (!tenantSessions.agentContext) {
                throw new core_1.CredoError(`Unable to delete agent context for tenant '${contextCorrelationId}' as there are no active sessions.`);
            }
            await agentContext.dependencyManager.deleteAgentContext(tenantSessions.agentContext);
            delete this.tenantAgentContextMapping[contextCorrelationId];
        })
            .finally(() => {
            // Release a session so new sessions can be acquired
            this.sessionMutex.releaseSession();
        });
    }
    /**
     * The context correlation id for a tenant is the tenant id prefixed with tenant-
     */
    getContextCorrelationIdForTenantId(tenantId) {
        if (tenantId.startsWith('tenant-')) {
            throw new core_1.CredoError(`Tenant id already starts with 'tenant-'. You are probalby passing a context correlation id`);
        }
        return `tenant-${tenantId}`;
    }
    /**
     * The context correlation id for a tenant is the tenant id prefixed with tenant-
     */
    getTenantIdForContextCorrelationId(contextCorrelationId) {
        if (!contextCorrelationId.startsWith('tenant-')) {
            throw new core_1.CredoError(`Could not extract tenant id from context correlation id. Context correlation id should start with 'tenant-'`);
        }
        return contextCorrelationId.replace('tenant-', '');
    }
    isTenantContextCorrelationId(contextCorrelationId) {
        return contextCorrelationId.startsWith('tenant-');
    }
    assertTenantContextCorrelationId(contextCorrelationId) {
        if (!this.isTenantContextCorrelationId(contextCorrelationId)) {
            throw new core_1.CredoError(`Expected context correlation id for tenant to start with 'tenant-'`);
        }
    }
    hasTenantSessionMapping(contextCorrelationId) {
        return this.tenantAgentContextMapping[contextCorrelationId] !== undefined;
    }
    getTenantSessionsMapping(contextCorrelationId) {
        let tenantSessionMapping = this.tenantAgentContextMapping[contextCorrelationId];
        if (tenantSessionMapping)
            return tenantSessionMapping;
        tenantSessionMapping = {
            sessionCount: 0,
            mutex: (0, async_mutex_1.withTimeout)(new async_mutex_1.Mutex(), 
            // NOTE: It can take a while to create an indy wallet. We're using RAW key derivation which should
            // be fast enough to not cause a problem. This wil also only be problem when the wallet is being created
            // for the first time or being acquired while wallet initialization is in progress.
            this.tenantsModuleConfig.sessionAcquireTimeout, new core_1.CredoError(`Error acquiring lock for tenant context ${contextCorrelationId}. Wallet initialization or shutdown took too long.`)),
        };
        this.tenantAgentContextMapping[contextCorrelationId] = tenantSessionMapping;
        return tenantSessionMapping;
    }
    mutexForTenant(contextCorrelationId) {
        const tenantSessions = this.getTenantSessionsMapping(contextCorrelationId);
        return tenantSessions.mutex;
    }
    async createAgentContext(tenantRecord, { provisionContext }) {
        const tenantDependencyManager = this.rootAgentContext.dependencyManager.createChild();
        const tenantConfig = this.rootAgentContext.config.extend({
            label: tenantRecord.config.label,
        });
        const agentContext = new core_1.AgentContext({
            contextCorrelationId: this.getContextCorrelationIdForTenantId(tenantRecord.id),
            dependencyManager: tenantDependencyManager,
            isRootAgentContext: false,
        });
        tenantDependencyManager.registerInstance(core_1.AgentContext, agentContext);
        tenantDependencyManager.registerInstance(core_1.AgentConfig, tenantConfig);
        if (provisionContext) {
            await tenantDependencyManager.provisionAgentContext(agentContext);
        }
        await tenantDependencyManager.initializeAgentContext(agentContext);
        return agentContext;
    }
    async closeAgentContext(agentContext) {
        this.logger.debug(`Closing agent context for tenant '${agentContext.contextCorrelationId}'`);
        await agentContext.dependencyManager.closeAgentContext(agentContext);
    }
};
exports.TenantSessionCoordinator = TenantSessionCoordinator;
exports.TenantSessionCoordinator = TenantSessionCoordinator = __decorate([
    (0, core_1.injectable)(),
    __param(1, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [core_1.AgentContext, Object, TenantsModuleConfig_1.TenantsModuleConfig])
], TenantSessionCoordinator);
//# sourceMappingURL=TenantSessionCoordinator.js.map