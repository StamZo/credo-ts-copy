"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPrivateKeyToPrivateJwk = transformPrivateKeyToPrivateJwk;
exports.transformSeedToPrivateJwk = transformSeedToPrivateJwk;
const core_1 = require("@credo-ts/core");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const askarKeyTypes_1 = require("./askarKeyTypes");
/**
 * Method to transform private key bytes into a private jwk,
 * which allows the key to be imported in the KMS API.
 *
 * This method is to still allow private keys that were
 * used before the KMS API was introduced, to be used and imported.
 *
 * @example
 * ```ts
 * import { transformPrivateKeyToPrivateJwk } from '@credo-ts/askar'
 *
 * const { privateJwk } = transformPrivateKeyToPrivateJwk({
 *   type: {
 *     kty: 'EC',
 *     crv: 'P-256',
 *   },
 *   privateKey: TypedArrayEncoder.fromString('00000000000000000000000000000My1')
 * })
 *
 * const { keyId } = await agent.kms.importKey({
 *   privateJwk
 * })
 * ```
 */
function transformPrivateKeyToPrivateJwk({ type, privateKey, }) {
    const askarAlgorithm = askarKeyTypes_1.jwkCrvToAskarAlg[type.crv];
    if (!askarAlgorithm) {
        throw new core_1.CredoError(`kty '${type.kty}' with crv '${type.crv}' not supported by Askar`);
    }
    const privateJwk = askar_shared_1.Key.fromSecretBytes({
        algorithm: askarAlgorithm,
        secretKey: privateKey,
    }).jwkSecret;
    return {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        privateJwk: privateJwk,
    };
}
/**
 * Method to transform seed into a private jwk,
 * which allows the key to be imported in the KMS API.
 *
 * This method is to still allow seeds that were
 * used before the KMS API was introduced, to be used and imported.
 *
 * @example
 * ```ts
 * import { transformSeedToPrivateJwk } from '@credo-ts/askar'
 *
 * const { privateJwk } = transformSeedToPrivateJwk({
 *   type: {
 *     kty: 'EC',
 *     crv: 'P-256',
 *   },
 *   seed: TypedArrayEncoder.fromString('00000000000000000000000000000My1')
 * })
 *
 * const { keyId } = await agent.kms.importKey({
 *   privateJwk
 * })
 * ```
 */
function transformSeedToPrivateJwk({ type, seed, }) {
    const askarAlgorithm = askarKeyTypes_1.jwkCrvToAskarAlg[type.crv];
    if (!askarAlgorithm) {
        throw new core_1.CredoError(`kty '${type.kty}' with crv '${type.crv}' not supported by Askar`);
    }
    const privateJwk = askar_shared_1.Key.fromSeed({
        algorithm: askarAlgorithm,
        seed,
    }).jwkSecret;
    return {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        privateJwk: privateJwk,
    };
}
//# sourceMappingURL=transformPrivateKey.js.map