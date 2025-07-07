"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSignRequest = multiSignRequest;
exports.signRequest = signRequest;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const didIndyUtil_1 = require("../dids/didIndyUtil");
async function multiSignRequest(agentContext, request, signingKey, identifier) {
    const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
    const { signature } = await kms.sign({
        data: core_2.TypedArrayEncoder.fromString(request.signatureInput),
        algorithm: 'EdDSA',
        keyId: signingKey.keyId,
    });
    request.setMultiSignature({
        signature,
        identifier,
    });
    return request;
}
async function signRequest(agentContext, pool, request, submitterDid) {
    const signingKey = await (0, didIndyUtil_1.verificationPublicJwkForIndyDid)(agentContext, submitterDid);
    const signedRequest = await pool.prepareWriteRequest(agentContext, request, signingKey);
    return signedRequest;
}
//# sourceMappingURL=sign.js.map