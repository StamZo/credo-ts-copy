"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishMnemonic = void 0;
exports.validateSpecCompliantPayload = validateSpecCompliantPayload;
exports.createMsgCreateDidDocPayloadToSign = createMsgCreateDidDocPayloadToSign;
exports.createMsgDeactivateDidDocPayloadToSign = createMsgDeactivateDidDocPayloadToSign;
exports.generateDidDoc = generateDidDoc;
exports.getClosestResourceVersion = getClosestResourceVersion;
exports.filterResourcesByNameAndType = filterResourcesByNameAndType;
exports.renderResourceData = renderResourceData;
exports.getCosmosPayerWallet = getCosmosPayerWallet;
const sdk_1 = require("@cheqd/sdk");
const v2_1 = require("@cheqd/ts-proto/cheqd/did/v2");
const crypto_1 = require("@cosmjs/crypto");
const proto_signing_1 = require("@cosmjs/proto-signing");
const core_1 = require("@credo-ts/core");
function validateSpecCompliantPayload(didDocument) {
    // id is required, validated on both compile and runtime
    if (!didDocument.id && !didDocument.id.startsWith('did:cheqd:'))
        return { valid: false, error: 'id is required' };
    // verificationMethod is required
    if (!didDocument.verificationMethod)
        return { valid: false, error: 'verificationMethod is required' };
    // verificationMethod must be an array
    if (!Array.isArray(didDocument.verificationMethod))
        return { valid: false, error: 'verificationMethod must be an array' };
    // verificationMethod must be not be empty
    if (!didDocument.verificationMethod.length)
        return { valid: false, error: 'verificationMethod must be not be empty' };
    // verificationMethod types must be supported
    const isValidVerificationMethod = didDocument.verificationMethod.every((vm) => {
        switch (vm.type) {
            case sdk_1.VerificationMethods.Ed255192020:
                return vm.publicKeyMultibase != null;
            case sdk_1.VerificationMethods.JWK:
                return vm.publicKeyJwk != null;
            case sdk_1.VerificationMethods.Ed255192018:
                return vm.publicKeyBase58 != null;
            default:
                return false;
        }
    });
    if (!isValidVerificationMethod)
        return { valid: false, error: 'verificationMethod publicKey is Invalid' };
    const isValidService = didDocument.service
        ? didDocument?.service?.every((s) => {
            return s?.serviceEndpoint && s?.id && s?.type;
        })
        : true;
    if (!isValidService)
        return { valid: false, error: 'Service is Invalid' };
    return { valid: true };
}
// Create helpers in sdk like MsgCreateDidDocPayload.fromDIDDocument to replace the below
async function createMsgCreateDidDocPayloadToSign(didPayload, versionId) {
    didPayload.service = didPayload.service?.map((e) => {
        return {
            ...e,
            serviceEndpoint: Array.isArray(e.serviceEndpoint) ? e.serviceEndpoint : [e.serviceEndpoint],
        };
    });
    const { protobufVerificationMethod, protobufService } = await sdk_1.DIDModule.validateSpecCompliantPayload(didPayload);
    return v2_1.MsgCreateDidDocPayload.encode(v2_1.MsgCreateDidDocPayload.fromPartial({
        context: didPayload?.['@context'],
        id: didPayload.id,
        controller: didPayload.controller,
        verificationMethod: protobufVerificationMethod,
        authentication: didPayload.authentication,
        assertionMethod: didPayload.assertionMethod,
        capabilityInvocation: didPayload.capabilityInvocation,
        capabilityDelegation: didPayload.capabilityDelegation,
        keyAgreement: didPayload.keyAgreement,
        service: protobufService,
        alsoKnownAs: didPayload.alsoKnownAs,
        versionId,
    })).finish();
}
function createMsgDeactivateDidDocPayloadToSign(didPayload, versionId) {
    return v2_1.MsgDeactivateDidDocPayload.encode(v2_1.MsgDeactivateDidDocPayload.fromPartial({
        id: didPayload.id,
        versionId,
    })).finish();
}
function generateDidDoc(options) {
    const { verificationMethod, methodSpecificIdAlgo, verificationMethodId, network, publicKey } = options;
    const verificationKeys = (0, sdk_1.createVerificationKeys)(publicKey, methodSpecificIdAlgo, verificationMethodId, network);
    if (!verificationKeys) {
        throw new Error('Invalid DID options');
    }
    const verificationMethods = (0, sdk_1.createDidVerificationMethod)([verificationMethod], [verificationKeys]);
    const didPayload = (0, sdk_1.createDidPayload)(verificationMethods, [verificationKeys]);
    return core_1.JsonTransformer.fromJSON(didPayload, core_1.DidDocument);
}
function getClosestResourceVersion(resources, date) {
    let minDiff = Number.POSITIVE_INFINITY;
    let closest = undefined;
    // TODO: if the cheqd/sdk returns sorted resources, change this to binary search
    for (const resource of resources) {
        if (!resource.created)
            throw new core_1.CredoError("Missing required property 'created' on resource");
        if (resource.created.getTime() < date.getTime()) {
            const diff = date.getTime() - resource.created.getTime();
            if (diff < minDiff) {
                closest = resource;
                minDiff = diff;
            }
        }
    }
    return closest;
}
function filterResourcesByNameAndType(resources, name, type) {
    return resources.filter((resource) => resource.name === name && resource.resourceType === type);
}
async function renderResourceData(data, mimeType) {
    if (mimeType === 'application/json') {
        return await core_1.JsonEncoder.fromBuffer(data);
    }
    if (mimeType === 'text/plain') {
        return core_1.TypedArrayEncoder.toUtf8String(data);
    }
    return core_1.TypedArrayEncoder.toBase64URL(data);
}
class EnglishMnemonic extends crypto_1.EnglishMnemonic {
}
exports.EnglishMnemonic = EnglishMnemonic;
EnglishMnemonic._mnemonicMatcher = /^[a-z]+( [a-z]+)*$/;
function getCosmosPayerWallet(cosmosPayerSeed) {
    if (!cosmosPayerSeed || cosmosPayerSeed === '') {
        return proto_signing_1.DirectSecp256k1HdWallet.generate();
    }
    return EnglishMnemonic._mnemonicMatcher.test(cosmosPayerSeed)
        ? proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(cosmosPayerSeed, { prefix: 'cheqd' })
        : proto_signing_1.DirectSecp256k1Wallet.fromKey(core_1.TypedArrayEncoder.fromString(cosmosPayerSeed.replace(/^0x/, '')), 'cheqd');
}
//# sourceMappingURL=didCheqdUtil.js.map