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
exports.AskarStoreManager = void 0;
const core_1 = require("@credo-ts/core");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const tsyringe_1 = require("tsyringe");
const AskarModuleConfig_1 = require("./AskarModuleConfig");
const error_1 = require("./error");
const utils_1 = require("./storage/utils");
const tenants_1 = require("./tenants");
const utils_2 = require("./utils");
let AskarStoreManager = class AskarStoreManager {
    constructor(fileSystem, config) {
        this.fileSystem = fileSystem;
        this.config = config;
    }
    isStoreOpen(agentContext) {
        return !!this.getStore(agentContext)?.handle;
    }
    async getStoreConfig(agentContext) {
        if (agentContext.isRootAgentContext ||
            this.config.multiWalletDatabaseScheme === AskarModuleConfig_1.AskarMultiWalletDatabaseScheme.ProfilePerWallet) {
            return this.config.store;
        }
        // Otherwise we need to get the wallet key from the tenant record
        const storeConfig = await (0, tenants_1.getAskarStoreConfigForContextCorrelationId)(agentContext);
        return {
            id: agentContext.contextCorrelationId,
            key: storeConfig.key,
            // we always use raw at the moment
            keyDerivationMethod: 'raw',
            database: this.config.store.database,
        };
    }
    /**
     * When we create storage for a context we need to store the version record
     */
    async setCurrentFrameworkStorageVersionOnSession(session) {
        const record = new core_1.StorageVersionRecord({
            storageVersion: core_1.StorageVersionRecord.frameworkStorageVersion,
        });
        await session.insert({
            value: core_1.JsonTransformer.serialize(record),
            name: record.id,
            category: record.type,
            tags: (0, utils_1.transformFromRecordTagValues)(record.getTags()),
        });
    }
    /**
     * Deletes all storage related to a context. If on store level, meaning root agent
     * or when using database per wallet storage, the whole store will be deleted.
     * Otherwise only a profile within the store will be removed.
     */
    async deleteContext(agentContext) {
        const { profile, store } = await this.getInitializedStoreWithProfile(agentContext);
        // Currently it will delete the whole store. We can delete only the root profile, BUT:
        // - all tenant records will be deleted
        // - the root agent is deleted, this is not a flow we support (there's no default profile anymore)
        if (this.isStoreLevel(agentContext)) {
            await this.deleteStore(agentContext);
        }
        else {
            if (!profile)
                throw new error_1.AskarStoreError('Unable to delete asksar data for context. No profile found and not on store level (so not deleting the whole store)');
            await store.removeProfile(profile);
        }
    }
    /**
     * Closes an active context. If on store level, meaning root agent
     * or when using database per wallet storage, the whole store will be closed.
     * Otherwise nothing will be done as profiles are opened on a store from higher level.
     */
    async closeContext(agentContext) {
        // TODO: we should maybe set some value on the agentContext indicating it is disposed so no new sessions can be opened
        // If not on store level we don't have to do anything.
        if (!this.isStoreLevel(agentContext))
            return;
        await this.closeStore(agentContext);
    }
    /**
     * @throws {AskarStoreDuplicateError} if the wallet already exists
     * @throws {AskarStoreError} if another error occurs
     */
    async provisionStore(agentContext) {
        this.ensureStoreLevel(agentContext);
        const storeConfig = await this.getStoreConfig(agentContext);
        const askarStoreConfig = this.getAskarStoreConfig(storeConfig);
        agentContext.config.logger.debug(`Provisioning store '${storeConfig.id}`);
        if (this.getStore(agentContext)) {
            throw new error_1.AskarStoreError('Store already provisioned');
        }
        try {
            if (askarStoreConfig.path) {
                if (await this.fileSystem.exists(askarStoreConfig.path)) {
                    throw new error_1.AskarStoreDuplicateError(`Store '${storeConfig.id}' at path ${askarStoreConfig.path} already exists.`);
                }
                // Make sure path exists before creating the wallet
                await this.fileSystem.createDirectory(askarStoreConfig.path);
            }
            const store = await askar_shared_1.Store.provision({
                recreate: false,
                uri: askarStoreConfig.uri,
                profile: askarStoreConfig.profile,
                keyMethod: askarStoreConfig.keyMethod,
                passKey: askarStoreConfig.passKey,
            });
            agentContext.dependencyManager.registerInstance(askar_shared_1.Store, store);
            // For new stores we need to set the framework storage version
            await this.withSession(agentContext, (session) => this.setCurrentFrameworkStorageVersionOnSession(session));
            return store;
        }
        catch (error) {
            if (error instanceof error_1.AskarStoreDuplicateError)
                throw error;
            // FIXME: Askar should throw a Duplicate error code, but is currently returning Encryption
            // And if we provide the very same wallet key, it will open it without any error
            if ((0, utils_2.isAskarError)(error) &&
                (error.code === utils_2.AskarErrorCode.Encryption || error.code === utils_2.AskarErrorCode.Duplicate)) {
                const errorMessage = `Store '${storeConfig.id}' already exists`;
                agentContext.config.logger.debug(errorMessage);
                throw new error_1.AskarStoreDuplicateError(errorMessage, {
                    cause: error,
                });
            }
            const errorMessage = `Error creating store '${storeConfig.id}'`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    /**
     * @throws {AskarStoreNotFoundError} if the wallet does not exist
     * @throws {AskarStoreError} if another error occurs
     */
    async openStore(agentContext) {
        this.ensureStoreLevel(agentContext);
        if (this.getStore(agentContext)) {
            throw new error_1.AskarStoreError('Store already opened. Close the currently opened store before re-opening the store');
        }
        const storeConfig = await this.getStoreConfig(agentContext);
        const askarStoreConfig = this.getAskarStoreConfig(storeConfig);
        try {
            const store = await askar_shared_1.Store.open({
                uri: askarStoreConfig.uri,
                keyMethod: askarStoreConfig.keyMethod,
                passKey: askarStoreConfig.passKey,
            });
            agentContext.dependencyManager.registerInstance(askar_shared_1.Store, store);
            return store;
        }
        catch (error) {
            if ((0, utils_2.isAskarError)(error) &&
                (error.code === utils_2.AskarErrorCode.NotFound ||
                    (error.code === utils_2.AskarErrorCode.Backend && (0, utils_2.isSqliteInMemoryUri)(askarStoreConfig.uri)))) {
                const errorMessage = `Store '${storeConfig.id}' not found`;
                agentContext.config.logger.debug(errorMessage);
                throw new error_1.AskarStoreNotFoundError(errorMessage, {
                    cause: error,
                });
            }
            if ((0, utils_2.isAskarError)(error) && error.code === utils_2.AskarErrorCode.Encryption) {
                const errorMessage = `Incorrect key for store '${storeConfig.id}'`;
                agentContext.config.logger.debug(errorMessage);
                throw new error_1.AskarStoreInvalidKeyError(errorMessage, {
                    cause: error,
                });
            }
            throw new error_1.AskarStoreError(`Error opening store ${storeConfig.id}: ${error.message}`, { cause: error });
        }
    }
    /**
     * Rotate the key of the current askar store.
     *
     * NOTE: multiple agent contexts (tenants) can use the same store. This method rotates the key for the whole store,
     * it is advised to only run this method on the root tenant agent when using profile per wallet database strategy.
     * After running this method you should change the store configuration in the Askar module.
     *
     * @throws {AskarStoreNotFoundError} if the wallet does not exist
     * @throws {AskarStoreError} if another error occurs
     */
    async rotateStoreKey(agentContext, options) {
        this.ensureStoreLevel(agentContext);
        const store = this.getStore(agentContext);
        if (!store) {
            throw new error_1.AskarStoreError('Store needs to be open to rotate the wallet key');
        }
        const storeConfig = await this.getStoreConfig(agentContext);
        try {
            await store.rekey({
                passKey: options.newKey,
                keyMethod: (0, utils_2.keyDerivationMethodFromStoreConfig)(options.newKeyDerivationMethod ?? storeConfig.keyDerivationMethod),
            });
        }
        catch (error) {
            const errorMessage = `Error rotating key for store '${storeConfig.id}': ${error.message}`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    /**
     * Exports the current askar store.
     *
     * NOTE: a store can contain profiles for multiple tenants. When you export a store
     * all profiles will be exported with it.
     */
    async exportStore(agentContext, options) {
        this.ensureStoreLevel(agentContext);
        const store = this.getStore(agentContext);
        if (!store) {
            throw new error_1.AskarStoreError('Unable to export store. No store available on agent context');
        }
        const currentStoreConfig = await this.getStoreConfig(agentContext);
        try {
            const newAskarStoreConfig = this.getAskarStoreConfig(options.exportToStore);
            // If path based store, ensure path does not exist yet, and create new store path
            if (newAskarStoreConfig.path) {
                // Export path already exists
                if (await this.fileSystem.exists(newAskarStoreConfig.path)) {
                    throw new error_1.AskarStoreExportPathExistsError(`Unable to create export, wallet export at path '${newAskarStoreConfig.path}' already exists`);
                }
                // Make sure destination path exists
                await this.fileSystem.createDirectory(newAskarStoreConfig.path);
            }
            await store.copyTo({
                recreate: false,
                uri: newAskarStoreConfig.uri,
                keyMethod: newAskarStoreConfig.keyMethod,
                passKey: newAskarStoreConfig.passKey,
            });
        }
        catch (error) {
            const errorMessage = `Error exporting store '${currentStoreConfig.id}': ${error.message}`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            if (error instanceof error_1.AskarStoreExportPathExistsError)
                throw error;
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    /**
     * Imports from an external store config into the current askar store config.
     */
    async importStore(agentContext, options) {
        this.ensureStoreLevel(agentContext);
        if (this.getStore(agentContext)) {
            throw new error_1.AskarStoreError('To import a store the current store needs to be closed first');
        }
        const destinationStoreConfig = await this.getStoreConfig(agentContext);
        const sourceAskarStoreConfig = this.getAskarStoreConfig(options.importFromStore);
        const destinationAskarStoreConfig = this.getAskarStoreConfig(destinationStoreConfig);
        let sourceWalletStore = undefined;
        try {
            if (destinationAskarStoreConfig.path) {
                // Import path already exists
                if (await this.fileSystem.exists(destinationAskarStoreConfig.path)) {
                    throw new error_1.AskarStoreImportPathExistsError(`Unable to import store. Path '${destinationAskarStoreConfig.path}' already exists`);
                }
                await this.fileSystem.createDirectory(destinationAskarStoreConfig.path);
            }
            // Open imported wallet and copy to destination
            sourceWalletStore = await askar_shared_1.Store.open({
                uri: sourceAskarStoreConfig.uri,
                keyMethod: sourceAskarStoreConfig.keyMethod,
                passKey: sourceAskarStoreConfig.passKey,
            });
            await sourceWalletStore.copyTo({
                recreate: false,
                uri: destinationAskarStoreConfig.uri,
                keyMethod: destinationAskarStoreConfig.keyMethod,
                passKey: destinationAskarStoreConfig.passKey,
            });
            await sourceWalletStore.close();
        }
        catch (error) {
            await sourceWalletStore?.close();
            const errorMessage = `Error importing store '${options.importFromStore.id}': ${error.message}`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            if (error instanceof error_1.AskarStoreImportPathExistsError)
                throw error;
            // Cleanup any wallet file we could have created
            if (destinationAskarStoreConfig.path && (await this.fileSystem.exists(destinationAskarStoreConfig.path))) {
                await this.fileSystem.delete(destinationAskarStoreConfig.path);
            }
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    /**
     * Delete the current askar store.
     *
     * NOTE: multiple agent contexts (tenants) can use the same store. This method deletes the whole store,
     * and if you're using multi-tenancy with profile per wallet it is advised to only run this method on the root tenant agent.
     *
     * @throws {AskarStoreNotFoundError} if the wallet does not exist
     * @throws {AskarStoreError} if another error occurs
     */
    async deleteStore(agentContext) {
        this.ensureStoreLevel(agentContext);
        if (this.getStore(agentContext)) {
            await this.closeStore(agentContext);
        }
        const storeConfig = await this.getStoreConfig(agentContext);
        const askarStoreConfig = this.getAskarStoreConfig(storeConfig);
        agentContext.config.logger.info(`Deleting store '${storeConfig.id}'`);
        try {
            await askar_shared_1.Store.remove(askarStoreConfig.uri);
            // Clear the store instance
            agentContext.dependencyManager.registerInstance(askar_shared_1.Store, undefined);
        }
        catch (error) {
            const errorMessage = `Error deleting store '${storeConfig.id}': ${error.message}`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    /**
     * Close the current askar store
     */
    async closeStore(agentContext) {
        this.ensureStoreLevel(agentContext);
        const store = this.getStore(agentContext);
        if (!store) {
            throw new error_1.AskarStoreError('There is no open store.');
        }
        const storeConfig = await this.getStoreConfig(agentContext);
        try {
            agentContext.config.logger.debug(`Closing store '${storeConfig.id}'`);
            await store.close();
            // Unregister the store from the context
            agentContext.dependencyManager.registerInstance(askar_shared_1.Store, undefined);
        }
        catch (error) {
            const errorMessage = `Error closing store '${storeConfig.id}': ${error.message}`;
            agentContext.config.logger.error(errorMessage, {
                error,
                errorMessage: error.message,
            });
            throw new error_1.AskarStoreError(errorMessage, { cause: error });
        }
    }
    getAskarStoreConfig(storeConfig) {
        const { uri, path } = (0, utils_2.uriFromStoreConfig)(storeConfig, this.fileSystem.dataPath);
        return {
            uri,
            path,
            profile: storeConfig.id,
            keyMethod: new askar_shared_1.StoreKeyMethod((storeConfig.keyDerivationMethod ?? askar_shared_1.KdfMethod.Argon2IMod)),
            passKey: storeConfig.key,
        };
    }
    /**
     * Run callback with a transaction. If the callback resolves the transaction
     * will be committed if the transaction is not closed yet. If the callback rejects
     * the transaction will be rolled back if the transaction is not closed yet.
     *
     * TODO: update to new `using` syntax so we don't have to use a callback
     */
    async withTransaction(agentContext, callback) {
        return this._withSession(agentContext, callback, true);
    }
    /**
     * Run callback with the session provided, the session will
     * be closed once the callback resolves or rejects if it is not closed yet.
     *
     * TODO: update to new `using` syntax so we don't have to use a callback
     */
    async withSession(agentContext, callback) {
        return this._withSession(agentContext, callback, false);
    }
    getStore(agentContext, { recursive = false } = {}) {
        const isRegistered = agentContext.dependencyManager.isRegistered(askar_shared_1.Store, recursive);
        if (!isRegistered)
            return null;
        // We set the store value to undefined in the dependency manager
        // when closing it, but TSyringe still marks is as registered, but
        // will throw an error when resolved. Since there is no unregister method
        // we wrap it with a try-catch
        try {
            return agentContext.dependencyManager.resolve(askar_shared_1.Store);
        }
        catch {
            return null;
        }
    }
    async _withSession(agentContext, callback, transaction = false) {
        let session = undefined;
        try {
            const { store, profile } = await this.getInitializedStoreWithProfile(agentContext);
            session = await (transaction ? store.transaction(profile) : store.session(profile))
                .open()
                .catch(async (error) => {
                // If the profile does not exist yet we create it
                // TODO: do we want some guards around this? I think this is really the easist approach to
                // just create it if it doesn't exist yet.
                if ((0, utils_2.isAskarError)(error, utils_2.AskarErrorCode.NotFound) && profile) {
                    await store.createProfile(profile);
                    const session = await store.session(profile).open();
                    try {
                        // For new profiles we need to set the framework storage version
                        await this.setCurrentFrameworkStorageVersionOnSession(session);
                    }
                    catch (error) {
                        await session.close();
                        throw error;
                    }
                    return session;
                }
                throw error;
            });
            const result = await callback(session);
            if (transaction && session.handle) {
                await session.commit();
            }
            return result;
        }
        catch (error) {
            agentContext.config.logger.error('Error occured during tranaction, rollback');
            if (transaction && session?.handle) {
                await session.rollback();
            }
            throw error;
        }
        finally {
            if (session?.handle) {
                await session.close();
            }
        }
    }
    async getInitializedStoreWithProfile(agentContext) {
        let store = this.getStore(agentContext, {
            // In case we use a profile per wallet, we want to use the parent store, otherwise we only
            // want to use a store that is directly registered on this context.
            recursive: this.config.multiWalletDatabaseScheme === AskarModuleConfig_1.AskarMultiWalletDatabaseScheme.ProfilePerWallet,
        });
        if (!store) {
            try {
                store = await this.openStore(agentContext);
            }
            catch (error) {
                if (error instanceof error_1.AskarStoreNotFoundError) {
                    store = await this.provisionStore(agentContext);
                }
                else {
                    throw error;
                }
            }
        }
        return {
            // If we're on store level the default profile can be used automatically
            // otherwise we need to set the profile, which we do based on the context correlation id
            profile: this.isStoreLevel(agentContext) ? undefined : agentContext.contextCorrelationId,
            store,
        };
    }
    /**
     * Ensures a command is ran on a store level, preventing a tenant instance from
     * removing a whole store (and potentially other tennats).
     */
    ensureStoreLevel(agentContext) {
        if (this.isStoreLevel(agentContext))
            return;
        throw new error_1.AskarError(`Agent context ${agentContext.contextCorrelationId} is not on store level. Make sure to only perform askar store operations in the agent context managing the askar store`);
    }
    /**
     * Checks whether the current agent context is on store level
     */
    isStoreLevel(agentContext) {
        if (agentContext.isRootAgentContext)
            return true;
        return this.config.multiWalletDatabaseScheme === AskarModuleConfig_1.AskarMultiWalletDatabaseScheme.DatabasePerWallet;
    }
};
exports.AskarStoreManager = AskarStoreManager;
exports.AskarStoreManager = AskarStoreManager = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(core_1.InjectionSymbols.FileSystem)),
    __metadata("design:paramtypes", [Object, AskarModuleConfig_1.AskarModuleConfig])
], AskarStoreManager);
//# sourceMappingURL=AskarStoreManager.js.map