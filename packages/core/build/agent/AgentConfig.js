"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentConfig = void 0;
const logger_1 = require("../logger");
class AgentConfig {
    constructor(initConfig, agentDependencies) {
        this.initConfig = initConfig;
        this.label = initConfig.label;
        this.logger = initConfig.logger ?? new logger_1.ConsoleLogger(logger_1.LogLevel.off);
        this.agentDependencies = agentDependencies;
    }
    get allowInsecureHttpUrls() {
        return this.initConfig.allowInsecureHttpUrls ?? false;
    }
    get autoUpdateStorageOnStartup() {
        return this.initConfig.autoUpdateStorageOnStartup ?? false;
    }
    extend(config) {
        return new AgentConfig({ ...this.initConfig, logger: this.logger, label: this.label, ...config }, this.agentDependencies);
    }
    toJSON() {
        return {
            ...this.initConfig,
            logger: this.logger.logLevel,
            agentDependencies: Boolean(this.agentDependencies),
            label: this.label,
        };
    }
}
exports.AgentConfig = AgentConfig;
//# sourceMappingURL=AgentConfig.js.map