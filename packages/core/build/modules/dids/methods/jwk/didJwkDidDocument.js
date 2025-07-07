"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDidJwkDocument = getDidJwkDocument;
const error_1 = require("../../../../error");
const constants_1 = require("../../../vc/constants");
const domain_1 = require("../../domain");
function getDidJwkDocument(didJwk) {
    if (!didJwk.allowsEncrypting && !didJwk.allowsSigning) {
        throw new error_1.CredoError('At least one of allowsSigning or allowsEncrypting must be enabled');
    }
    const verificationMethod = (0, domain_1.getJsonWebKey2020)({
        did: didJwk.did,
        publicJwk: didJwk.publicJwk,
        verificationMethodId: didJwk.verificationMethodId,
    });
    const didDocumentBuilder = new domain_1.DidDocumentBuilder(didJwk.did)
        .addContext(constants_1.SECURITY_JWS_CONTEXT_URL)
        .addVerificationMethod(verificationMethod);
    if (didJwk.allowsSigning) {
        didDocumentBuilder
            .addAuthentication(verificationMethod.id)
            .addAssertionMethod(verificationMethod.id)
            .addCapabilityDelegation(verificationMethod.id)
            .addCapabilityInvocation(verificationMethod.id);
    }
    if (didJwk.allowsEncrypting) {
        didDocumentBuilder.addKeyAgreement(verificationMethod.id);
    }
    return didDocumentBuilder.build();
}
//# sourceMappingURL=didJwkDidDocument.js.map