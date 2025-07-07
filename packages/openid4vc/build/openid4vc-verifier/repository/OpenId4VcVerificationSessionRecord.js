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
exports.OpenId4VcVerificationSessionRecord = void 0;
const core_1 = require("@credo-ts/core");
class OpenId4VcVerificationSessionRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = OpenId4VcVerificationSessionRecord.type;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this._tags = props.tags ?? {};
            this.verifierId = props.verifierId;
            this.state = props.state;
            this.errorMessage = props.errorMessage;
            this.authorizationRequestPayload = props.authorizationRequestPayload;
            this.authorizationRequestJwt = props.authorizationRequestJwt;
            this.authorizationRequestUri = props.authorizationRequestUri;
            this.authorizationRequestId = props.authorizationRequestId;
            this.authorizationResponsePayload = props.authorizationResponsePayload;
            this.expiresAt = props.expiresAt;
            this.presentationDuringIssuanceSession = props.presentationDuringIssuanceSession;
        }
    }
    get request() {
        if (this.authorizationRequestJwt)
            return this.authorizationRequestJwt;
        if (this.authorizationRequestPayload)
            return this.authorizationRequestPayload;
        throw new core_1.CredoError('Unable to extract authorization payload from openid4vc session record');
    }
    get requestPayload() {
        if (this.authorizationRequestJwt)
            return core_1.Jwt.fromSerializedJwt(this.authorizationRequestJwt).payload.toJson();
        if (this.authorizationRequestPayload)
            return this.authorizationRequestPayload;
        throw new core_1.CredoError('Unable to extract authorization payload from openid4vc session record');
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`OpenId4VcVerificationSessionRecord is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
    getTags() {
        const request = this.requestPayload;
        const nonce = request.nonce;
        const payloadState = 'state' in request ? request.state : undefined;
        return {
            ...this._tags,
            verifierId: this.verifierId,
            state: this.state,
            nonce,
            payloadState,
            authorizationRequestUri: this.authorizationRequestUri,
            authorizationRequestId: this.authorizationRequestId,
        };
    }
}
exports.OpenId4VcVerificationSessionRecord = OpenId4VcVerificationSessionRecord;
OpenId4VcVerificationSessionRecord.type = 'OpenId4VcVerificationSessionRecord';
__decorate([
    (0, core_1.DateTransformer)(),
    __metadata("design:type", Date
    /**
     * The payload of the received authorization response
     */
    )
], OpenId4VcVerificationSessionRecord.prototype, "expiresAt", void 0);
//# sourceMappingURL=OpenId4VcVerificationSessionRecord.js.map