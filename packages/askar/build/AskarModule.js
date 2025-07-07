"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarModule = void 0;
const core_1 = require("@credo-ts/core");
const AskarApi_1 = require("./AskarApi");
const AskarModuleConfig_1 = require("./AskarModuleConfig");
const AskarStoreManager_1 = require("./AskarStoreManager");
const AskarKeyManagementService_1 = require("./kms/AskarKeyManagementService");
const storage_1 = require("./storage");
const tenants_1 = require("./tenants");
class AskarModule {
    constructor(config) {
        this.api = AskarApi_1.AskarApi;
        this.config = new AskarModuleConfig_1.AskarModuleConfig(config);
    }
    register(dependencyManager) {
        dependencyManager.registerInstance(AskarModuleConfig_1.AskarModuleConfig, this.config);
        if (!this.config.enableKms && !this.config.enableStorage) {
            dependencyManager
                .resolve(core_1.AgentConfig)
                .logger.warn(`Both 'enableKms' and 'enableStorage' are disabled, meaning Askar won't be used by the agent.`);
        }
        if (this.config.enableKms) {
            const kmsConfig = dependencyManager.resolve(core_1.Kms.KeyManagementModuleConfig);
            if (kmsConfig.backends.find((backend) => backend.backend === AskarKeyManagementService_1.AskarKeyManagementService.backend)) {
                throw new core_1.CredoError(`Unable to register AskarKeyManagementService. There is a key management backend with name '${AskarKeyManagementService_1.AskarKeyManagementService.backend}' already registered. If you have manually registered the AskarKeyManagementService on the KeyManagementModule, set 'enableKms' to false in the AskarModule.`);
            }
            kmsConfig.registerBackend(new AskarKeyManagementService_1.AskarKeyManagementService());
        }
        if (this.config.enableStorage) {
            if (dependencyManager.isRegistered(core_1.InjectionSymbols.StorageService)) {
                throw new core_1.CredoError('Unable to register AskarStorageService. There is an instance of StorageService already registered');
            }
            dependencyManager.registerSingleton(core_1.InjectionSymbols.StorageService, storage_1.AskarStorageService);
        }
        dependencyManager.registerSingleton(AskarStoreManager_1.AskarStoreManager);
    }
    async onInitializeContext(agentContext) {
        const storeManager = agentContext.dependencyManager.resolve(AskarStoreManager_1.AskarStoreManager);
        await storeManager.getInitializedStoreWithProfile(agentContext);
    }
    async onProvisionContext(agentContext) {
        // We don't have any side effects to run
        if (agentContext.isRootAgentContext)
            return;
        if (this.config.multiWalletDatabaseScheme === AskarModuleConfig_1.AskarMultiWalletDatabaseScheme.ProfilePerWallet)
            return;
        // For new stores (so not profiles) we need to generate a wallet key
        await (0, tenants_1.storeAskarStoreConfigForContextCorrelationId)(agentContext, {
            key: this.config.askar.storeGenerateRawKey({}),
        });
    }
    async onDeleteContext(agentContext) {
        const storeManager = agentContext.dependencyManager.resolve(AskarStoreManager_1.AskarStoreManager);
        // Will delete either the store (when root agent context or database per wallet) or profile (when not root agent context and profile per wallet)
        await storeManager.deleteContext(agentContext);
    }
    async onCloseContext(agentContext) {
        const storeManager = agentContext.dependencyManager.resolve(AskarStoreManager_1.AskarStoreManager);
        await storeManager.closeContext(agentContext);
    }
}
exports.AskarModule = AskarModule;
//# sourceMappingURL=AskarModule.js.map