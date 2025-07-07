"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultDidcommModules = getDefaultDidcommModules;
const DidCommModule_1 = require("../DidCommModule");
const modules_1 = require("../modules");
// TODO: we should reduce the default didcomm modules. E.g. you don't
// need the mediator, basic messages, credentials, or proofs module
function getDefaultDidcommModules(didcommModuleConfig) {
    return {
        didcomm: new DidCommModule_1.DidCommModule(didcommModuleConfig),
        connections: new modules_1.ConnectionsModule(),
        credentials: new modules_1.CredentialsModule(),
        proofs: new modules_1.ProofsModule(),
        mediator: new modules_1.MediatorModule(),
        discovery: new modules_1.DiscoverFeaturesModule(),
        mediationRecipient: new modules_1.MediationRecipientModule(),
        messagePickup: new modules_1.MessagePickupModule(),
        basicMessages: new modules_1.BasicMessagesModule(),
        oob: new modules_1.OutOfBandModule(),
    };
}
//# sourceMappingURL=modules.js.map