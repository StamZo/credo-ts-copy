"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyDidX25519 = void 0;
const error_1 = require("../../../../error");
const kms_1 = require("../../../kms");
const verificationMethod_1 = require("../verificationMethod");
exports.keyDidX25519 = {
    PublicJwkTypes: [kms_1.X25519PublicJwk],
    supportedVerificationMethodTypes: [
        verificationMethod_1.VERIFICATION_METHOD_TYPE_X25519_KEY_AGREEMENT_KEY_2019,
        verificationMethod_1.VERIFICATION_METHOD_TYPE_JSON_WEB_KEY_2020,
        verificationMethod_1.VERIFICATION_METHOD_TYPE_MULTIKEY,
    ],
    getVerificationMethods: (did, publicJwk) => [
        (0, verificationMethod_1.getX25519KeyAgreementKey2019)({ id: `${did}#${publicJwk.fingerprint}`, publicJwk, controller: did }),
    ],
    getPublicJwkFromVerificationMethod: (verificationMethod) => {
        if ((0, verificationMethod_1.isX25519KeyAgreementKey2019)(verificationMethod)) {
            return (0, verificationMethod_1.getPublicJwkFrommX25519KeyAgreementKey2019)(verificationMethod);
        }
        throw new error_1.CredoError(`Verification method with type '${verificationMethod.type}' not supported for key type X25519`);
    },
};
//# sourceMappingURL=x25519.js.map