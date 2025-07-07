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
exports.OpenId4VcIssuanceSessionRecord = void 0;
const core_1 = require("@credo-ts/core");
const class_transformer_1 = require("class-transformer");
const OpenId4VcIssuanceSessionState_1 = require("../OpenId4VcIssuanceSessionState");
class OpenId4VcIssuanceSessionRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = OpenId4VcIssuanceSessionRecord.type;
        /**
         * The credentials that were issued during this session.
         */
        this.issuedCredentials = [];
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this._tags = props.tags ?? {};
            this.issuerId = props.issuerId;
            this.clientId = props.clientId;
            this.userPin = props.userPin;
            this.preAuthorizedCode = props.preAuthorizedCode;
            this.pkce = props.pkce;
            this.authorization = props.authorization;
            this.credentialOfferUri = props.credentialOfferUri;
            this.credentialOfferId = props.credentialOfferId;
            this.credentialOfferPayload = props.credentialOfferPayload;
            this.issuanceMetadata = props.issuanceMetadata;
            this.dpop = props.dpop;
            this.walletAttestation = props.walletAttestation;
            this.state = props.state;
            this.errorMessage = props.errorMessage;
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new core_1.CredoError(`OpenId4VcIssuanceSessionRecord is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
    getTags() {
        return {
            ...this._tags,
            issuerId: this.issuerId,
            credentialOfferUri: this.credentialOfferUri,
            credentialOfferId: this.credentialOfferId,
            state: this.state,
            // Pre-auth flow
            preAuthorizedCode: this.preAuthorizedCode,
            // Auth flow
            issuerState: this.authorization?.issuerState,
            authorizationCode: this.authorization?.code,
            authorizationSubject: this.authorization?.subject,
            // Presentation during issuance
            presentationAuthSession: this.presentation?.authSession,
        };
    }
}
exports.OpenId4VcIssuanceSessionRecord = OpenId4VcIssuanceSessionRecord;
OpenId4VcIssuanceSessionRecord.type = 'OpenId4VcIssuanceSessionRecord';
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        // CredentialIssued is an old state that is no longer used. It should be mapped to Error.
        if (value === 'CredentialIssued') {
            return OpenId4VcIssuanceSessionState_1.OpenId4VcIssuanceSessionState.Error;
        }
        return value;
    }),
    __metadata("design:type", String)
], OpenId4VcIssuanceSessionRecord.prototype, "state", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ type, value }) => {
        if (type === class_transformer_1.TransformationType.PLAIN_TO_CLASS && (0, core_1.isJsonObject)(value) && typeof value.codeExpiresAt === 'string') {
            return {
                ...value,
                codeExpiresAt: new Date(value.codeExpiresAt),
            };
        }
        if (type === class_transformer_1.TransformationType.CLASS_TO_CLASS && (0, core_1.isJsonObject)(value) && value.codeExpiresAt instanceof Date) {
            return {
                ...value,
                codeExpiresAt: new Date(value.codeExpiresAt.getTime()),
            };
        }
        if (type === class_transformer_1.TransformationType.CLASS_TO_PLAIN && (0, core_1.isJsonObject)(value) && value.codeExpiresAt instanceof Date) {
            return {
                ...value,
                codeExpiresAt: value.codeExpiresAt.toISOString(),
            };
        }
        return value;
    }),
    __metadata("design:type", Object)
], OpenId4VcIssuanceSessionRecord.prototype, "authorization", void 0);
//# sourceMappingURL=OpenId4VcIssuanceSessionRecord.js.map