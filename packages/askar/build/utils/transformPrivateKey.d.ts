import { Buffer, Kms } from '@credo-ts/core';
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
export declare function transformPrivateKeyToPrivateJwk<Type extends Kms.KmsCreateKeyTypeOkp | Kms.KmsCreateKeyTypeEc>({ type, privateKey, }: {
    type: Type;
    privateKey: Buffer;
}): {
    privateJwk: Kms.KmsJwkPrivateFromKmsJwkPublic<Kms.KmsJwkPublicFromCreateType<Type>>;
};
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
export declare function transformSeedToPrivateJwk<Type extends Kms.KmsCreateKeyTypeOkp | Kms.KmsCreateKeyTypeEc>({ type, seed, }: {
    type: Type;
    seed: Buffer;
}): {
    privateJwk: Kms.KmsJwkPrivateFromKmsJwkPublic<Kms.KmsJwkPublicFromCreateType<Type>>;
};
