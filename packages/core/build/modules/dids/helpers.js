"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDidKey = isDidKey;
exports.didKeyToVerkey = didKeyToVerkey;
exports.verkeyToDidKey = verkeyToDidKey;
exports.didKeyToEd25519PublicJwk = didKeyToEd25519PublicJwk;
exports.verkeyToPublicJwk = verkeyToPublicJwk;
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const kms_1 = require("../kms");
const DidKey_1 = require("./methods/key/DidKey");
function isDidKey(key) {
    return (0, utils_1.isDid)(key, 'key');
}
function didKeyToVerkey(key) {
    if (isDidKey(key)) {
        const publicKey = DidKey_1.DidKey.fromDid(key).publicJwk.publicKey;
        if (publicKey.kty !== 'OKP' || publicKey.crv !== 'Ed25519') {
            throw new error_1.CredoError('Expected OKP key with crv Ed25519');
        }
        const publicKeyBase58 = utils_1.TypedArrayEncoder.toBase58(publicKey.publicKey);
        return publicKeyBase58;
    }
    return key;
}
function verkeyToDidKey(verkey) {
    if (isDidKey(verkey))
        return verkey;
    const ed25519Key = verkeyToPublicJwk(verkey);
    const didKey = new DidKey_1.DidKey(ed25519Key);
    return didKey.did;
}
function didKeyToEd25519PublicJwk(key) {
    const didKey = DidKey_1.DidKey.fromDid(key);
    if (didKey.publicJwk.is(kms_1.Ed25519PublicJwk)) {
        return didKey.publicJwk;
    }
    throw new error_1.CredoError(`Expected public jwk to have kty OKP with crv Ed25519, found ${didKey.publicJwk.jwkTypehumanDescription}`);
}
function verkeyToPublicJwk(verkey) {
    const ed25519Key = kms_1.PublicJwk.fromPublicKey({
        kty: 'OKP',
        crv: 'Ed25519',
        publicKey: utils_1.TypedArrayEncoder.fromBase58(verkey),
    });
    return ed25519Key;
}
//# sourceMappingURL=helpers.js.map