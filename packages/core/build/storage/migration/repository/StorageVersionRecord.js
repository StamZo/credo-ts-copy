"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageVersionRecord = void 0;
const BaseRecord_1 = require("../../BaseRecord");
const updates_1 = require("../updates");
class StorageVersionRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        super();
        this.type = StorageVersionRecord.type;
        if (props) {
            this.id = StorageVersionRecord.storageVersionRecordId;
            this.createdAt = props.createdAt ?? new Date();
            this.storageVersion = props.storageVersion;
        }
    }
    getTags() {
        return this._tags;
    }
    static get frameworkStorageVersion() {
        return updates_1.CURRENT_FRAMEWORK_STORAGE_VERSION;
    }
    static get storageVersionRecordId() {
        return updates_1.STORAGE_VERSION_RECORD_ID;
    }
}
exports.StorageVersionRecord = StorageVersionRecord;
StorageVersionRecord.type = 'StorageVersionRecord';
//# sourceMappingURL=StorageVersionRecord.js.map