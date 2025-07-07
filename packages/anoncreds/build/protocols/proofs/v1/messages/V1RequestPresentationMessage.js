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
exports.V1RequestPresentationMessage = exports.INDY_PROOF_REQUEST_ATTACHMENT_ID = void 0;
const didcomm_1 = require("@credo-ts/didcomm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.INDY_PROOF_REQUEST_ATTACHMENT_ID = 'libindy-request-presentation-0';
/**
 * Request Presentation Message part of Present Proof Protocol used to initiate request from verifier to prover.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#request-presentation
 */
class V1RequestPresentationMessage extends didcomm_1.AgentMessage {
    constructor(options) {
        super();
        this.allowDidSovPrefix = true;
        this.type = V1RequestPresentationMessage.type.messageTypeUri;
        if (options) {
            this.id = options.id ?? this.generateId();
            this.comment = options.comment;
            this.requestAttachments = options.requestAttachments;
        }
    }
    get indyProofRequest() {
        const attachment = this.requestAttachments.find((attachment) => attachment.id === exports.INDY_PROOF_REQUEST_ATTACHMENT_ID);
        // Extract proof request from attachment
        return attachment?.getDataAsJson() ?? null;
    }
    getRequestAttachmentById(id) {
        return this.requestAttachments.find((attachment) => attachment.id === id);
    }
}
exports.V1RequestPresentationMessage = V1RequestPresentationMessage;
V1RequestPresentationMessage.type = (0, didcomm_1.parseMessageType)('https://didcomm.org/present-proof/1.0/request-presentation');
__decorate([
    (0, didcomm_1.IsValidMessageType)(V1RequestPresentationMessage.type),
    __metadata("design:type", Object)
], V1RequestPresentationMessage.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], V1RequestPresentationMessage.prototype, "comment", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'request_presentations~attach' }),
    (0, class_transformer_1.Type)(() => didcomm_1.Attachment),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({
        each: true,
    }),
    (0, class_validator_1.IsInstance)(didcomm_1.Attachment, { each: true }),
    __metadata("design:type", Array)
], V1RequestPresentationMessage.prototype, "requestAttachments", void 0);
//# sourceMappingURL=V1RequestPresentationMessage.js.map