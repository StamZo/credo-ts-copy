"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDidDocumentForPublicJwk = getDidDocumentForPublicJwk;
exports.getJsonWebKey2020DidDocument = getJsonWebKey2020DidDocument;
const error_1 = require("../../../error");
const constants_1 = require("../../vc/constants");
const constants_2 = require("../../vc/data-integrity/signature-suites/ed25519/constants");
const kms_1 = require("../../kms");
const PublicJwk_1 = require("../../kms/jwk/PublicJwk");
const DidDocumentBuilder_1 = require("./DidDocumentBuilder");
const ed25519_1 = require("./key-type/ed25519");
const verificationMethod_1 = require("./verificationMethod");
function getDidDocumentForPublicJwk(did, publicJwk) {
    if (publicJwk.is(kms_1.Ed25519PublicJwk)) {
        return getEd25519DidDoc(did, publicJwk);
    }
    if (publicJwk.is(kms_1.X25519PublicJwk)) {
        return getX25519DidDoc(did, publicJwk);
    }
    if (publicJwk.is(kms_1.P256PublicJwk) ||
        publicJwk.is(kms_1.P384PublicJwk) ||
        publicJwk.is(kms_1.P521PublicJwk) ||
        publicJwk.is(kms_1.Secp256k1PublicJwk)) {
        return getJsonWebKey2020DidDocument(did, publicJwk);
    }
    throw new error_1.CredoError(`Unsupported public key type for did document: ${(0, kms_1.getJwkHumanDescription)(publicJwk.toJson())}`);
}
function getJsonWebKey2020DidDocument(did, publicJwk) {
    const verificationMethod = (0, verificationMethod_1.getJsonWebKey2020)({ did, publicJwk });
    const didDocumentBuilder = new DidDocumentBuilder_1.DidDocumentBuilder(did);
    didDocumentBuilder.addContext(constants_1.SECURITY_JWS_CONTEXT_URL).addVerificationMethod(verificationMethod);
    if (publicJwk.supportedSignatureAlgorithms.length === 0 &&
        publicJwk.supportdEncryptionKeyAgreementAlgorithms.length === 0) {
        throw new error_1.CredoError('Key must support at least signing or encrypting');
    }
    if (publicJwk.supportedSignatureAlgorithms.length > 0) {
        didDocumentBuilder
            .addAuthentication(verificationMethod.id)
            .addAssertionMethod(verificationMethod.id)
            .addCapabilityDelegation(verificationMethod.id)
            .addCapabilityInvocation(verificationMethod.id);
    }
    if (publicJwk.supportdEncryptionKeyAgreementAlgorithms.length > 0) {
        didDocumentBuilder.addKeyAgreement(verificationMethod.id);
    }
    return didDocumentBuilder.build();
}
function getEd25519DidDoc(did, publicJwk) {
    const verificationMethod = (0, verificationMethod_1.getEd25519VerificationKey2018)({
        id: `${did}#${publicJwk.fingerprint}`,
        publicJwk,
        controller: did,
    });
    const publicKeyX25519 = (0, ed25519_1.convertPublicKeyToX25519)(publicJwk.publicKey.publicKey);
    const publicJwkX25519 = PublicJwk_1.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'X25519',
        publicKey: publicKeyX25519,
    });
    const x25519VerificationMethod = (0, verificationMethod_1.getX25519KeyAgreementKey2019)({
        id: `${did}#${publicJwkX25519.fingerprint}`,
        publicJwk: publicJwkX25519,
        controller: did,
    });
    const didDocBuilder = getSignatureKeyBase({ did, publicJwk, verificationMethod });
    didDocBuilder
        .addContext(constants_2.ED25519_SUITE_CONTEXT_URL_2018)
        .addContext(constants_1.SECURITY_X25519_CONTEXT_URL)
        .addKeyAgreement(x25519VerificationMethod);
    return didDocBuilder.build();
}
function getX25519DidDoc(did, publicJwk) {
    const verificationMethod = (0, verificationMethod_1.getX25519KeyAgreementKey2019)({
        id: `${did}#${publicJwk.fingerprint}`,
        publicJwk,
        controller: did,
    });
    const document = new DidDocumentBuilder_1.DidDocumentBuilder(did)
        .addKeyAgreement(verificationMethod)
        .addContext(constants_1.SECURITY_X25519_CONTEXT_URL)
        .build();
    return document;
}
function getSignatureKeyBase({ did, publicJwk, verificationMethod, }) {
    const keyId = `${did}#${publicJwk.fingerprint}`;
    return new DidDocumentBuilder_1.DidDocumentBuilder(did)
        .addVerificationMethod(verificationMethod)
        .addAuthentication(keyId)
        .addAssertionMethod(keyId)
        .addCapabilityDelegation(keyId)
        .addCapabilityInvocation(keyId);
}
//# sourceMappingURL=keyDidDocument.js.map