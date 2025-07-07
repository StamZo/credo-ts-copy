"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAskarStoreConfigForContextCorrelationId = storeAskarStoreConfigForContextCorrelationId;
exports.getAskarStoreConfigForContextCorrelationId = getAskarStoreConfigForContextCorrelationId;
const core_1 = require("@credo-ts/core");
const error_1 = require("./error");
const ASKAR_STORE_CONFIG_METADATA_KEY = '_askar/storeConfig';
/**
 * Store the aksar store config associated with a context correlation id. If multi-tenancy is not used
 * this method won't do anything as we can just use the store config from the default context. However
 * if multi-tenancy is used, we will store the askar store config in the tenant record metadata so it can
 * be queried when a wallet is opened.
 *
 * This method will only be used when using the DatabasePerWallet database scheme, where each wallet has it's own
 * database and also it's own encryption key.
 */
async function storeAskarStoreConfigForContextCorrelationId(agentContext, config) {
    // It's kind of hacky, but we add support for the tenants module specifically here to map an actorId to
    // a specific tenant. Otherwise we have to expose /:contextCorrelationId/:actorId in all the public URLs
    // which is of course not so nice.
    const tenantsApi = (0, core_1.getApiForModuleByName)(agentContext, 'TenantsModule');
    if (!tenantsApi || agentContext.isRootAgentContext) {
        throw new error_1.AskarError('Tenants module is not registered, make sure to only call this method when the tenants module is enabled');
    }
    // TODO: we duplicate this logic, would be good to keep it in one place
    const tenantId = agentContext.contextCorrelationId.replace('tenant-', '');
    // We don't want to query the tenant record if the current context is the root context
    const tenantRecord = await tenantsApi.getTenantById(tenantId);
    tenantRecord.metadata.set(ASKAR_STORE_CONFIG_METADATA_KEY, config);
    await tenantsApi.updateTenant(tenantRecord);
}
async function getAskarStoreConfigForContextCorrelationId(agentContext) {
    // It's kind of hacky, but we add support for the tenants module specifically here
    const tenantsApi = (0, core_1.getApiForModuleByName)(agentContext, 'TenantsModule');
    if (!tenantsApi || agentContext.isRootAgentContext) {
        throw new error_1.AskarError('Tenants module is not registered, make sure to only call this method when the tenants module is enabled');
    }
    // TODO: we duplicate this logic, would be good to keep it in one place
    const tenantId = agentContext.contextCorrelationId.replace('tenant-', '');
    const tenantRecord = await tenantsApi.getTenantById(tenantId);
    const storeConfig = tenantRecord.metadata.get(ASKAR_STORE_CONFIG_METADATA_KEY);
    if (storeConfig)
        return storeConfig;
    const { walletConfig } = tenantRecord.config;
    // for backwards compatibility we also look at the walletConfig.key
    if (walletConfig) {
        // Update so we can access it directly next time
        tenantRecord.metadata.set(ASKAR_STORE_CONFIG_METADATA_KEY, {
            key: walletConfig.key,
        });
        await tenantsApi.updateTenant(tenantRecord);
        return {
            key: walletConfig.key,
        };
    }
    throw new error_1.AskarError('Unable to extract askar store from tenant record');
}
//# sourceMappingURL=tenants.js.map