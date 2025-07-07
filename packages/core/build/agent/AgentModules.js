"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendModulesWithDefaultModules = extendModulesWithDefaultModules;
exports.getAgentApi = getAgentApi;
const cache_1 = require("../modules/cache");
const DcqlModule_1 = require("../modules/dcql/DcqlModule");
const dids_1 = require("../modules/dids");
const dif_presentation_exchange_1 = require("../modules/dif-presentation-exchange");
const generic_records_1 = require("../modules/generic-records");
const kms_1 = require("../modules/kms");
const MdocModule_1 = require("../modules/mdoc/MdocModule");
const sd_jwt_vc_1 = require("../modules/sd-jwt-vc");
const vc_1 = require("../modules/vc");
const x509_1 = require("../modules/x509");
/**
 * Method to get the default agent modules to be registered on any agent instance. It doens't configure the modules in any way,
 * and if that's needed the user needs to provide the module in the agent constructor
 */
function getDefaultAgentModules() {
    return {
        dcql: () => new DcqlModule_1.DcqlModule(),
        genericRecords: () => new generic_records_1.GenericRecordsModule(),
        dids: () => new dids_1.DidsModule(),
        w3cCredentials: () => new vc_1.W3cCredentialsModule(),
        cache: () => new cache_1.CacheModule({ cache: new cache_1.SingleContextStorageLruCache({ limit: 500 }) }),
        pex: () => new dif_presentation_exchange_1.DifPresentationExchangeModule(),
        sdJwtVc: () => new sd_jwt_vc_1.SdJwtVcModule(),
        x509: () => new x509_1.X509Module(),
        mdoc: () => new MdocModule_1.MdocModule(),
        kms: () => new kms_1.KeyManagementModule({}),
    };
}
/**
 * Extend the provided modules object with the default agent modules. If the modules property already contains a module with the same
 * name as a default module, the module won't be added to the extended module object. This allows users of the framework to override
 * the modules with custom configuration. The agent constructor type ensures you can't provide a different module for a key that registered
 * on the default agent.
 */
function extendModulesWithDefaultModules(modules) {
    const defaultAgentModules = getDefaultAgentModules();
    const defaultAgentModuleKeys = Object.keys(defaultAgentModules);
    const defaultModules = [];
    const customModules = Object.entries(modules ?? {}).filter(([key]) => !defaultAgentModuleKeys.includes(key));
    // Register all default modules, if not registered yet
    for (const [moduleKey, getConfiguredModule] of Object.entries(defaultAgentModules)) {
        // Prefer user-registered module, otherwise initialize the default module
        defaultModules.push([moduleKey, modules?.[moduleKey] ?? getConfiguredModule()]);
    }
    return Object.fromEntries([...defaultModules, ...customModules]);
}
/**
 * Get the agent api object based on the modules registered in the dependency manager. For each registered module on the
 * dependency manager, the method will extract the api class from the module, resolve it and assign it to the module key
 * as provided in the agent constructor (or the {@link getDefaultAgentModules} method).
 *
 * Modules that don't have an api class defined ({@link Module.api} is undefined) will be ignored and won't be added to the
 * api object.
 *
 * If the api of a module is passed in the `excluded` array, the api will not be added to the resulting api object.
 *
 * @example
 * If the dependency manager has the following modules configured:
 * ```ts
 * {
 *   connections: ConnectionsModule
 *   indy: IndyModule
 * }
 * ```
 *
 * And we call the `getAgentApi` method like this:
 * ```ts
 * const api = getAgentApi(dependencyManager)
 * ```
 *
 * the resulting agent api will look like:
 *
 * ```ts
 * {
 *   connections: ConnectionsApi
 * }
 * ```
 *
 * The `indy` module has been ignored because it doesn't define an api class.
 */
function getAgentApi(dependencyManager, excludedApis = []) {
    // Create the api object based on the `api` properties on the modules. If no `api` exists
    // on the module it will be ignored.
    const api = Object.entries(dependencyManager.registeredModules).reduce((api, [moduleKey, module]) => {
        // Module has no api
        if (!module.api)
            return api;
        const apiInstance = dependencyManager.resolve(module.api);
        // Api is excluded
        if (excludedApis.includes(apiInstance))
            return api;
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...api, [moduleKey]: apiInstance };
    }, {});
    return api;
}
//# sourceMappingURL=AgentModules.js.map