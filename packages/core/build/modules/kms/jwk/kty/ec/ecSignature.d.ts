import { KmsJwkPublicEc } from './ecJwk';
/**
 * Converts a RAW EC signature to DER format
 *
 * @param rawSignature - Raw signature as r || s concatenated values
 * @param crv - The EC crv of the key used for the signature
 * @returns DER encoded signature
 */
export declare function rawEcSignatureToDer(rawSignature: Uint8Array, crv: KmsJwkPublicEc['crv']): Uint8Array;
/**
 * Converts a DER encoded EC signature to RAW format
 *
 * @param derSignature - DER encoded signature
 * @param crv - The EC crv of the key used for the signature
 * @returns Raw signature as r || s concatenated values
 */
export declare function derEcSignatureToRaw(derSignature: Uint8Array, crv: KmsJwkPublicEc['crv']): Uint8Array;
