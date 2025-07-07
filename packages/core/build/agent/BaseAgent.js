"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const dids_1 = require("../modules/dids");
const generic_records_1 = require("../modules/generic-records");
const kms_1 = require("../modules/kms");
const mdoc_1 = require("../modules/mdoc");
const sd_jwt_vc_1 = require("../modules/sd-jwt-vc");
const W3cCredentialsApi_1 = require("../modules/vc/W3cCredentialsApi");
const x509_1 = require("../modules/x509");
const AgentModules_1 = require("./AgentModules");
const EventEmitter_1 = require("./EventEmitter");
const context_1 = require("./context");
class BaseAgent {
    constructor(agentConfig, dependencyManager) {
        this.agentConfig = agentConfig;
        this.dependencyManager = dependencyManager;
        this._isInitialized = false;
        this.logger = this.agentConfig.logger;
        this.logger.info('Creating agent with config', {
            agentConfig: agentConfig.toJSON(),
        });
        // Resolve instances after everything is registered
        this.eventEmitter = this.dependencyManager.resolve(EventEmitter_1.EventEmitter);
        this.agentContext = this.dependencyManager.resolve(context_1.AgentContext);
        this.genericRecords = this.dependencyManager.resolve(generic_records_1.GenericRecordsApi);
        this.dids = this.dependencyManager.resolve(dids_1.DidsApi);
        this.w3cCredentials = this.dependencyManager.resolve(W3cCredentialsApi_1.W3cCredentialsApi);
        this.sdJwtVc = this.dependencyManager.resolve(sd_jwt_vc_1.SdJwtVcApi);
        this.x509 = this.dependencyManager.resolve(x509_1.X509Api);
        this.mdoc = this.dependencyManager.resolve(mdoc_1.MdocApi);
        this.kms = this.dependencyManager.resolve(kms_1.KeyManagementApi);
        const defaultApis = [
            this.genericRecords,
            this.dids,
            this.w3cCredentials,
            this.sdJwtVc,
            this.x509,
            this.mdoc,
            this.kms,
        ];
        // Set the api of the registered modules on the agent, excluding the default apis
        this.modules = (0, AgentModules_1.getAgentApi)(this.dependencyManager, defaultApis);
    }
    get isInitialized() {
        return this._isInitialized;
    }
    get config() {
        return this.agentConfig;
    }
    get context() {
        return this.agentContext;
    }
}
exports.BaseAgent = BaseAgent;
//# sourceMappingURL=BaseAgent.js.map