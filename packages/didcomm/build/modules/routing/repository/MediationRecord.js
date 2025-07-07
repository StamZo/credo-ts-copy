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
exports.MediationRecord = void 0;
const core_1 = require("@credo-ts/core");
const class_transformer_1 = require("class-transformer");
const MediatorPickupStrategy_1 = require("../MediatorPickupStrategy");
const MediationState_1 = require("../models/MediationState");
class MediationRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = MediationRecord.type;
        this.allowCache = true;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.connectionId = props.connectionId;
            this.threadId = props.threadId;
            this.recipientKeys = props.recipientKeys || [];
            this.routingKeys = props.routingKeys || [];
            this.state = props.state;
            this.role = props.role;
            this.endpoint = props.endpoint ?? undefined;
            this.pickupStrategy = props.pickupStrategy;
            this._tags = props.tags ?? {};
        }
    }
    getTags() {
        return {
            ...this._tags,
            state: this.state,
            role: this.role,
            connectionId: this.connectionId,
            threadId: this.threadId,
            recipientKeys: this.recipientKeys,
        };
    }
    addRecipientKey(recipientKey) {
        this.recipientKeys.push(recipientKey);
    }
    removeRecipientKey(recipientKey) {
        const index = this.recipientKeys.indexOf(recipientKey, 0);
        if (index > -1) {
            this.recipientKeys.splice(index, 1);
            return true;
        }
        return false;
    }
    get isReady() {
        return this.state === MediationState_1.MediationState.Granted;
    }
    assertReady() {
        if (!this.isReady) {
            throw new core_1.CredoError(`Mediation record is not ready to be used. Expected ${MediationState_1.MediationState.Granted}, found invalid state ${this.state}`);
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`Mediation record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
    assertRole(expectedRole) {
        if (this.role !== expectedRole) {
            throw new core_1.CredoError(`Mediation record has invalid role ${this.role}. Expected role ${expectedRole}.`);
        }
    }
}
exports.MediationRecord = MediationRecord;
MediationRecord.type = 'MediationRecord';
MediationRecord.allowCache = true;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'Explicit') {
            return MediatorPickupStrategy_1.MediatorPickupStrategy.PickUpV1;
        }
        return value;
    }),
    __metadata("design:type", String)
], MediationRecord.prototype, "pickupStrategy", void 0);
//# sourceMappingURL=MediationRecord.js.map