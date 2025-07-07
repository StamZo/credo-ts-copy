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
exports.MenuRequestMessage = void 0;
const didcomm_1 = require("@credo-ts/didcomm");
/**
 * @internal
 */
class MenuRequestMessage extends didcomm_1.AgentMessage {
    constructor(options) {
        super();
        this.type = MenuRequestMessage.type.messageTypeUri;
        if (options) {
            this.id = options.id ?? this.generateId();
        }
    }
}
exports.MenuRequestMessage = MenuRequestMessage;
MenuRequestMessage.type = (0, didcomm_1.parseMessageType)('https://didcomm.org/action-menu/1.0/menu-request');
__decorate([
    (0, didcomm_1.IsValidMessageType)(MenuRequestMessage.type),
    __metadata("design:type", Object)
], MenuRequestMessage.prototype, "type", void 0);
//# sourceMappingURL=MenuRequestMessage.js.map