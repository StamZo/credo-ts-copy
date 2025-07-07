"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRoutingRecord = void 0;
const core_1 = require("@credo-ts/core");
class TenantRoutingRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = TenantRoutingRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this._tags = props.tags ?? {};
            this.tenantId = props.tenantId;
            this.recipientKeyFingerprint = props.recipientKeyFingerprint;
        }
    }
    getTags() {
        return {
            ...this._tags,
            tenantId: this.tenantId,
            recipientKeyFingerprint: this.recipientKeyFingerprint,
        };
    }
}
exports.TenantRoutingRecord = TenantRoutingRecord;
TenantRoutingRecord.type = 'TenantRoutingRecord';
//# sourceMappingURL=TenantRoutingRecord.js.map