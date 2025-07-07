"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyDidJsonWebKey = void 0;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
const verificationMethod_1 = require("../verificationMethod");
const JsonWebKey2020_1 = require("../verificationMethod/JsonWebKey2020");
exports.keyDidJsonWebKey = {
    PublicJwkTypes: [kms_1.P256PublicJwk, kms_1.P384PublicJwk, kms_1.P521PublicJwk],
    supportedVerificationMethodTypes: [JsonWebKey2020_1.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020],
    getVerificationMethods: (did, publicJwk) => [(0, verificationMethod_1.getJsonWebKey2020)({ did, publicJwk })],
    getPublicJwkFromVerificationMethod: () => {
        // This is handled on a higher level
        throw new error_1.CredoError('Not supported for key did json web key');
    },
};
//# sourceMappingURL=keyDidJsonWebKey.js.map