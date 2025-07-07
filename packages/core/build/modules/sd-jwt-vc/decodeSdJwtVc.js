"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdJwtVcHasher = sdJwtVcHasher;
exports.decodeSdJwtVc = decodeSdJwtVc;
const decode_1 = require("@sd-jwt/decode");
const crypto_1 = require("../../crypto");
const index_1 = require("../vc/index");
function sdJwtVcHasher(data, alg) {
    return crypto_1.Hasher.hash(typeof data === 'string' ? data : new Uint8Array(data), alg);
}
function decodeSdJwtVc(compactSdJwtVc, typeMetadata) {
    // NOTE: we use decodeSdJwtSync so we can make this method sync
    const { jwt, disclosures, kbJwt } = (0, decode_1.decodeSdJwtSync)(compactSdJwtVc, sdJwtVcHasher);
    const prettyClaims = (0, decode_1.getClaimsSync)(jwt.payload, disclosures, sdJwtVcHasher);
    return {
        compact: compactSdJwtVc,
        header: jwt.header,
        payload: jwt.payload,
        prettyClaims: prettyClaims,
        claimFormat: index_1.ClaimFormat.SdJwtVc,
        encoded: compactSdJwtVc,
        kbJwt: kbJwt
            ? {
                payload: kbJwt.payload,
                header: kbJwt.header,
            }
            : undefined,
        ...(typeMetadata && { typeMetadata }),
    };
}
//# sourceMappingURL=decodeSdJwtVc.js.map