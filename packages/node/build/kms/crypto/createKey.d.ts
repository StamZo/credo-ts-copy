import { Kms } from '@credo-ts/core';
declare const nodeSupportedEcCrvs: ("P-256" | "P-384" | "P-521" | "secp256k1")[];
export type NodeKmsSupportedEcCrvs = (typeof nodeSupportedEcCrvs)[number];
export declare function assertNodeSupportedEcCrv(options: Kms.KmsCreateKeyTypeEc): asserts options is Kms.KmsCreateKeyTypeEc & {
    crv: NodeKmsSupportedEcCrvs;
};
export declare function createEcKey({ crv }: Kms.KmsCreateKeyTypeEc & {
    crv: NodeKmsSupportedEcCrvs;
}): Promise<{
    privateJwk: Kms.KmsJwkPrivateEc;
    publicJwk: Kms.KmsJwkPublicEc;
}>;
export declare function createRsaKey({ modulusLength }: Kms.KmsCreateKeyTypeRsa): Promise<{
    privateJwk: Kms.KmsJwkPrivateRsa;
    publicJwk: Kms.KmsJwkPublicRsa;
}>;
declare const nodeSupportedOkpCrvs: ("X25519" | "Ed25519")[];
type NodeKmsSupportedOkpCrvs = (typeof nodeSupportedOkpCrvs)[number];
export declare function assertNodeSupportedOkpCrv(options: Kms.KmsCreateKeyTypeOkp): asserts options is Kms.KmsCreateKeyTypeOkp & {
    crv: NodeKmsSupportedOkpCrvs;
};
export declare function createOkpKey({ crv }: Kms.KmsCreateKeyTypeOkp & {
    crv: NodeKmsSupportedOkpCrvs;
}): Promise<{
    privateJwk: Kms.KmsJwkPrivateOkp;
    publicJwk: Kms.KmsJwkPublicOkp;
}>;
declare const nodeSupportedOctAlgorithms: ("aes" | "hmac")[];
type NodeSupportedOctAlgorithms = (typeof nodeSupportedOctAlgorithms)[number];
export declare function assertNodeSupportedOctAlgorithm(options: Kms.KmsCreateKeyTypeOct): asserts options is Kms.KmsCreateKeyTypeOct & {
    algorithm: NodeSupportedOctAlgorithms;
};
export declare function createOctKey(options: Kms.KmsCreateKeyTypeOct & {
    algorithm: NodeSupportedOctAlgorithms;
}): Promise<{
    privateJwk: Kms.KmsJwkPrivateOct;
    publicJwk: Kms.KmsJwkPublicOct;
}>;
export {};
