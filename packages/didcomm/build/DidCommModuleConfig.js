"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidCommModuleConfig = void 0;
const constants_1 = require("./constants");
const transport_1 = require("./transport");
const types_1 = require("./types");
class DidCommModuleConfig {
    constructor(options) {
        this.options = options ?? {};
        this._endpoints = options?.endpoints;
        this._queueTransportRepository = options?.queueTransportRepository ?? new transport_1.InMemoryQueueTransportRepository();
    }
    get endpoints() {
        // if endpoints is not set, return queue endpoint
        // https://github.com/hyperledger/aries-rfcs/issues/405#issuecomment-582612875
        if (!this._endpoints || this._endpoints.length === 0) {
            return [constants_1.DID_COMM_TRANSPORT_QUEUE];
        }
        return this._endpoints;
    }
    set endpoints(endpoints) {
        this._endpoints = endpoints;
    }
    get useDidSovPrefixWhereAllowed() {
        return this.options.useDidSovPrefixWhereAllowed ?? false;
    }
    /**
     * @todo move to context configuration
     */
    get connectionImageUrl() {
        return this.options.connectionImageUrl;
    }
    get processDidCommMessagesConcurrently() {
        return this.options.processDidCommMessagesConcurrently ?? false;
    }
    get didCommMimeType() {
        return this.options.didCommMimeType ?? types_1.DidCommMimeType.V1;
    }
    /**
     * Encode keys in did:key format instead of 'naked' keys, as stated in Aries RFC 0360.
     *
     * This setting will not be taken into account if the other party has previously used naked keys
     * in a given protocol (i.e. it does not support Aries RFC 0360).
     */
    get useDidKeyInProtocols() {
        return this.options.useDidKeyInProtocols ?? true;
    }
    /**
     * Allows to specify a custom queue transport queue. It defaults to an in-memory queue
     *
     */
    get queueTransportRepository() {
        return this._queueTransportRepository;
    }
}
exports.DidCommModuleConfig = DidCommModuleConfig;
//# sourceMappingURL=DidCommModuleConfig.js.map