"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyDidSecp256k1 = void 0;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
const verificationMethod_1 = require("../verificationMethod");
exports.keyDidSecp256k1 = {
    PublicJwkTypes: [kms_1.Secp256k1PublicJwk],
    supportedVerificationMethodTypes: [
        verificationMethod_1.VERIFICATION_METHOD_TYPE_ECDSA_SECP256K1_VERIFICATION_KEY_2019,
        verificationMethod_1.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020,
        verificationMethod_1.VERIFICATION_METHOD_TYPE_MULTIKEY,
    ],
    getVerificationMethods: (did, publicJwk) => [(0, verificationMethod_1.getJsonWebKey2020)({ did, publicJwk })],
    getPublicJwkFromVerificationMethod: (verificationMethod) => {
        if ((0, verificationMethod_1.isEcdsaSecp256k1VerificationKey2019)(verificationMethod)) {
            return (0, verificationMethod_1.getPublicJwkFromEcdsaSecp256k1VerificationKey2019)(verificationMethod);
        }
        throw new error_1.CredoError(`Verification method with type '${verificationMethod.type}' not supported for key type Secp256K1`);
    },
};
//# sourceMappingURL=secp256k1.js.map