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
exports.ConnectionRecord = void 0;
const core_1 = require("@credo-ts/core");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../models");
class ConnectionRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.connectionTypes = [];
        this.previousDids = [];
        this.previousTheirDids = [];
        this.type = ConnectionRecord.type;
        this.allowCache = ConnectionRecord.allowCache;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.did = props.did;
            this.invitationDid = props.invitationDid;
            this.theirDid = props.theirDid;
            this.theirLabel = props.theirLabel;
            this.state = props.state;
            this.role = props.role;
            this.alias = props.alias;
            this.autoAcceptConnection = props.autoAcceptConnection;
            this._tags = props.tags ?? {};
            this.threadId = props.threadId;
            this.imageUrl = props.imageUrl;
            this.mediatorId = props.mediatorId;
            this.errorMessage = props.errorMessage;
            this.protocol = props.protocol;
            this.outOfBandId = props.outOfBandId;
            this.connectionTypes = props.connectionTypes ?? [];
            this.previousDids = props.previousDids ?? [];
            this.previousTheirDids = props.previousTheirDids ?? [];
        }
    }
    getTags() {
        return {
            ...this._tags,
            state: this.state,
            role: this.role,
            threadId: this.threadId,
            mediatorId: this.mediatorId,
            did: this.did,
            theirDid: this.theirDid,
            outOfBandId: this.outOfBandId,
            invitationDid: this.invitationDid,
            connectionTypes: this.connectionTypes,
            previousDids: this.previousDids,
            previousTheirDids: this.previousTheirDids,
        };
    }
    get isRequester() {
        return this.role === models_1.DidExchangeRole.Requester;
    }
    get rfc0160State() {
        return (0, models_1.rfc0160StateFromDidExchangeState)(this.state);
    }
    get isReady() {
        return this.state && [models_1.DidExchangeState.Completed, models_1.DidExchangeState.ResponseSent].includes(this.state);
    }
    assertReady() {
        if (!this.isReady) {
            throw new core_1.CredoError(`Connection record is not ready to be used. Expected ${models_1.DidExchangeState.ResponseSent}, ${models_1.DidExchangeState.ResponseReceived} or ${models_1.DidExchangeState.Completed}, found invalid state ${this.state}`);
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`Connection record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
    assertRole(expectedRole) {
        if (this.role !== expectedRole) {
            throw new core_1.CredoError(`Connection record has invalid role ${this.role}. Expected role ${expectedRole}.`);
        }
    }
}
exports.ConnectionRecord = ConnectionRecord;
ConnectionRecord.type = 'ConnectionRecord';
ConnectionRecord.allowCache = true;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value || typeof value !== 'string' || value.endsWith('.x'))
            return value;
        return `${value.split('.').slice(0, -1).join('.')}.x`;
    }, { toClassOnly: true }),
    __metadata("design:type", String)
], ConnectionRecord.prototype, "protocol", void 0);
//# sourceMappingURL=ConnectionRecord.js.map