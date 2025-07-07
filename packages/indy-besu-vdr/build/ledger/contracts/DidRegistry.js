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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidRegistry = void 0;
const core_1 = require("@credo-ts/core");
const BaseContract_1 = require("./BaseContract");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const indy2_vdr_1 = require("indy2-vdr");
let DidRegistry = class DidRegistry extends BaseContract_1.BaseContract {
    constructor(client) {
        super(client);
    }
    async addDelegate(id, delegateType, delegate, validity, signer) {
        const transaction = await indy2_vdr_1.EthrDidRegistry.buildDidAddDelegateTransaction(this.client, signer.address, id, delegateType, delegate, validity);
        return this.signAndSubmit(transaction, signer);
    }
    async setAttribute(id, attribute, validity, signer) {
        const transaction = await indy2_vdr_1.EthrDidRegistry.buildDidSetAttributeTransaction(this.client, signer.address, id, attribute, validity);
        return this.signAndSubmit(transaction, signer);
    }
    async resolveDid(id) {
        return indy2_vdr_1.EthrDidRegistry.resolveDid(this.client, id, null);
    }
};
exports.DidRegistry = DidRegistry;
DidRegistry.config = {
    address: '0x0000000000000000000000000000000000018888',
    spec: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, './abi/EthereumExtDidRegistry.json'), 'utf8')),
};
exports.DidRegistry = DidRegistry = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [indy2_vdr_1.LedgerClient])
], DidRegistry);
//# sourceMappingURL=DidRegistry.js.map