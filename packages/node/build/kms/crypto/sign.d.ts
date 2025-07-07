import type { CanBePromise } from '@credo-ts/core';
import { Kms } from '@credo-ts/core';
export declare function performSign(key: Kms.KmsJwkPrivate, algorithm: Kms.KnownJwaSignatureAlgorithm, data: Uint8Array): CanBePromise<Uint8Array>;
export declare const nodeSupportedJwaAlgorithm: ["RS256", "PS256", "HS256", "ES256", "ES256K", "RS384", "PS384", "HS384", "ES384", "RS512", "PS512", "HS512", "ES512", "EdDSA"];
export declare function mapJwaSignatureAlgorithmToNode(algorithm: Kms.KnownJwaSignatureAlgorithm): "sha256" | "sha384" | "sha512" | undefined;
