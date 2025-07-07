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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarApi = void 0;
const core_1 = require("@credo-ts/core");
const tsyringe_1 = require("tsyringe");
const AskarModuleConfig_1 = require("./AskarModuleConfig");
const AskarStoreManager_1 = require("./AskarStoreManager");
let AskarApi = class AskarApi {
    constructor(agentContext, askarStoreManager, config) {
        this.agentContext = agentContext;
        this.askarStoreManager = askarStoreManager;
        this.config = config;
    }
    get isStoreOpen() {
        return this.askarStoreManager.isStoreOpen(this.agentContext);
    }
    /**
     * @throws {AskarStoreDuplicateError} if the wallet already exists
     * @throws {AskarStoreError} if another error occurs
     */
    async provisionStore() {
        await this.askarStoreManager.provisionStore(this.agentContext);
    }
    /**
     * @throws {AskarStoreNotFoundError} if the wallet does not exist
     * @throws {AskarStoreError} if another error occurs
     */
    async openStore() {
        await this.askarStoreManager.openStore(this.agentContext);
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
    async rotateStoreKey(options) {
        await this.askarStoreManager.rotateStoreKey(this.agentContext, options);
    }
    /**
     * Exports the current askar store.
     *
     * NOTE: a store can contain profiles for multiple tenants. When you export a store
     * all profiles will be exported with it.
     *
     * NOTE: store must be open before store can be expored
     */
    async exportStore(options) {
        await this.askarStoreManager.exportStore(this.agentContext, options);
    }
    /**
     * Imports from an external store config into the current askar store config.
     *
     * NOTE: store must be closed first (using `closeStore`) before store can be imported
     */
    async importStore(options) {
        await this.askarStoreManager.importStore(this.agentContext, options);
    }
    /**
     * Delete the current askar store.
     *
     * NOTE: multiple agent contexts (tenants) can use the same store. This method deletes the whole store.
     *
     *
     * @throws {AskarStoreNotFoundError} if the wallet does not exist
     * @throws {AskarStoreError} if another error occurs
     */
    async deleteStore() {
        await this.askarStoreManager.deleteStore(this.agentContext);
    }
    /**
     * Close the current askar store.
     *
     * This will close all sessions (also for tenants) in this store.
     */
    async closeStore() {
        await this.askarStoreManager.closeStore(this.agentContext);
    }
};
exports.AskarApi = AskarApi;
exports.AskarApi = AskarApi = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [core_1.AgentContext,
        AskarStoreManager_1.AskarStoreManager,
        AskarModuleConfig_1.AskarModuleConfig])
], AskarApi);
//# sourceMappingURL=AskarApi.js.map