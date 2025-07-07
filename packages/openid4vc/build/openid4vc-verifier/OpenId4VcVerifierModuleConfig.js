"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenId4VcVerifierModuleConfig = void 0;
const router_1 = require("../shared/router");
class OpenId4VcVerifierModuleConfig {
    constructor(options) {
        this.options = options;
        this.router = options.router ?? (0, router_1.importExpress)().Router();
    }
    get baseUrl() {
        return this.options.baseUrl;
    }
    /**
     * @default /authorize
     */
    get authorizationRequestEndpoint() {
        return this.options.endpoints?.authorizationRequest ?? '/authorization-requests';
    }
    /**
     * @default /authorize
     */
    get authorizationEndpoint() {
        return this.options.endpoints?.authorization ?? '/authorize';
    }
    /**
     * Time in seconds after which an authorization request will expire
     *
     * @default 300
     */
    get authorizationRequestExpiresInSeconds() {
        return this.options.authorizationRequestExpirationInSeconds ?? 300;
    }
}
exports.OpenId4VcVerifierModuleConfig = OpenId4VcVerifierModuleConfig;
//# sourceMappingURL=OpenId4VcVerifierModuleConfig.js.map