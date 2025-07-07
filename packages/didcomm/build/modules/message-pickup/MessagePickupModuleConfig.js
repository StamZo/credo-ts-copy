"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePickupModuleConfig = void 0;
class MessagePickupModuleConfig {
    constructor(options) {
        this.options = options;
    }
    /** See {@link MessagePickupModuleConfig.maximumBatchSize} */
    get maximumBatchSize() {
        return this.options.maximumBatchSize ?? 10;
    }
    /** See {@link MessagePickupModuleConfig.protocols} */
    get protocols() {
        return this.options.protocols;
    }
}
exports.MessagePickupModuleConfig = MessagePickupModuleConfig;
//# sourceMappingURL=MessagePickupModuleConfig.js.map