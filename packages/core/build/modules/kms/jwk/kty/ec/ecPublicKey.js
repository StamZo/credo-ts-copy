"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecCrvToCurveParams = void 0;
exports.ecPublicJwkToPublicKey = ecPublicJwkToPublicKey;
exports.ecPublicKeyToPublicJwk = ecPublicKeyToPublicJwk;
const ec_compression_1 = require("ec-compression");
const utils_1 = require("../../../../../utils");
const KeyManagementError_1 = require("../../../error/KeyManagementError");
// CurveParams for ec-compression lib
exports.ecCrvToCurveParams = {
    'P-256': ec_compression_1.Secp256r1,
    'P-384': ec_compression_1.Secp384r1,
    'P-521': ec_compression_1.Secp521r1,
    secp256k1: ec_compression_1.Secp256k1,
};
function ecPublicJwkToPublicKey(publicJwk, { compressed = false } = {}) {
    const xAsBytes = Uint8Array.from(utils_1.TypedArrayEncoder.fromBase64(publicJwk.x));
    const yAsBytes = Uint8Array.from(utils_1.TypedArrayEncoder.fromBase64(publicJwk.y));
    const affinePoint = new ec_compression_1.AffinePoint(xAsBytes, yAsBytes);
    return compressed ? affinePoint.compressedForm : affinePoint.decompressedForm;
}
function ecPublicKeyToPublicJwk(publicKey, crv) {
    const curveParams = exports.ecCrvToCurveParams[crv];
    if (!curveParams) {
        throw new KeyManagementError_1.KeyManagementError(`kty EC with crv '${crv}' is not supported for creating jwk based on public key bytes`);
    }
    let affinePoint;
    if ((0, ec_compression_1.isValidCompressedPublicKeyFormat)(publicKey, curveParams)) {
        affinePoint = ec_compression_1.AffinePoint.fromCompressedPoint(publicKey, curveParams);
    }
    else if ((0, ec_compression_1.isValidDecompressedPublicKeyFormat)(publicKey, curveParams)) {
        affinePoint = ec_compression_1.AffinePoint.fromDecompressedPoint(publicKey, curveParams);
    }
    else {
        throw new KeyManagementError_1.KeyManagementError(`public key for kty EC with crv '${crv}' is neither a valid compressed or uncompressed key. Key prefix '${publicKey[0]}', key length '${publicKey.length}'`);
    }
    const jwk = {
        kty: 'EC',
        crv,
        x: utils_1.TypedArrayEncoder.toBase64URL(affinePoint.xBytes),
        y: utils_1.TypedArrayEncoder.toBase64URL(affinePoint.yBytes),
    };
    return jwk;
}
//# sourceMappingURL=ecPublicKey.js.map