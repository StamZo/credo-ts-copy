"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_VERSION_RECORD_ID = exports.CURRENT_FRAMEWORK_STORAGE_VERSION = exports.supportedUpdates = exports.DEFAULT_UPDATE_CONFIG = exports.INITIAL_STORAGE_VERSION = void 0;
const _0_3_0_3_1_1 = require("./updates/0.3-0.3.1");
const _0_3_1_0_4_1 = require("./updates/0.3.1-0.4");
const _0_4_0_5_1 = require("./updates/0.4-0.5");
exports.INITIAL_STORAGE_VERSION = '0.1';
exports.DEFAULT_UPDATE_CONFIG = {
    v0_1ToV0_2: {
        mediationRoleUpdateStrategy: 'recipientIfEndpoint',
    },
};
exports.supportedUpdates = [
    {
        fromVersion: '0.1',
        toVersion: '0.2',
        doUpdate: () => { }, // Nothing to do in Core module
    },
    {
        fromVersion: '0.2',
        toVersion: '0.3',
        doUpdate: () => { }, // Nothing to do in Core module
    },
    {
        fromVersion: '0.3',
        toVersion: '0.3.1',
        doUpdate: _0_3_0_3_1_1.updateV0_3ToV0_3_1,
    },
    {
        fromVersion: '0.3.1',
        toVersion: '0.4',
        doUpdate: _0_3_1_0_4_1.updateV0_3_1ToV0_4,
    },
    {
        fromVersion: '0.4',
        toVersion: '0.5',
        doUpdate: _0_4_0_5_1.updateV0_4ToV0_5,
    },
];
// Current version is last toVersion from the supported updates
exports.CURRENT_FRAMEWORK_STORAGE_VERSION = exports.supportedUpdates[exports.supportedUpdates.length - 1].toVersion;
exports.STORAGE_VERSION_RECORD_ID = 'STORAGE_VERSION_RECORD_ID';
//# sourceMappingURL=updates.js.map