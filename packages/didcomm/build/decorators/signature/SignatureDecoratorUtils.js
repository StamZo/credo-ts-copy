"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackAndVerifySignatureDecorator = unpackAndVerifySignatureDecorator;
exports.signData = signData;
const core_1 = require("@credo-ts/core");
const SignatureDecorator_1 = require("./SignatureDecorator");
/**
 * Unpack and verify signed data before casting it to the supplied type.
 *
 * @param decorator Signature decorator to unpack and verify
 * @param wallet wallet instance
 *
 * @return Resulting data
 */
async function unpackAndVerifySignatureDecorator(agentContext, decorator) {
    const signerVerkey = decorator.signer;
    const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
    const publicJwk = core_1.Kms.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'Ed25519',
        publicKey: core_1.TypedArrayEncoder.fromBase58(signerVerkey),
    });
    // first 8 bytes are for 64 bit integer from unix epoch
    const signedData = core_1.TypedArrayEncoder.fromBase64(decorator.signatureData);
    const signature = core_1.TypedArrayEncoder.fromBase64(decorator.signature);
    const result = await kms.verify({
        algorithm: 'EdDSA',
        data: signedData,
        key: {
            publicJwk: publicJwk.toJson(),
        },
        signature,
    });
    if (!result.verified) {
        throw new core_1.CredoError('Signature is not valid');
    }
    return core_1.JsonEncoder.fromBuffer(signedData.slice(8));
}
/**
 * Sign data supplied and return a signature decorator.
 *
 * @param data the data to sign
 * @param wallet the wallet containing a key to use for signing
 * @param signerKey signer key
 *
 * @returns Resulting signature decorator.
 */
async function signData(agentContext, data, signerKey) {
    const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
    const dataBuffer = core_1.Buffer.concat([core_1.utils.timestamp(), core_1.JsonEncoder.toBuffer(data)]);
    const result = await kms.sign({ data: dataBuffer, algorithm: 'EdDSA', keyId: signerKey.keyId });
    const signatureDecorator = new SignatureDecorator_1.SignatureDecorator({
        signatureType: 'https://didcomm.org/signature/1.0/ed25519Sha512_single',
        signature: core_1.TypedArrayEncoder.toBase64URL(result.signature),
        signatureData: core_1.TypedArrayEncoder.toBase64URL(dataBuffer),
        signer: core_1.TypedArrayEncoder.toBase58(signerKey.publicKey.publicKey),
    });
    return signatureDecorator;
}
//# sourceMappingURL=SignatureDecoratorUtils.js.map